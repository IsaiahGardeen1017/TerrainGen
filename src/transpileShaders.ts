import { Content_Displays, Content_Sliders, ShaderDisplay, Uniforms, UniformSlider } from './content.ts';
import { addSpansToGlslCode } from './tokenizer.ts';

export const BUILD_PATH = './build';
const srcPath = './src/static';
const shaderSrcPath = './src/shaders';
const dynPath = './src/dynamicHtml';

const canvasSectionTemplate = Deno.readTextFileSync(dynPath + '/canvasSection.html');
const sliderTemplate = Deno.readTextFileSync(dynPath + '/slider.html');
const codeSnippetTemplate = Deno.readTextFileSync(dynPath + '/code-snippet.html');

export async function build(devmode: boolean) {
	const startTime = Date.now();
	copyStaticToBuild();
	transpileShaders();
	contentsToJson();
	buildDynamicHTML(devmode);
	await format();
	const endTime = Date.now();
	console.log(`Built in ${(endTime - startTime)}ms`);
}

function contentsToJson() {
	Deno.writeTextFileSync(BUILD_PATH + '/content-displays.json', JSON.stringify(Content_Displays));
}

export function copyStaticToBuild() {
	try {
		Deno.removeSync(BUILD_PATH, { recursive: true });
	} catch (e) {
		console.error(e);
	}
	Deno.mkdirSync(BUILD_PATH);
	const itemsToCopy = Deno.readDirSync(srcPath);
	itemsToCopy.forEach((dirEntry) => {
		if (dirEntry.isFile) {
			const contents = Deno.readTextFileSync(srcPath + '/' + dirEntry.name);
			Deno.writeTextFileSync(BUILD_PATH + '/' + dirEntry.name, contents);
			//console.log('copy ', srcPath + '/' + dirEntry.name, BUILD_PATH + '/' + dirEntry.name)
			Deno.copyFileSync(srcPath + '/' + dirEntry.name, BUILD_PATH + '/' + dirEntry.name);
		}
	});
}

export function transpileShaders() {
	const header = Deno.readTextFileSync(shaderSrcPath + '/header.glsl');
	const common = Deno.readTextFileSync(shaderSrcPath + '/common.glsl');
	const footer = Deno.readTextFileSync(shaderSrcPath + '/footer.glsl');

	const shaderBldPath = BUILD_PATH + '/shaders';
	try {
		Deno.removeSync(shaderBldPath, { recursive: true });
	} catch (e) {}
	Deno.mkdirSync(shaderBldPath);

	const files = Deno.readDirSync(shaderSrcPath + '/mains');
	files.forEach((dirEntry) => {
		if (dirEntry.isFile) {
			const filepath = shaderSrcPath + '/mains/' + dirEntry.name;
			const contents = [header, common, Deno.readTextFileSync(filepath), footer].join('\n');
			Deno.writeTextFileSync(shaderBldPath + '/c_' + dirEntry.name, contents);

			const contentsShaderToy = [header, common, Deno.readTextFileSync(filepath)].join('\n');
			Deno.writeTextFileSync(shaderBldPath + '/_shadertoy_' + dirEntry.name, contentsShaderToy);
		}
	});
}

function buildDynamicHTML(devmode: boolean) {
	const index = Deno.readTextFileSync(dynPath + '/index.html');

	const sectionHtmls = Content_Displays.map((display): string => {
		return buildCanvasSection(display);
	}).join('\n<hr/>\n');

	const devmodeScript = devmode ? `<script src="devmode.js"></script>` : '';

	const uniformsScript = Deno.readTextFileSync(dynPath + '/uniformsScript.html')
		.replace('{{@uniformsIds}}', Object.keys(Content_Sliders).join(`','`));

	const finalHtml = index.replace('{{@canvasSections}}', sectionHtmls)
		.replace('{{@devmode}}', devmodeScript)
		.replace('{{@uniformsScript}}', uniformsScript);
	Deno.writeTextFileSync(BUILD_PATH + '/index.html', finalHtml);
}

function buildSlider(id: Uniforms): string {
	const slider = Content_Sliders[id];
	let html = sliderTemplate;
	return html.replaceAll('{{@title}}', slider.title)
		.replaceAll('{{@min}}', slider.min + '')
		.replaceAll('{{@max}}', slider.max + '')
		.replaceAll('{{@id}}', id)
		.replaceAll('{{@step}}', slider.step + '')
		.replaceAll('{{@value}}', slider.start + '');
}

function buildCodeSnippet(id: string): string {
	const code = Deno.readTextFileSync(`${shaderSrcPath}/mains/${id}.glsl`);
	const tokenizedCode = addSpansToGlslCode(code);
	let html = codeSnippetTemplate;
	return html.replaceAll('{{@code}}', tokenizedCode);
}

function buildCanvasSection(display: ShaderDisplay): string {
	let html = canvasSectionTemplate;
	const sliders = display.uniforms.map((uniformId) => {
		return buildSlider(uniformId);
	});
	return html.replaceAll('{{@id}}', display.id)
		.replace('{{@sliders}}', sliders.join('\n'))
		.replaceAll('{{@title}}', display.title)
		.replaceAll('{{@text}}', display.text)
		.replaceAll('{{@shader-code}}', buildCodeSnippet(display.id));
}

async function format(): Promise<void> {
	const command = new Deno.Command('deno', {
		args: ['fmt', BUILD_PATH],
		stdout: 'null',
		stderr: 'piped',
	});

	const { code, success, stderr } = await command.output();

	if (!success) {
		console.error(`Error formatting ${BUILD_PATH}:`);
		if (stderr.length > 0) {
			console.error(new TextDecoder().decode(stderr));
		} else {
			console.error(`Deno fmt process exited with code ${code}`);
		}
	}
}
