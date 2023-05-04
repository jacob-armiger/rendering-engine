#version 300 es // These is an OpenGL ES 3.0 Shader!

precision mediump float;

out vec4 fragColor;

void main() {

  vec3 color = vec3(50.0,50.0,50.0);

  fragColor = vec4(color, 1.0);
}