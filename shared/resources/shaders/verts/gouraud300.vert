#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of Vertex Shader in Version 3.0; an 'in' inside of a vertex shader is an attribute; an 'out' inside of a vertex shader is a varying

// An Attribute is a value pulled from a bound buffer on the GPU; You set these up in the client code (our JS application); An attribute does not use the 'attribute' keyword in 3.0.; We use the 'in' key word inside the vertex shader for attributes.
in vec3 aVertexPosition;
in vec3 aVertexNormal;

//In OpenGL vayring is replaced by in/out (vertex shader creates it as 'out', fragment uses it as an 'in')
// out vec3 outColor;
out vec3 lighting;
out vec4 color;

// Uniforms do not change from one shader invocation to the next, these are set "constant" values that can be read by vertex and fragment shader; if you want to use a uniform in the fragment shader then you must declare it at the top as well.
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightPosition;

// uniform mat3 uNormalMatrix;

void main() {
  // highp vec3 glAmbient = vec3(0.25, 0.25, 0.25);
  // highp vec3 glDiffuse = vec3(0.4, 0.4, 0.4);
  // highp vec3 glSpecular = vec3(0.774597, 0.774597, 0.774597);
  vec3 glAmbient = vec3(0.25, 0.25, 0.25);
  vec3 glDiffuse = vec3(0.4, 0.4, 0.4);
  vec3 glSpecular = vec3(0.774597, 0.774597, 0.774597);

  vec3 modelViewVertex = vec3(uModelViewMatrix * vec4(aVertexPosition, 0.0));
  vec3 modelViewNormal = vec3(uModelViewMatrix * vec4(aVertexNormal, 1.0));

  // vec4 vert = uModelViewMatrix * gl_Vertex;
  vec3 lightVec = vec3(uLightPosition - modelViewVertex);
  vec3 viewVec  = -vec3(modelViewVertex);

  vec3 norm = normalize(modelViewNormal);

  vec3 L = normalize(lightVec);
  vec3 V = normalize(viewVec);
  vec3 halfAngle = normalize(L + V);

  float NdotL = dot(L, norm);
  float NdotH = clamp(dot(halfAngle, norm), 0.0, 1.0);
  
  // diffuse = Kd*Il(N*L)
  // float diffuse  = 1.0 * NdotL + 0.5;
  float diffuse  = 1.0 * NdotL;
  // float specular = pow(NdotH, 64.0);
  float specular = pow(NdotH, 76.8);

  lighting = vec3(glAmbient + diffuse * specular);
  // lighting = ambientLight + diffuseLight * (dot(aVertexNormal, uLightPosition));
  color = vec4(vec3(0.0,1.0,0.0) * lighting, 1.0);


  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}

// Ambient light + diffuse light * dot(Normal, light position)
// spec = spec * (N*)