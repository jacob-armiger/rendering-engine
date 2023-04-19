
/**
 * createNormalTextures generates textures from normalmap source
 */
function createNormalTextures(assetGroup) {
  tex_norm = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/normal.png`, "normalmap");
  tex_diffuse = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/diffuse.png`, "normalmap");
  tex_depth = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/height.png`, "normalmap");
  tex_reg = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/hd_wood.png`, "normalmap");
    return {normalTex: tex_norm, diffuseTex: tex_diffuse, depthTex: tex_depth, regTex: tex_reg}
}

/**
 * calcTangents calculates the tangents and bitangents of an object
 * @param {Array} vertVecs
 * @param {Array} uvVecs
 */
function calcTangents(vertVecs, uvVecs) {
    // There are 3 values(x,y,z) per vertex and 3 vertices per triangle
    let triangle_num = vertVecs.length / 3 / 3;
    let tangents = [];
    let bitangents = [];

    let tangentX = null;
    let tangentY = null;
    let tangentZ = null;

    let bitangentX = null;
    let bitangentY = null;
    let bitangentZ = null;

    let vCount = 0;
    let uvCount = 0;

    for (let i = 0; i < triangle_num; i++) {
        // Get positions from vertVecs list. Positions are stored as contiguous array
        // of x,y,z values and each triangle has 3 vertices so we iterate through the
        // vector nine times to get 3 positions for 1 triangle.
        let pos1 = glMatrix.vec3.fromValues(vertVecs[0+vCount],[1+vCount],[2+vCount]);
        vCount += 3;
        let pos2 = glMatrix.vec3.fromValues(vertVecs[0+vCount],[1+vCount],[2+vCount]);
        vCount += 3;
        let pos3 = glMatrix.vec3.fromValues(vertVecs[0+vCount],[1+vCount],[2+vCount]);
        vCount += 3;

        // Get uv coordinates. Stored similarly as the positions but there are only
        // 2 values (u,v) per vertices.
        let uv1 = glMatrix.vec2.fromValues(uvVecs[0+uvCount],[1+uvCount]);
        uvCount += 2;
        let uv2 = glMatrix.vec2.fromValues(uvVecs[0+uvCount],[1+uvCount]);
        uvCount += 2;
        let uv3 = glMatrix.vec2.fromValues(uvVecs[0+uvCount],[1+uvCount]);
        uvCount += 2;

        // Calculate the edges and UV deltas of the triangle. These are used to 
        // calculate the tangent and bitangent as a system of equations
        let edge1 = glMatrix.vec3.create();
        let edge2 = glMatrix.vec3.create();
        let deltaUV1 = glMatrix.vec2.create();
        let deltaUV2 = glMatrix.vec2.create();

        glMatrix.vec3.subtract(edge1,pos2,pos1);
        glMatrix.vec3.subtract(edge2,pos3,pos1);
        glMatrix.vec2.subtract(deltaUV1,uv2,uv1);
        glMatrix.vec2.subtract(deltaUV2,uv3,uv1);

        // Fraction is 1 over the determinant of the matrix/system
        let fraction = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);
        
        // Calculate the tangent and bitangent for the triangle
        // [0] [1] and [2] are equivalent to x,y,z 
        tangentX = fraction * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
        tangentY = fraction * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
        tangentZ = fraction * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

        bitangentX = fraction * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
        bitangentY = fraction * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
        bitangentZ = fraction * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);

        // Tangent and bitangent is pushed three times since each triangle has 3 vertices.
        // A triangle is a flat shape so it's okay that they're the same
        for(let i = 0; i < 3; i++){
          tangents.push(tangentX);
          tangents.push(tangentY);
          tangents.push(tangentZ);
          bitangents.push(bitangentX);
          bitangents.push(bitangentY);
          bitangents.push(bitangentZ);
        }
    }
    
    return {
      tangentData: tangents,
      bitangentData: bitangents,
    };

}