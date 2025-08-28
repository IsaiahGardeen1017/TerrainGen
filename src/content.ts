export type UniformSlider = {
    min: number,
    max: number
}
export type Uniforms = 'size'


export const sliders: Record<Uniforms, UniformSlider> = {
    size: {
        min: 0.1,
        max: 10
    }
}


export type ShaderDisplay = {
    name: string,
    sliders: Uniforms[]
}

export const displays: ShaderDisplay[] = [
    {
        name: 'simple_perlin_noise',
        sliders: ['size']
    }
]