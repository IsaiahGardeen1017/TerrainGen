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
		start: 1
	},
	scaleFactor: {
		min: 0.2,
		max: 2.5,
		step: 0.01,
		title: 'Scale Factor',
		start: 1
	}
};

export type ShaderDisplay = {
	name: string;
	uniforms: Uniforms[];
};

export const Content_Displays: ShaderDisplay[] = [
	{
		name: 'grid_visualizer',
		uniforms: ['timeFactor', 'scaleFactor'],
	},
	{
		name: 'perlin',
		uniforms: ['timeFactor'],
	},
	{
		name: 'normal_perlin',
		uniforms: ['scaleFactor']
	},
];
