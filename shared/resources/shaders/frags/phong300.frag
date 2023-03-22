#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of a Fragment Shader
// an 'in' inside of a fragment shader is a varying var
// an 'out' inside of a fragment shader is _the_ output you wish to draw (typically a vec4 color)

// We need to tell the shader executable at what precision we want floats to be
// medium precision is a good balance of speed and accuracy.
precision mediump float;

// This is a varying var written to by our vertex shader
// since this is 3.0 we specify it in the fragment shader with "in"
in vec3 normal;
in vec3 lightVec;
in vec3 viewVec;

// We also have to specify the "output" of the fragment shader
// Typically we only output RGBA color, and that is what I will do here!
out vec4 fragColor;

void main() {
  // vec4 glAmbient = vec4(0.24725, 0.1995, 0.0745, 1.0);
  // vec4 glDiffuse = vec4(0.75164, 0.60648, 0.22648, 1.0);
  // vec4 glSpecular = vec4(0.628281, 0.555802, 0.366065, 1.0);
  // float glShininess = 12.8;
  // vec4 glAmbient = vec4(0.25, 0.148, 0.06475, 1.0);
  // vec4 glDiffuse = vec4(0.4, 0.2368, 0.1036, 1.0);
  // vec4 glSpecular = vec4(0.774597, 0.458561, 0.200621, 1.0);
  // float glShininess = 76.8;
  vec4 glAmbient = vec4(0.25, 0.25, 0.25, 1.0);
  vec4 glDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
  vec4 glSpecular = vec4(0.774597, 0.774597, 0.774597, 1.0);
  float glShininess = 76.8;
  // vec4 glAmbient = vec4(0.2125, 0.1275, 0.054, 1.0);
  // vec4 glDiffuse = vec4(0.714, 0.4284, 0.18144, 1.0);
  // vec4 glSpecular = vec4(0.393548, 0.271906, 0.166721, 1.0);
  // float glShininess = 25.6;

  vec3 norm = normalize(normal);

  vec3 L = normalize(lightVec);
  vec3 V = normalize(viewVec);
  vec3 halfAngle = normalize(L + V);

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