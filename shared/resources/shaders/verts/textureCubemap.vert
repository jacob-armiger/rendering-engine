#version 300 es // These is an OpenGL ES 3.0 Shader!

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 normal;
out vec3 position;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

/* This shader only works well if the object is in position [0,0,0] 
I believe this is because the up direction changes when [x,y,z] position changes
*/
void main() {
  // Position of vertex in clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

  // Transform vertexes into eye space
  position = (uModelViewMatrix * vec4(aVertexPosition, 1.0)).xyz;
  // Reorient normals into eye space
  normal = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));

  // Uncomment to fix upside down cubemap
  // position  = -vec3(position);
}