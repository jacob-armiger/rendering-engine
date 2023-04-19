
/**
 * calculateBoundingVector loads server local resource as text data (one large string with newlines)
 * @param {Object} bbox Bounds of the viewport
 */
function calculateBoundingVector(bbox) {
    let span = []
    let unitspan = []
  
    let maxXYZ = glMatrix.vec3.fromValues(bbox.maxX, bbox.maxY, bbox.maxZ)
    let minXYZ = glMatrix.vec3.fromValues(bbox.minX, bbox.minY, bbox.minZ)
    glMatrix.vec3.sub(span, maxXYZ, minXYZ)
    glMatrix.vec3.normalize(unitspan, span)
    let xScale = unitspan[0] / span[0]
    let yScale = unitspan[1] / span[1]
    let zScale = unitspan[2] / span[2]
    let scalingVector = glMatrix.vec3.fromValues(xScale, yScale, zScale)
    return scalingVector
  }
  
  /**
   * calculateVertexNormals calculates vertex normals using face and vertex object information
   * @param {Object} faces
   * @param {Object} vertices
   */
  function calculateVertexNormals(faces, vertices) {
    let calculatedNormals = new Array(vertices.length);
    let vert_map = new Map();
  
    // Loop through faces
    for (let i = 0; i < faces.length; i++) {
      // Set vertex normal index so that normalData can be created
      faces[i].vertices[0].vertexNormalIndex = faces[i].vertices[0].vertexIndex;
      faces[i].vertices[1].vertexNormalIndex = faces[i].vertices[1].vertexIndex;
      faces[i].vertices[2].vertexNormalIndex = faces[i].vertices[2].vertexIndex;
  
      // get vertices from indexes
      let v1_index = faces[i].vertices[0].vertexIndex - 1;
      let v2_index = faces[i].vertices[1].vertexIndex - 1;
      let v3_index = faces[i].vertices[2].vertexIndex - 1;
      let v1 = [vertices[v1_index].x, vertices[v1_index].y, vertices[v1_index].z];
      let v2 = [vertices[v2_index].x, vertices[v2_index].y, vertices[v2_index].z];
      let v3 = [vertices[v3_index].x, vertices[v3_index].y, vertices[v3_index].z];
  
      let face_normal = [0, 0, 0];
      let u = [];
      let w = [];
      // Calculate face_normal
      glMatrix.vec3.subtract(u, v2, v1);
      glMatrix.vec3.subtract(w, v3, v1);
      glMatrix.vec3.cross(face_normal, u, w);
      glMatrix.vec3.normalize(face_normal, face_normal);
  
      // Add face normal to map
      for (let vert_index of [v1_index, v2_index, v3_index]) {
        if (vert_map.has(vert_index)) {
          vert_map.get(vert_index).push(face_normal);
        } else {
          vert_map.set(vert_index, [face_normal]);
        }
      }
    }
  
    // Calculate vertex normals with face normals
    vert_map.forEach((face_norms, vert_ind) => {
      let vert_norm = [0, 0, 0];
      let count = 0;
      for (let norm of face_norms) {
        count += 1;
        glMatrix.vec3.add(vert_norm, vert_norm, norm);
      }
      glMatrix.vec3.divide(vert_norm, vert_norm, [count, count, count]);
      glMatrix.vec3.normalize(vert_norm, vert_norm);
  
      let vert_obj = {
        x: vert_norm[0],
        y: vert_norm[1],
        z: vert_norm[2],
      };
      // Add vertex to in correct order
      calculatedNormals[vert_ind] = vert_obj;
    });
    return calculatedNormals;
  }
  
  /**
   * calculateTangents calculates the tangents and bitangents of an object
   * @param {Array} vertVecs
   * @param {Array} uvVecs
   */
  function calculateTangents(vertVecs, uvVecs) {
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
  
