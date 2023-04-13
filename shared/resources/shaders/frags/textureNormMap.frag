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

  // Create light and viewing vector
  vec3 lightVec = normalize(tangLightPos - tangFragPos);
  vec3 viewVec = normalize(tangViewPos - tangFragPos);
  
  // Normal map
  vec3 normal = texture(uTexNorm, texCoord).rgb;
  normal = normalize(normal * 2.0 - 1.0);

  // Specular calculation
  vec3 halfAngle = normalize(lightVec + viewVec);
  float NdotH = clamp(dot(halfAngle, normal), 0.0, 1.0); // doproduct calcs cosine between vectors
  float shininess = 80.0;

  // Diffuse calculations
  vec4 texColor = texture(uTexDiffuse, texCoord);
  float NdotL = clamp(dot(lightVec, normal), 0.0, 1.0);
  
  // Adjust lighting components:          vec3(color)       * intensity
  vec3 ambient  =                         texColor.rgb      * 0.5;
  vec3 diffuse  = NdotL *                 texColor.rgb      * 0.4;
  vec3 specular = pow(NdotH, shininess) * vec3(1.0,1.0,1.0) * 0.5;

  // Lighting for fragment
  vec4 lighting = vec4(diffuse + ambient, 1.0);
  vec4 color = vec4(lighting);

  fragColor = color;
}