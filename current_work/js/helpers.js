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


/**
 * generateTexture takes different types of resources and applies it to a texture that can be used in a shader
 * @param {String} src  this is an image file or cubemap folder
 * @param {String} type "image", "cubemap", "dynamicCubemap"
 */
function generateTexture(src, type) {
  let texture = gl.createTexture();
  if(type == "image" || type == "normalmap") {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    if(type == "image") {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      src = "../../shared/resources/images/" + src
    }
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255,255]));

    // Asynchronously load an image
    let image = new Image();
    image.src = src;
    
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.naturalWidth, image.naturalHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE,image);
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      // gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    });
  } else if(type == "cubemap") {
    src = "../../shared/resources/cubemaps/" + src
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    const faces = [
      {
        cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        src: src + "posx.jpg",
      },
      {
        cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        src: src + "negx.jpg",
      },
      {
        cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        src: src + "posy.jpg",
      },
      {
        cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        src: src + "negy.jpg",
      },
      {
        cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        src: src + "posz.jpg",
      },
      {
        cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        src: src + "negz.jpg",
      },
    ];

    faces.forEach((face) => {
      let {cubeSide, src} = face

      // Fill the texture with a 1x1 blue pixel.
      gl.texImage2D(cubeSide, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255 ,255]));
      
      // Asynchronously load an image
      let image = new Image();
      image.src = src;
      
      image.addEventListener('load', function() {
        // Image now loaded
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(cubeSide, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
    });

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  } else if (type == "dynamicCubemap") {

    // Create texture to render to
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);

    
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

  }
  return texture;
}


/**
 * renderCube takes a shape meant to have a dynamic cubemap and creates the frames for it
 * @param {Obejct} object  shape meant to have dynamicCubemap
 */
function renderCube(object) {
  let sides = [
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    },
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    },
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    },
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    },
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    },
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    },
  ];

  let frames = [
    {
      //posx
      look: [10,0,0],
      up: [0,1,0]
    },
    {
      //negx
      look: [-10,0,0],
      up: [0,1,0]
    },
    {
      //posy
      look: [0,-12,0],
      up: [0,0,1]
    },
    {
      // negy
      look: [0,12,0],
      up: [0,0,-1]
    },
    {
      //posz
      look: [0,0,-5],
      up: [0,1,0]
    },
    {
      //negz
      look: [0,0,5],
      up: [0,1,0]
    }
  ]
  
  // Create frames for cubemap
  for(let i = 0; i< 6;i++) {
  // render to texture by binding fb
    let fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, sides[i].cubeSide, object.texture, 0);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    // render cube with empty texture
    // gl.bindTexture(gl.TEXTURE_2D, cube.texture)
    // // Convert clip space to pixxels
    gl.viewport(0,0, 256,256)
    //clear the canvas(cube side) and depth buffer
    gl.clearColor(0.7, 0.7, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let aspect = 256/256
    glMatrix.mat4.perspective(projectionMatrix,
                    degreesToRadians(90),
                    aspect,
                    0.1,
                    100.0);

    /* DRAW SHAPES TO FRAMEBUFFER */
    for (let shape of shapes) {
      // Transform shape
      let modelMatrix = glMatrix.mat4.create();

      glMatrix.mat4.translate(modelMatrix, modelMatrix, shape.position); // translate object away from center
      if(shape.rotateOnTime) { // rotate object on its own axis either continuously with time or not
        glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime, shape.rotationAxis); 
      } else {
        glMatrix.mat4.rotate(modelMatrix, modelMatrix, shape.roationDegree, shape.rotationAxis);
      }
      glMatrix.mat4.scale(modelMatrix, modelMatrix, shape.scaleVector); // scale object to variable size
      glMatrix.mat4.scale(modelMatrix, modelMatrix, shape.boundingVector); // normalize object to bounds

      // Create view from cube's perpective
      let viewMatrix = glMatrix.mat4.create();
      cameraPos = object.position
      let cameraFocus = frames[i].look
      let upDir = frames[i].up
      
      glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, upDir); // does up vector need to be changed? ortho to y?

      // Update Model View Matrix
      shape.modelViewMatrix = glMatrix.mat4.create();
      glMatrix.mat4.mul(shape.modelViewMatrix, viewMatrix, modelMatrix);

      if (shape.drawableInitialized) {
        if(shape.textureParams.type == "image") {
          gl.bindTexture(gl.TEXTURE_2D, shape.texture);
        } else if(shape.textureParams.type == "cubemap"){
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, shape.texture);
        }
      }
      if(shape.drawableInitialized) {
        shape.myDrawable.draw()
      }
    }
  }

  /* DRAW OBJECT TO CANVAS*/
  // Update Model Matrix
  modelMatrix = glMatrix.mat4.create();

  glMatrix.mat4.translate(modelMatrix, modelMatrix, object.position); // translate object away from center
  if(object.rotateOnTime) { // rotate object on its own axis either continuously with time or not
    glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime, object.rotationAxis); 
  } else {
    glMatrix.mat4.rotate(modelMatrix, modelMatrix, object.roationDegree, object.rotationAxis);
  }
  glMatrix.mat4.scale(modelMatrix, modelMatrix, object.scaleVector); // scale object to variable size
  glMatrix.mat4.scale(modelMatrix, modelMatrix, object.boundingVector); // normalize object to bounds

  // Update View Matrix
  viewMatrix = glMatrix.mat4.create();
  cameraPos = [
    sliderVals.get("camXVal"),
    sliderVals.get("camYVal"),
    sliderVals.get("camZVal"),
  ];
  cameraFocus = [
    sliderVals.get("lookXVal"),
    sliderVals.get("lookYVal"),
    sliderVals.get("lookZVal"),
  ];
  glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, [0.0, 1.0, 0.0]); // does up vector need to be changed? ortho to y?

  // Update Model View Matrix
  object.modelViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.mul(object.modelViewMatrix, viewMatrix, modelMatrix);

  // render to the canvas
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // render the object with the texture we just rendered to
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, object.texture);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  glMatrix.mat4.perspective(projectionMatrix,
                   degreesToRadians(60),
                   aspect,
                   0.1,
                   100.0);  
  object.myDrawable.draw();
}