#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of Vertex Shader in Version 3.0; an 'in' inside of a vertex shader is an attribute; an 'out' inside of a vertex shader is a varying

// An Attribute is a value pulled from a bound buffer on the GPU; You set these up in the client code (our JS application); An attribute does not use the 'attribute' keyword in 3.0.; We use the 'in' key word inside the vertex shader for attributes.
in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aVertexTexCoord;

//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
// out vec3 outColor;
out vec3 normal;
out vec3 lightVec;
out vec3 viewVec;

out vec4 color;
out vec2 texCoord;

// Uniforms do not change from one shader invocation to the next, these are set "constant" values that can be read by vertex and fragment shader; if you want to use a uniform in the fragment shader then you must declare it at the top as well.
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;

void main() {
  // Transform vertexes into eye space
  vec4 vert = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  // Reorient normals into eye space
  vec3 normal = vec3(uModelViewMatrix * vec4(aVertexNormal, 0.0));

  vec3 lightVec = vec3(vec4(uLightPosition, 1.0) - vert);
  vec3 viewVec  = -vec3(vert);

  // Normalize values
  vec3 norm = normalize(normal);
  vec3 L = normalize(lightVec);
  vec3 V = normalize(viewVec);
  vec3 halfAngle = normalize(L + V);

  // Get cosine between vectors with dot product
  float NdotL = clamp(dot(L, norm), 0.0, 1.0);
  float NdotH = clamp(dot(halfAngle, norm), 0.0, 1.0);
  
  // Calculate diffuse and specular with material components
  float diffuse  = 0.2 * NdotL + 0.6;
  float specular = pow(NdotH, 70.0);


  // Lighting for fragment
  vec4 lighting = vec4(0.5 + diffuse + specular);
  // Pass color to fragment shader
  color = lighting;
  texCoord = aVertexTexCoord;

  // Position of vertex in clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}