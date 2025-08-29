import { displays, ShaderDisplay } from './content.ts';

export const BUILD_PATH = './build';
const srcPath = './src/static';
const shaderSrcPath = './src/shaders';
const dynPath = './src/dynamicHtml'



const canvasSectionTemplate = Deno.readTextFileSync(dynPath + '/canvasSection.html');

export async function build() {
	const startTime = Date.now();
	copyStaticToBuild();
	transpileShaders();
	contentsToJson();
	buildDynamicHTML();
	await format();
	const endTime = Date.now();
	console.log(`Built in ${(endTime - startTime)}ms`);
}




function contentsToJson() {
	Deno.writeTextFileSync(BUILD_PATH + '/content-displays.json', JSON.stringify(displays));
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
	} catch (e) { }
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


function buildDynamicHTML() {
	const index = Deno.readTextFileSync(dynPath + '/index.html');

	const sectionHtmls = displays.map((display): string => {
		return buildCanvasSection(display);
	}).join('\n<hr/>\n');
	const finalHtml = index.replace('{{@canvasSections}}', sectionHtmls);
	Deno.writeTextFileSync(BUILD_PATH + '/index.html', finalHtml);
}


function buildCanvasSection(display: ShaderDisplay): string {
	let html = canvasSectionTemplate;
	return html.replaceAll('{{@id}}', display.name);
}

async function format(): Promise<void> {
	const command = new Deno.Command("deno", {
		args: ["fmt", BUILD_PATH],
		stdout: "null",
		stderr: "piped",
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