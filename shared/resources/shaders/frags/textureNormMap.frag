#version 300 es // texturePhong

// In's and Out's of a Fragment Shader
// an 'in' inside of a fragment shader is a varying var
// an 'out' inside of a fragment shader is _the_ output you wish to draw (typically a vec4 color)

// We need to tell the shader executable at what precision we want floats to be
// medium precision is a good balance of speed and accuracy.
precision mediump float;

// This is a varying var written to by our vertex shader
// since this is 3.0 we specify it in the fragment shader with "in"
// in vec3 normal;
in vec2 texCoord;

// in vec3 lightVec;
// in vec3 viewVec;

in vec3 tangLightPos;
in vec3 tangViewPos;
in vec3 tangFragPos;
// in mat3 tbn;

// We also have to specify the "output" of the fragment shader
// Typically we only output RGBA color, and that is what I will do here!
out vec4 fragColor;
uniform sampler2D uTexNorm;
uniform sampler2D uTexDiffuse;
uniform sampler2D uTexDepth;
uniform sampler2D uTexReg;

void main() {
  // Discard fragments with low opacity
  vec4 texColor = texture(uTexReg, texCoord);
  vec3 normal = texture(uTexNorm, texCoord).rgb;
  normal = normalize(normal * 2.0 - 1.0);

  vec3 lightVec = normalize(tangLightPos - tangFragPos);
  vec3 viewVec = normalize(tangViewPos - tangFragPos);

  // Normalize values
  // vec3 norm = normalize(normal);
  vec3 L = normalize(lightVec);
  vec3 V = normalize(viewVec);
  vec3 halfAngle = normalize(L + V);

  // Get cosine between vectors with dot product
  float NdotL = clamp(dot(L, normal), 0.0, 1.0);
  float NdotH = clamp(dot(halfAngle, normal), 0.0, 1.0);
  
  float shininess = 80.0;
  // Calculate lighting components:       vec3(color) * intensity
  vec3 ambient =                          texColor.xyz * 0.4;
  vec3 diffuse  = NdotL *                 texColor.xyz * 0.4;
  vec3 specular = pow(NdotH, shininess) * vec3(1.0,1.0,1.0) * 0.5;

  // Lighting for fragment
  vec4 lighting = vec4(diffuse + specular + ambient, 1.0);
  vec4 color = vec4(lighting);

  fragColor = color;
}