
// Positions
function getBmPos() {
    let verts = [
      -1, -1,  1,   1,  1,  1,  -1,  1,  1,   1, -1,  1, // Front
      -1, -1, -1,   1,  1, -1,  -1,  1, -1,   1, -1, -1, // Back
      1, -1, -1,   1,  1,  1,   1, -1,  1,   1,  1, -1, // Right
      -1, -1, -1,  -1,  1,  1,  -1, -1,  1,  -1,  1, -1, // Left
      -1,  1, -1,   1,  1,  1,  -1,  1,  1,   1,  1, -1, // Top
      -1, -1, -1,   1, -1,  1,  -1, -1,  1,   1, -1, -1, // Bottom
    ];
    return verts
}
  
  // Tangents
function getBmTan() {
    let tangs = [
        1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Front
        -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0, // Back
        0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1, // Right
        0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1, // Left
        1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Top
        1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Bottom
    ];
    return tangs
}
  
    // Bitangents
function getBmBitan() {
    let bitangs = [
        0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Front
        0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Back
        0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Right
        0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Left
        0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1, // Top
        0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1, // Bot
    ];
    return bitangs
}
  
  // UVs
function getBmUvs() {
    let uvs = [
        0,  1,  1,  0,  0,  0,  1,  1, // Front
        1,  1,  0,  0,  1,  0,  0,  1, // Back
        1,  1,  0,  0,  0,  1,  1,  0, // Right
        0,  1,  1,  0,  1,  1,  0,  0, // Left
        0,  0,  1,  1,  0,  1,  1,  0, // Top
        0,  1,  1,  0,  0,  0,  1,  1, // Bottom
    ];
    return uvs
}
  
  // Indices
function getBmIndices() {
    let indices = [
        0 , 1 , 2 ,    0 , 3 , 1 , // Front
        4 , 6 , 5 ,    4 , 5 , 7 , // Back
        8 , 9 , 10,    8 , 11, 9 , // Right
        12, 14, 13,    12, 13, 15, // Left
        16, 18, 17,    16, 17, 19, // Top
        20, 21, 22,    20, 23, 21, // Bottom
    ];
    return indices
}

function createNormalTextures() {
    tex_norm = generateTexture("../../shared/toy_box_assets/bump_normal.png");
    tex_diffuse = generateTexture("../../shared/toy_box_assets/bump_diffuse.png");
    tex_depth = generateTexture("../../shared/toy_box_assets/bump_depth.png");
    return [tex_norm, tex_diffuse, tex_depth]
}