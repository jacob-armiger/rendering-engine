#version 300 es // These is an OpenGL ES 3.0 Shader!

// In's and Out's of a Fragment Shader
// an 'in' inside of a fragment shader is a varying var
// an 'out' inside of a fragment shader is _the_ output you wish to draw (typically a vec4 color)

// We need to tell the shader executable at what precision we want floats to be
// medium precision is a good balance of speed and accuracy.
precision highp float;

// This is a varying var written to by our vertex shader
// since this is 3.0 we specify it in the fragment shader with "in"
in vec3 normal;
in vec3 position;

// We also have to specify the "output" of the fragment shader
// Typically we only output RGBA color, and that is what I will do here!
uniform samplerCube uTexture;
uniform vec3 uCameraPosition;
uniform mat4 uModelViewMatrix;

out vec4 fragColor;

void main() {
  // Normalize values
  vec3 norm = normalize(normal);

  // Reflected(to-from)
  vec3 incidentEye = normalize(position.xyz - normalize(uCameraPosition));
  // reflected takes input vector and normal vector
  vec3 reflection = reflect(incidentEye, norm).rgb;

  // convert from eye to world space
  /* If this line is NOT commented out: Objects can rotate fine, but reflection follows camera */
  /* If this line IS commented out: Relflection follows rotation, but still objects reflect fine */
  reflection = vec3(inverse(uModelViewMatrix) * vec4(reflection, 0.0));
  
  fragColor = texture(uTexture, reflection);
}