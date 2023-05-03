#version 300 es // These is an OpenGL ES 3.0 Shader!

precision mediump float;

in vec3 normal;
in vec3 lightVec;
in vec3 viewVec;

out vec4 fragColor;

void main() {
  vec4 glAmbient = vec4(0.2125, 0.1275, 0.054, 1.0);
  vec4 glDiffuse = vec4(0.714, 0.4284, 0.18144, 1.0);
  vec4 glSpecular = vec4(0.393548, 0.271906, 0.166721, 1.0);
  float glShininess = 25.6;

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
  
  // Final color for vertex
  vec4 lighting = glAmbient + diffuse + specular;
  vec4 color = vec4(lighting);

  fragColor = color;
}