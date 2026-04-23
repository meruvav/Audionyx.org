import { useEffect, useRef } from 'react';

const vertexSource = `
attribute vec2 a_position;
uniform vec2 u_mouse;
uniform float u_time;
varying float v_strength;

void main() {
  float dist = distance(a_position, u_mouse);
  float pulse = sin(u_time * 0.001 + a_position.x * 8.0 + a_position.y * 5.0) * 0.04;
  vec2 displaced = a_position + normalize(a_position - u_mouse + 0.001) * (0.06 / (dist * 6.0 + 0.8)) + pulse;
  gl_Position = vec4(displaced, 0.0, 1.0);
  gl_PointSize = 3.5 + 5.0 / (dist * 8.0 + 1.0);
  v_strength = 1.0 / (dist * 4.0 + 0.65);
}
`;

const fragmentSource = `
precision mediump float;
varying float v_strength;

void main() {
  vec2 coord = gl_PointCoord - 0.5;
  float alpha = smoothstep(0.45, 0.0, length(coord));
  vec3 base = mix(vec3(0.22, 0.59, 0.92), vec3(0.53, 1.0, 0.88), clamp(v_strength, 0.0, 1.0));
  gl_FragColor = vec4(base, alpha * 0.85);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || 'Unable to compile shader');
  }

  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(info || 'Unable to link program');
  }

  return program;
}

export default function WebGLHeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { alpha: true, antialias: true });
    if (!gl || !canvas) {
      return undefined;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const buffer = gl.createBuffer();

    const points = [];
    for (let x = -1; x <= 1.01; x += 0.12) {
      for (let y = -1; y <= 1.01; y += 0.12) {
        points.push(x, y);
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let frameId = 0;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth * ratio;
      const height = canvas.clientHeight * ratio;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((event.clientY - rect.top) / rect.height) * -2 + 1;
    }

    function render(time) {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.uniform1f(timeLocation, time);
      gl.drawArrays(gl.POINTS, 0, points.length / 2);
      frameId = window.requestAnimationFrame(render);
    }

    canvas.addEventListener('pointermove', handlePointerMove);
    frameId = window.requestAnimationFrame(render);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(frameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-webgl-canvas" aria-hidden="true" />;
}
