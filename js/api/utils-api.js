import * as glMatrix from "/node_modules/gl-matrix/esm/index.js"

/* --------------------------- 
  FUNCTIONS TO HANDLE TEXTURES
  --------------------------*/
/**
 * generateTexture takes different types of resources and applies it to a texture that can be used in a shader
 * @param {String} src  this is an image file or cubemap folder
 * @param {String} type "image", "cubemap", "dynamicCubemap"
 */
function generateTexture(src, type) {
  let texture = gl.createTexture();
  if(type == "image" || type == "normalmap") {
    
    if(type == "image") {
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
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    });
  } else if(type == "cubemap") {
    src = "../../shared/resources/cubemaps/" + src
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

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
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);

    
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

  }
  return texture;
}

/**
 * createNormalTextures generates textures from normalmap source
 * @param assetGroup the name of the folder that contains the assets needed
 */
function createNormalTextures(assetGroup) {
  
  let tex_norm = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/normal.jpg`, "normalmap");
  let tex_diffuse = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/diffuse.jpg`, "normalmap");
  let tex_specular = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/specular.jpg`, "normalmap");
  let tex_ambient = null;
  let tex_rough = null;
  // tex_ambient = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/ambient.jpg`, "normalmap");
  // tex_rough = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/roughness.jpg`, "normalmap");
  // tex_depth = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/height.png`, "normalmap");
  // tex_reg = generateTexture(`../../shared/resources/grouped_assets/${assetGroup}/hd_wood.png`, "normalmap");
  // return {normalTex: tex_norm, diffuseTex: tex_diffuse, depthTex: tex_depth, regTex: tex_reg}
  return {normalTex: tex_norm, diffuseTex: tex_diffuse, specularTex: tex_specular, ambientTex: tex_ambient, roughTex: tex_rough};
}

/**
 * generateDepthMap creates a depth map
 */
function generateDepthMap() {
  // Create 2D texture to use as Frame buffer's depth buffer
  const depthTexture = gl.createTexture();
  const depthTextureSize = 512;
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texImage2D(
      gl.TEXTURE_2D,      // target
      0,                  // mip level
      gl.DEPTH_COMPONENT32F, // internal format
      depthTextureSize,   // width
      depthTextureSize,   // height
      0,                  // border
      gl.DEPTH_COMPONENT, // format
      gl.FLOAT,           // type
      null);   

  // Create framebuffer object
  let fb = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  // Attach depthTexture to framebuffer
  gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

  return [depthTexture, fb];
}



/* ----------------------------------------------------
  FUNCTIONS TO HANDLE OBJECT RENDERING AND MULTI-PASSES 
  ---------------------------------------------------*/
/**
 * renderDynamicShape takes a shape meant to have a dynamic cubemap and creates the frames for it
 * @param {Object} object  shape meant to have dynamicCubemap
 * @param {Matrix} projectionMatrix
 * @param {List} shapes
 * @param {Matrix} modelMatrix
 * 
 */
function renderDynamicShape(object, projectionMatrix, shapes, modelMatrix, viewMatrix, sliderVals, cameraPos, cameraFocus) {
  let sides = [
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    },
    {
      cubeSide: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
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
      look: [1,0,0],
      up: [0,1,0]
    },
    {
      //negx
      look: [-1,0,0],
      up: [0,1,0]
    },
    {
      //posy
      look: [0,1,0],
      up: [0,0,-1]
    },
    {
      // negy
      look: [0,-1,0],
      up: [0,0,1]
    },
    {
      //posz
      look: [0,0,1],
      up: [0,1,0]
    },
    {
      //negz
      look: [0,0,-1],
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
    gl.clearColor(0.2, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let aspect = 256/256
    glMatrix.mat4.perspective(projectionMatrix,
                    degreesToRadians(-90),
                    1.0,
                    0.1,
                    100.0);

    /* DRAW SHAPES TO FRAMEBUFFER */
    for (let shape of shapes) {
      let modelMatrix = glMatrix.mat4.create();
      
      // Transform shape
      transformObject(shape, modelMatrix);

      // Create view from cube's perpective
      let viewMatrix = glMatrix.mat4.create();
      let cameraPos = object.position
      let cameraFocus = frames[i].look
      let upDir = frames[i].up
      
      glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, upDir); // does up vector need to be changed? ortho to y?

      // Update Model View Matrix
      shape.modelViewMatrix = glMatrix.mat4.create();
      glMatrix.mat4.mul(shape.modelViewMatrix, viewMatrix, modelMatrix);

      if (shape.drawableInitialized) {
        if(shape.shaderType == "image") {
          gl.bindTexture(gl.TEXTURE_2D, shape.texture);
        } else if(shape.shaderType == "cubemap"){
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

  let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  glMatrix.mat4.perspective(projectionMatrix,
                   degreesToRadians(60),
                   aspect,
                   0.1,
                   100.0);  
  object.myDrawable.draw();
}

/**
 * transformObject takes a shape meant to have a dynamic cubemap and creates the frames for it
 * @param {Object} shape  shape to be translated/rotated/animated/scaled
 * @param {mat4} modelMatrix the matrix used to tranform object in world space
 */
function transformObject(shape, modelMatrix) {
  // scale -> rotation on axis to direction -> translate to distance -> rotate around sun
  // glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime*models[0].speed, models[0].orbitVector);  // orbit around center
  // TRANSLATE object away from center
  if (shape.animate) {
    glMatrix.mat4.translate(modelMatrix, modelMatrix, [
      shape.position[0],
      Math.tan(shape.animateSpeed * globalTime) * -12,
      shape.position[2],
    ]);
  } else {
    glMatrix.mat4.translate(modelMatrix, modelMatrix, shape.position);
  }
  // ROTATE object on its own axis either continuously with time or not
  if (shape.rotateOnTime) {
    glMatrix.mat4.rotate(
      modelMatrix,
      modelMatrix,
      globalTime,
      shape.rotationAxis
    );
  } else {
    glMatrix.mat4.rotate(
      modelMatrix,
      modelMatrix,
      shape.roationDegree,
      shape.rotationAxis
    );
  }
  // SCALE object to variable size
  glMatrix.mat4.scale(modelMatrix, modelMatrix, shape.scaleVector);
  // NORMALIZE object to bounds
  glMatrix.mat4.scale(modelMatrix, modelMatrix, shape.boundingVector);
}



/* ------------------------ 
  FUNCTIONS TO HANDLE MISC. 
  -----------------------*/
/**
 * degreesToRadians as the name implies
 * @param {Number} degrees The degrees to convert to radians
 */
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * getRandomDec generate random decimal between 0.2 and 1.2
 */
function getRandomDec() {
  let num = Math.random() + 0.15
  // console.log(num)
  return num;
}

/**
 * getRandomInt generate random integer within min/max value
 * @param {Integer} min smallest value wanted
 * @param {Integer} max greatest value wanted
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

export {
    generateTexture,
    createNormalTextures,
    generateDepthMap,
    renderDynamicShape,
    transformObject,
    degreesToRadians,
    getRandomDec,
    getRandomInt,
    loadNetworkResourceAsText,
}