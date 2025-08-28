document.addEventListener('DOMContentLoaded', () => {
	onload();
});

const shaders = ['basic', 'mars'];
const startTime = Date.now();

// Custom Uniforms
let timeFactor = 0.1;


async function onload() {

    const timeSlider = document.getElementById("timeSlider");
    const timeValueSpan = document.getElementById("timeValue");
    timeSlider.addEventListener("input", (event) => {
        timeFactor = parseFloat(event.target.value);
        timeValueSpan.textContent = timeFactor.toFixed(2); // Display current value
    });

    for(let i = 0; i < shaders.length; i++){
        await establishShaderDisplay(shaders[i]);
    }
}

async function establishShaderDisplay(shaderName) {
	const canvasElement = document.createElement('canvas');
	const canvasParent = document.getElementById('canvas-parent');
	canvasParent.appendChild(canvasElement);

	const gl = canvasElement.getContext('webgl2');

	if (!gl) {
		alert('Unable to initialize WebGL 2.0. Your browser may not support it.');
		return;
	}

	const fsSource = await loadShader(`shaders/${shaderName}.glsl`);
	const vsSource = await loadShader(`vertex_shader.glsl`);

	const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

	if (!vertexShader || !fragmentShader) return;
	const program = createProgram(gl, vertexShader, fragmentShader);
	if (!program) return;
	gl.useProgram(program);

	//unfiforms
	const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
	const iTimeLoc = gl.getUniformLocation(program, 'iTime');
	const timeFactorLoc = gl.getUniformLocation(program, 'timeFactor');

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const positions = [-1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
	gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(aPositionLoc);

    function render() {
        // Handle canvas resizing
        if (
            canvasElement.width !== canvasElement.clientWidth ||
            canvasElement.height !== canvasElement.clientHeight
        ) {
            canvasElement.width = canvasElement.clientWidth;
            canvasElement.height = canvasElement.clientHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
    
        // Clear the canvas (optional, but good practice)
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        // Set uniforms
        gl.uniform2f(iResolutionLoc, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(iTimeLoc, (Date.now() - startTime) * 0.001); // Time in seconds
        console.log(shaderName, timeFactor, timeFactorLoc);
        gl.uniform1f(timeFactorLoc, timeFactor); // Pass our slider value to the shader
    
        // Draw the quad
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    
        // Loop
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

async function loadShader(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch shader from ${url}: ${response.statusText}`,
		);
	}
	return await response.text();
}

function compileShader(gl, source, type) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(
			'An error occurred compiling the shaders:',
			gl.getShaderInfoLog(shader),
		);
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(
			'Unable to initialize the shader program:',
			gl.getProgramInfoLog(program),
		);
		return null;
	}
	return program;
}

