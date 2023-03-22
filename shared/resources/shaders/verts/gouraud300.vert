#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of Vertex Shader in Version 3.0; an 'in' inside of a vertex shader is an attribute; an 'out' inside of a vertex shader is a varying

// An Attribute is a value pulled from a bound buffer on the GPU; You set these up in the client code (our JS application); An attribute does not use the 'attribute' keyword in 3.0.; We use the 'in' key word inside the vertex shader for attributes.
in vec3 aVertexPosition;
in vec3 aVertexNormal;

//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
// out vec3 outColor;
// out vec3 lighting;
out vec4 color;

// Uniforms do not change from one shader invocation to the next, these are set "constant" values that can be read by vertex and fragment shader; if you want to use a uniform in the fragment shader then you must declare it at the top as well.
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;

void main() {
  // vec4 glAmbient = vec4(0.25, 0.25, 0.25, 1.0);
  // vec4 glDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
  // vec4 glSpecular = vec4(0.774597, 0.774597, 0.774597, 1.0);
  // float glShininess = 25.6;
  // vec4 glAmbient = vec4(0.2125, 0.1275, 0.054, 1.0);
  // vec4 glDiffuse = vec4(0.714, 0.4284, 0.18144, 1.0);
  // vec4 glSpecular = vec4(0.393548, 0.271906, 0.166721, 1.0);
  // float glShininess = 25.6;
  // vec4 glAmbient = vec4(0.25, 0.148, 0.06475, 1.0);
  // vec4 glDiffuse = vec4(0.4, 0.2368, 0.1036, 1.0);
  // vec4 glSpecular = vec4(0.774597, 0.458561, 0.200621, 1.0);
  // float glShininess = 76.8;
  vec4 glAmbient = vec4(0.25, 0.25, 0.25, 1.0);
  vec4 glDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
  vec4 glSpecular = vec4(0.774597, 0.774597, 0.774597, 1.0);
  float glShininess = 76.8;

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
  vec4 diffuse  = NdotL * glDiffuse;
  vec4 specular = pow(NdotH, glShininess) * glSpecular;

  // Final color for fragment
  vec4 lighting = glAmbient + diffuse + specular;
  // Pass color to fragment shader
  color = vec4(lighting);

  // Position of vertex in clip space
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}