#version 300 es // These is an OpenGL ES 3.0 Shader!

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexCoord;

out vec2 texCoord;
out vec3 normal;
out vec3 lightVec;
out vec3 viewVec;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;

void main() {
  // Position of vertex in clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  // Transform vertexes into eye space
  vec4 vert = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  // Reorient normals into eye space
  normal = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));

  lightVec = vec3(vec4(uLightPosition, 1.0) - vert);
  viewVec  = -vec3(vert);  
  
  // Pass texCoord to the fragment shader
  texCoord = aVertexTexCoord;
}