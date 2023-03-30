#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of Vertex Shader in Version 3.0; an 'in' inside of a vertex shader is an attribute; an 'out' inside of a vertex shader is a varying

// An Attribute is a value pulled from a bound buffer on the GPU; You set these up in the client code (our JS application); An attribute does not use the 'attribute' keyword in 3.0.; We use the 'in' key word inside the vertex shader for attributes.
in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexCoord;

//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
// out vec3 outColor;

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