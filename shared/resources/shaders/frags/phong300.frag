#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of a Fragment Shader
// an 'in' inside of a fragment shader is a varying var
// an 'out' inside of a fragment shader is _the_ output you wish to draw (typically a vec4 color)

// We need to tell the shader executable at what precision we want floats to be
// medium precision is a good balance of speed and accuracy.
precision mediump float;

// This is a varying var written to by our vertex shader
// since this is 3.0 we specify it in the fragment shader with "in"
in vec3 norm;
in vec3 lightVec;
in vec3 viewVec;

// We also have to specify the "output" of the fragment shader
// Typically we only output RGBA color, and that is what I will do here!
out vec4 fragColor;

void main() {
  vec3 glAmbient = vec3(0.3, 0.3, 0.3);
  vec3 glDiffuse = vec3(0.5, 0.5, 0.5);
  vec3 glSpecular = vec3(0.2, 0.2, 0.2);

  vec3 L = normalize(lightVec);
  vec3 V = normalize(viewVec);
  vec3 halfAngle = normalize(L + V);

  float NdotL = dot(L, norm);
  float NdotH = clamp(dot(halfAngle, norm), 0.0, 1.0);
  
  // diffuse = Kd*Il(N*L)
  float diffuse  = 1.0 * NdotL;
  
  float specular = pow(NdotH, 76.8);

  vec3 lighting = vec3(glAmbient + diffuse * specular);
  // lighting = ambientLight + diffuseLight * (dot(aVertexNormal, uLightPosition));
  vec4 color = vec4(vec3(0.5,1.0,0.8) * lighting, 1.0);

  fragColor = color;
}