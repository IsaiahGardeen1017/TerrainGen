export type UniformSlider = {
	min: number;
	max: number;
	step: number;
	title: string;
	start: number;
};
export type Uniforms = 'scaleFactor' | 'timeFactor';

export const Content_Sliders: Record<Uniforms, UniformSlider> = {
	timeFactor: {
		min: 0,
		max: 2.0,
		step: 0.01,
		title: 'Time Factor',
		start: 1,
	},
	scaleFactor: {
		min: 0.2,
		max: 2.5,
		step: 0.01,
		title: 'Scale Factor',
		start: 1,
	},
};

export type ShaderDisplay = {
	id: string;
	uniforms: Uniforms[];
	functions: string[];
	text: string;
	title: string;
};

export const Content_Displays: ShaderDisplay[] = [
	{
		id: 'grid_visualizer',
		uniforms: ['timeFactor', 'scaleFactor'],
		text: 'This is the grid we will use to demonstrate all the shaders below, each square is 1 unit',
		title: 'Grid',
		functions: ['normalizeCoords'],
	},
	{
		id: 'hash',
		uniforms: [],
		text: 'To generate perlinNoise we need a hash function, this takes a number as input and returns out a random looking float',
		title: 'Hash',
		functions: [],
	},
	{
		id: 'perlin',
		uniforms: [],
		text: 'Here is basic perlin noise where negative values are mapped to red and positive values are mapped to green',
		title: 'Perlin Noise',
		functions: ['perlinNoise'],
	},
	{
		id: 'normal_perlin',
		uniforms: ['scaleFactor'],
		text:
			'Here we normalize the output of the perlin noise function (-1 to 1) to a between 0 and 1, then feed that value into all color channels',
		title: 'Perlin Noise',
		functions: ['normalizePerlinNoise'],
	},
	{
		id: 'basic_color_map',
		uniforms: [],
		text:
			'Now we can set thresholds for certain values, if normalize perlin noise is less than 0.5 we will output a shade of blue, if it more than 0.5 we output a shade of green.  We can then use the mix() function to get a gradient dependant on the noise, which will represent height',
		title: 'Basic Terrain',
		functions: ['mapPerlinToColor'],
	},
	{
		id: 'octaves',
		uniforms: [],
		text:
			'Something about octaves',
		title: 'Octaves',
		functions: [],
	},
];
