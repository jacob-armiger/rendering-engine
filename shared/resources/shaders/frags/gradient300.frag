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

in float yCoord;
in float maxY;
in float minY;

// We also have to specify the "output" of the fragment shader
// Typically we only output RGBA color, and that is what I will do here!
out vec4 fragColor;

void main() {
  vec4 glAmbient = vec4(0.19125, 0.0735, 0.0225, 1.0);
  vec4 glDiffuse = vec4(0.7038, 0.27048, 0.0828, 1.0);
  vec4 glSpecular = vec4(0.256777, 0.137622, 0.086014, 1.0);
  float glShininess = 12.8;

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
  
  // Create gradient based on frag y coordinate
  // float gradient = gl_FragCoord.y/480.0;
  float gradient = smoothstep(minY,maxY,yCoord);
  // Sum lighting components and multiply red gradient
  vec4 lighting = (glAmbient + diffuse + specular) * vec4(gradient,1.0,1.0,1.0);
  // Final color for vertex
  vec4 color = vec4(lighting);

  fragColor = color;
}