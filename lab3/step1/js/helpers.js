/**
 * degreesToRadians as the name implies
 * @param {Number} degrees The degrees to convert to radians
 */
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * loadNetworkResourceAsText loads server local resource as text data (one large string with newlines)
 * @param {String} resource A path to local resource
 */
async function loadNetworkResourceAsText(resource) {
  const response = await fetch(resource);
  const asText = await response.text();
  return asText;
}

/**
 * createBoundingVector loads server local resource as text data (one large string with newlines)
 * @param {Object} bbox Bounds of the viewport
 */
function createBoundingVector(bbox) {
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


function generateTexture(img) {
  img = "../../shared/resources/images/" + img
  var texture = gl.createTexture();
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([255, 55, 55 ,255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = img;
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE,image);
    
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  return texture;
}