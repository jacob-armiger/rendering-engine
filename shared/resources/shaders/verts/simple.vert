#version 300 es // These is an OpenGL ES 3.0 Shader!

in vec3 aVertexPosition;

uniform mat4 uLightViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uLightViewMatrix * vec4(aVertexPosition, 1.0);
}