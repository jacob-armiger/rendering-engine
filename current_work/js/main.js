// Ideally, we like to avoid global vars, a GL context lives as long as the window does
// So this is a case where it is understandable to have it in global space.
var gl = null;
// The rest is here simply because it made debugging easier...
var modelViewMatrix = null;
var projectionMatrix = null;
var globalTime = 0.0;
var parsedData = null;

// These global variables apply to the entire scene for the duration of the program
let lightPosition = null
let cameraPos = null
let shapes = createShapeData()

let cube = new Shape()
cube.setObjDataPath("box_with_vt.obj");
cube.setShaderSrc("textureCubemap")
cube.setTexParams(null, null)

cube.setRotationValues([0, 1, 0], 0, false);
cube.setPositionValue(0,0,0)

function main() {
  const canvas = document.getElementById('glCanvas');
  // Initialize the GL context
  // gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
  gl = canvas.getContext('webgl2');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert('Unable to initialize WebGL2. Contact the TA.');
    return;
  }

  // Set clear color to whatever color this is and fully opaque
  gl.clearColor(0.7, 0.7, 0.9, 1.0);
  // Clear the depth buffer
  gl.clearDepth(1.0);
  // Enable the depth function to draw nearer things over farther things
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.DEPTH_TEST);

  // Setup Controls
  sliderVals = new Map()
  sliderVals = setupUI(sliderVals);

  // Draw the scene repeatedly
  let then = 0.0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(deltaTime, sliderVals);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // The Projection matrix rarely needs updated.
  // Uncommonly, it is only modified in wacky sequences ("drunk" camera effect in GTAV)
  // or an artificial "zoom" using FOV (ARMA3)
  // Typically it is only updated when the viewport changes aspect ratio.
  // So, set it up here once since we won't let the viewport/canvas resize.
  const FOV = degreesToRadians(60);
  const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar  = 100.0;
  projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projectionMatrix,
                   FOV,
                   aspectRatio,
                   zNear,
                   zFar);


  // Right now, in draw, the scene will not render until the drawable is prepared
  // this allows us to acynchronously load content. If you are not familiar with async
  // that is a-okay! This link below should explain more on that topic:
  // https://blog.bitsrc.io/understanding-asynchronous-javascript-the-event-loop-74cd408419ff
  setupScene();
}

function setupUI(sliderDict) {
  // in index.html we need to setup some callback functions for the sliders
  // right now just have them report the values beside the slider.
  let sliders = ['cam', 'look', 'light'];
  let dims = ['X', 'Y', 'Z'];

  // for cam and look UI..
  sliders.forEach(controlType => {
    // for x, y, z control slider...
    dims.forEach(dimension => {
      let slideID = `${controlType}${dimension}`;
      console.log(`Setting up control for ${slideID}`);
      let slider = document.getElementById(slideID);
      let sliderVal = document.getElementById(`${slideID}Val`);
      // Initialize dictionary values
      sliderDict.set(sliderVal.id, sliderVal.value)

      // These are called "callback functions", essentially when the input
      // value for the slider or the field beside the slider change,
      // run the code we supply here!
      slider.oninput = () => {
        let newVal = slider.value;
        sliderVal.value = newVal;

        // update slider dictionary on slider change
        sliderDict.set(sliderVal.id, sliderVal.value)
      };
      sliderVal.oninput = () => {
        let newVal = sliderVal.value;
        slider.value = newVal;

        // update slider dictionary on input change
        sliderDict.set(sliderVal.id, sliderVal.value)
      };
    });
  });
  return sliderDict
}

// Async as it loads resources over the network.
async function setupScene() {


  for(let shape of shapes) {
    let vertSource = await loadNetworkResourceAsText(shape.shaderVertSrc);
    let fragSource = await loadNetworkResourceAsText(shape.shaderFragSrc);
    let objData = await loadNetworkResourceAsText(shape.objDataPath);
    initializeMyObject(vertSource, fragSource, objData, shape);
  }
  let vertSource = await loadNetworkResourceAsText(cube.shaderVertSrc);
  let fragSource = await loadNetworkResourceAsText(cube.shaderFragSrc);
  let objData = await loadNetworkResourceAsText(cube.objDataPath);
  initializeMyObject(vertSource, fragSource, objData, cube);
}



function drawScene(deltaTime, sliderVals) {
  globalTime += deltaTime;

  // Update light position
  lightPosition = glMatrix.vec3.fromValues(
    sliderVals.get("lightXVal"),
    sliderVals.get("lightYVal"),
    -sliderVals.get("lightZVal")
  );
  let fb = null
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (let shape of shapes) {
    // Update Model Matrix
    let modelMatrix = glMatrix.mat4.create();
    let objectWorldPos = shape.position;
    
    // scale -> rotation on axis to direction -> translate to distance -> rotate around sun
    // glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime*models[0].speed, models[0].orbitVector);  // orbit around center
    glMatrix.mat4.translate(modelMatrix, modelMatrix, objectWorldPos); // translate object away from center
    if(shape.rotateOnTime) { // rotate object on its own axis either continuously with time or not
      glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime, shape.rotationAxis); 
    } else {
      glMatrix.mat4.rotate(modelMatrix, modelMatrix, shape.roationDegree, shape.rotationAxis);
    }
    glMatrix.mat4.scale(modelMatrix, modelMatrix, shape.scaleVector); // scale object to variable size
    glMatrix.mat4.scale(modelMatrix, modelMatrix, shape.boundingVector); // normalize object to bounds

    // Update View Matrix
    let viewMatrix = glMatrix.mat4.create();
    cameraPos = [
      sliderVals.get("camXVal"),
      sliderVals.get("camYVal"),
      sliderVals.get("camZVal"),
    ];
    let cameraFocus = [
      sliderVals.get("lookXVal"),
      sliderVals.get("lookYVal"),
      sliderVals.get("lookZVal"),
    ];
    glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, [0.0, 1.0, 0.0]); // does up vector need to be changed? ortho to y?

    // Update Model View Matrix
    shape.modelViewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.mul(shape.modelViewMatrix, viewMatrix, modelMatrix);

    if (shape.drawableInitialized) {
      // NOTE: Changes texture for object but not sure why TEXTURE0 doesn't need to change
      // Set active texture based on whether it's a cubemap or 2D texture
      if(shape.textureParams.type == "image") {
        // gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, shape.texture);
      } else if(shape.textureParams.type == "cubemap"){
        // gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, shape.texture);
      }
      shape.myDrawable.draw();
    }
  }

  // gl.activeTexture(gl.TEXTURE0);
  // gl.bindTexture(gl.TEXTURE_CUBE_MAP, cube.targetTexture);
  if(cube.drawableInitialized) {
    renderCube(cube, fb)
  }
}


function initializeMyObject(vertSource, fragSource, objData, shape) {
  let rawData = null

  // NOTE: can optimize for redundant shaders but don't really need to 
  shape.shaderProgram = new ShaderProgram(vertSource, fragSource)

  parsedData = new OBJData(objData); // this class is in obj-loader.js
  rawData = parsedData.getFlattenedDataFromModelAtIndex(0);
  shape.boundingVector = rawData.boundingVector

  // Generate Buffers on the GPU using the geometry data we pull from the obj
  let vertexPositionBuffer = new VertexArrayData( // this class is in vertex-data.js
    rawData.vertices, // What is the data?
    gl.FLOAT,         // What type should WebGL treat it as?
    3                 // How many per vertex?
  );
  let vertexNormalBuffer = new VertexArrayData(
    rawData.normals,
    gl.FLOAT,
    3
  );
  let vertexTexCoordBuffer = new VertexArrayData (
    rawData.uvs,
    gl.FLOAT,
    2
  );
  /* let vertexBarycentricBuffer = new VertexArrayData (
    rawData.barycentricCoords,
    gl.FLOAT,
    3
  ); */

  // For any model that is smooth (non discrete) indices should be used, but we are learning! Maybe you can get this working later? One indicator if a model is discrete: a vertex position has two normals. A cube is discrete if only 8 vertices are used, but each vertex has 3 normals (each vertex is on the corner of three faces!) The sphere and bunny obj models are smooth though */
  // getFlattenedDataFromModelAtIndex does not return indices, but getIndexableDataFromModelAtIndex would;
  // let vertexIndexBuffer = new ElementArrayData(rawData.indices);

  // In order to let our shader be aware of the vertex data, we need to bind these buffers to the attribute location inside of the vertex shader. The attributes in the shader must have the name specified in the following object or the draw call will fail, possibly silently!
  let bufferMap = {
    aVertexPosition: vertexPositionBuffer,
    aVertexNormal: vertexNormalBuffer
  };
  if(shape.textureParams.type == "image") {
    bufferMap["aVertexTexCoord"] = vertexTexCoordBuffer;
  }

  if(shape.textureParams.src == null) {
    let texture = gl.createTexture(); 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 0,255]));
    gl.generateMipmap(gl.TEXTURE_2D);
    shape.texture = texture

    // Create texture to render to
    let targetTexture = gl.createTexture();
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE,null);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.bindTexture(gl.TEXTURE_2D, null);

    shape.targetTexture = targetTexture;
  } else {
    shape.texture = generateTexture(shape.textureParams.src, shape.textureParams.type);
  }

  shape.myDrawable = new Drawable(shape.shaderProgram, bufferMap, null, rawData.vertices.length / 3);

  // Checkout the drawable class' draw function. It calls a uniform setup function every time it is drawn. 
  // Put your uniforms that change per frame in this setup function.
  shape.myDrawable.uniformLocations = shape.shaderProgram.getUniformLocations(['uModelViewMatrix', 'uProjectionMatrix', 'uLightPosition', 'uCameraPosition', 'uTexture']);
  shape.myDrawable.uniformSetup = () => {
    gl.uniformMatrix4fv(
      shape.myDrawable.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      shape.myDrawable.uniformLocations.uModelViewMatrix,
      false,
      shape.modelViewMatrix
    );
    gl.uniform3fv(
      shape.myDrawable.uniformLocations.uLightPosition,
      lightPosition
    );
    gl.uniform3fv(
      shape.myDrawable.uniformLocations.uCameraPosition,
      cameraPos
    );
    gl.uniform1i(
      shape.myDrawable.uniformLocations.uTexture,
      shape.targetTexture
    )
  };
  shape.drawableInitialized = true;
}


function renderCube(cube, fb) {
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
  let fb_negx = gl.createFramebuffer()
  let fb_negy = gl.createFramebuffer()
  let fb_negz = gl.createFramebuffer()
  let fb_posx = gl.createFramebuffer()
  let fb_posy = gl.createFramebuffer()
  let fb_posz = gl.createFramebuffer()

  // render to targetTexture by binding fb
  for(let i = 0; i< 6;i++) {
    fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, sides[i].cubeSide, cube.targetTexture, 0);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    // render cube with empty texture
    gl.bindTexture(gl.TEXTURE_2D, cube.texture)
    // Convert clip space to pixxels
    gl.viewport(0,0, 256,256)
    //clear the canvas(cube side) and depth buffer
    gl.clearColor(0.7, 0.7, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let aspect = 256/256
    glMatrix.mat4.perspective(projectionMatrix,
                    degreesToRadians(60),
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
      cameraPos = [
        0,0,0
      ];
      let cameraFocus = [
        6,
        1,
        0,
      ];
      glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, [0.0, 1.0, 0.0]); // does up vector need to be changed? ortho to y?

      // Update Model View Matrix
      shape.modelViewMatrix = glMatrix.mat4.create();
      glMatrix.mat4.mul(shape.modelViewMatrix, viewMatrix, modelMatrix);

      gl.bindTexture(gl.TEXTURE_2D,shape.texture)
      shape.myDrawable.draw()
    }
  }

  /* DRAW CUBE TO CANVAS*/
  // Update Model Matrix
  modelMatrix = glMatrix.mat4.create();
  objectWorldPos = cube.position;

  // scale -> rotation on axis to direction -> translate to distance -> rotate around sun
  // glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime*models[0].speed, models[0].orbitVector);  // orbit around center
  glMatrix.mat4.translate(modelMatrix, modelMatrix, objectWorldPos); // translate object away from center
  if(cube.rotateOnTime) { // rotate object on its own axis either continuously with time or not
    glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime, cube.rotationAxis); 
  } else {
    glMatrix.mat4.rotate(modelMatrix, modelMatrix, cube.roationDegree, cube.rotationAxis);
  }
  glMatrix.mat4.scale(modelMatrix, modelMatrix, cube.scaleVector); // scale object to variable size
  glMatrix.mat4.scale(modelMatrix, modelMatrix, cube.boundingVector); // normalize object to bounds

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
  cube.modelViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.mul(cube.modelViewMatrix, viewMatrix, modelMatrix);

  // render to the canvas
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  // render the cube with the texture we just rendered to
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cube.targetTexture);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  glMatrix.mat4.perspective(projectionMatrix,
                   degreesToRadians(60),
                   aspect,
                   0.1,
                   100.0);  
  cube.myDrawable.draw();
}



// After all the DOM has loaded, we can run the main function.
window.onload = main;
