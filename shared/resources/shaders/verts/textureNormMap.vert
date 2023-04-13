#version 300 es // texturePhong

// In's and Out's of Vertex Shader in Version 3.0; an 'in' inside of a vertex shader is an attribute; an 'out' inside of a vertex shader is a varying

// An Attribute is a value pulled from a bound buffer on the GPU; You set these up in the client code (our JS application); An attribute does not use the 'attribute' keyword in 3.0.; We use the 'in' key word inside the vertex shader for attributes.
in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexCoord;
in vec3 aVertexTang;
in vec3 aVertexBitang;

//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
// out vec3 outColor;
// out vec3 normal;
out vec2 texCoord;
// out vec3 lightVec;
// out vec3 viewVec;
out vec3 tangLightPos;
out vec3 tangViewPos;
out vec3 tangFragPos;
// out mat3 tbn;

// Uniforms do not change from one shader invocation to the next, these are set "constant" values that can be read by vertex and fragment shader; if you want to use a uniform in the fragment shader then you must declare it at the top as well.
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;

uniform sampler2D uTexNorm;

void main() {
  // Position of vertex in clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  vec3 t = normalize(vec3(uModelViewMatrix * vec4(aVertexTang, 0.0)));
  vec3 b = normalize(vec3(uModelViewMatrix * vec4(aVertexBitang, 0.0)));
  vec3 n = normalize(vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0)));
  mat3 tbn = mat3(t, b, n);

  tangLightPos = tbn * uLightPosition;
  tangViewPos = tbn * uCameraPosition;
  tangFragPos = tbn * vec3(uModelViewMatrix * vec4(aVertexPosition, 1.0));
  // tangFragPos = -vec3(tangFragPos);

  // Transform vertexes into eye space
  // vec4 vert = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  // Reorient normals into eye space
  // normal = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));

  // lightVec = vec3(vec4(uLightPosition, 1.0) - vert);
  // viewVec  = -vec3(vert);

  // Pass texCoord to the fragment shader
  texCoord = aVertexTexCoord;
}