#version 300 es // These is an OpenGL ES 3.0 Shader!

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexCoord;

out vec2 texCoord;

// Uniforms do not change from one shader invocation to the next, these are set "constant" values that can be read by vertex and fragment shader; if you want to use a uniform in the fragment shader then you must declare it at the top as well.
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;

void main() {
  // Position of vertex in clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  // Pass texCoord to the fragment shader
  texCoord = aVertexTexCoord;
}