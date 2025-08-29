import { displays } from './content.ts';

export const BUILD_PATH = './build';
const srcPath = './src/static';
const shaderSrcPath = './src/shaders';

export function build() {
	copyStaticToBuild();
	transpileShaders();
	contentsToJson();
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
