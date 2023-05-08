// Ideally, we like to avoid global vars, a GL context lives as long as the window does
// So this is a case where it is understandable to have it in global space.
var gl = null;
// The rest is here simply because it made debugging easier...
var modelViewMatrix = null;
var projectionMatrix = null;
var globalTime = 0.0;

// These global variables apply to the entire scene for the duration of the program
let lightPosition = null
let cameraPos = null

let lightViewMatrix = null
let lightProjectionMatrix = null
let depthTexture = null
let depthFrameBuffer = null

let colorShader = null
let vertSrc = null
let fragSrc = null

let shapes = createShapeData()

function main() {
  const canvas = document.getElementById('glCanvas');
  // Initialize the GL context
  gl = canvas.getContext('webgl2');
  // Makes images not upside down
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert('Unable to initialize WebGL2. Contact the TA.');
    return;
  }

  // Set clear color to whatever color this is and fully opaque
  gl.clearColor(0.2, 0.4, 0.6, 1.0);
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

  setupScene();
}

function setupUI(sliderDict) {
  // in index.html we need to setup some callback functions for the sliders
  // right now just have them report the values beside the slider.
  let sliders = ["cam", "look", "light"];
  let dims = ["X", "Y", "Z"];

  // for cam and look UI..
  sliders.forEach((controlType) => {
    // for x, y, z control slider...
    dims.forEach((dimension) => {
      let slideID = `${controlType}${dimension}`;
      console.log(`Setting up control for ${slideID}`);
      let slider = document.getElementById(slideID);
      let sliderVal = document.getElementById(`${slideID}Val`);
      // Initialize dictionary values
      sliderDict.set(sliderVal.id, sliderVal.value);

      // These are called "callback functions", essentially when the input
      // value for the slider or the field beside the slider change,
      // run the code we supply here!
      slider.oninput = () => {
        let newVal = slider.value;
        sliderVal.value = newVal;

        // update slider dictionary on slider change
        sliderDict.set(sliderVal.id, sliderVal.value);
      };
      sliderVal.oninput = () => {
        let newVal = sliderVal.value;
        slider.value = newVal;

        // update slider dictionary on input change
        sliderDict.set(sliderVal.id, sliderVal.value);
      };
    });
  });
  return sliderDict;
}

// Async as it loads resources over the network.
async function setupScene() {

  // Create depth buffer
  let depthObjects = generateDepthMap();
  depthTexture = depthObjects[0];
  depthFrameBuffer = depthObjects[1];

  vertSrc = await loadNetworkResourceAsText('/shared/resources/shaders/verts/simple.vert');
  fragSrc = await loadNetworkResourceAsText('/shared/resources/shaders/frags/simple.frag');
  depthShader = new ShaderProgram(vertSrc, fragSrc)

  // These shapes are initialized in model-data.js
  for(let shape of shapes) {
    let vertSource = await loadNetworkResourceAsText(shape.shaderVertSrc);
    let fragSource = await loadNetworkResourceAsText(shape.shaderFragSrc);
    let objData = await loadNetworkResourceAsText(shape.objPath);
    initializeMyObject(vertSource, fragSource, objData, shape);
  }
}


function drawScene(deltaTime, sliderVals) {
  globalTime += deltaTime;

  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Update light position when user moves light
  lightPosition = glMatrix.vec3.fromValues(
    sliderVals.get("lightXVal"),
    sliderVals.get("lightYVal"),
    -sliderVals.get("lightZVal")
  );
  // Update View Matrix when user moves camera
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

  // Create view matrix from light perspective
  lightViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(lightViewMatrix, lightPosition, [0.0,0.0,0.0], [0.0, 1.0, 0.0]);

  // DRAW TO DEPTH BUFFER
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);
  gl.viewport(0, 0, 512, 512);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (let shape of shapes) {
    // Model matrix is used to transform object in world space
    let modelMatrix = glMatrix.mat4.create();
    transformObject(shape, modelMatrix);

    // Create Model View Matrix (world to camera space)
    shape.modelViewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.mul(shape.modelViewMatrix, viewMatrix, modelMatrix);

    if (shape.depthDrawableInitialized) {
      shape.depthDrawable.draw();
    }
  }

  // DRAW TO CANVAS
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // lookat() creates matrix that transforms vertices from world space to camera space
  glMatrix.mat4.lookAt(viewMatrix, cameraPos, cameraFocus, [0.0, 1.0, 0.0]); // does up vector need to be changed? ortho to y?


  for (let shape of shapes) {
    // Model matrix is used to transform object in world space
    let modelMatrix = glMatrix.mat4.create();
    transformObject(shape, modelMatrix);

    // Create Model View Matrix (world to camera space)
    shape.modelViewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.mul(shape.modelViewMatrix, viewMatrix, modelMatrix);

    if (shape.drawableInitialized) {
      // Create extra framebuffer frames if dynamic cubemap
      if (shape.shaderType == "dynamicCubemap") {
        renderDynamicShape(shape);
        continue;  // `renderDynamicShape` handles drawing of shape
      }
      shape.myDrawable.draw();
    }
  }
}


function initializeMyObject(vertSource, fragSource, objData, shape) {
  // Assign shader information to shape
  shape.shaderProgram = new ShaderProgram(vertSource, fragSource)  // NOTE: could optimize for redundant shaders

  let rawData = null
  let parsedData = new OBJData(objData); // this class is in obj-loader.js
  rawData = parsedData.getFlattenedDataFromModelAtIndex(0);

  // Set bounding Vector
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
  let vertexTangBuffer = new VertexArrayData (
    rawData.tangents,
    gl.FLOAT,
    3
  );
  let vertexBitangBuffer = new VertexArrayData (
    rawData.bitangents,
    gl.FLOAT,
    3
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

  // Textures used for normalmaps. Declared here for scope.
  let {normalTex, diffuseTex, ambientTex, specularTex} = {};

  // Conditionally create textures and set buffermap
  if(shape.shaderType == "normalmap") {
    bufferMap["aVertexTexCoord"] = vertexTexCoordBuffer; // uvs
    bufferMap["aVertexTang"] = vertexTangBuffer;
    bufferMap["aVertexBitang"] = vertexBitangBuffer;
    ({normalTex, diffuseTex, ambientTex, specularTex} = createNormalTextures(shape.shader));

  } else {
    if(shape.shaderType == "image") {
      bufferMap["aVertexTexCoord"] = vertexTexCoordBuffer;
    }
    shape.texture = generateTexture(shape.shader, shape.shaderType);
  }

  // Set shape's drawable
  shape.myDrawable = new Drawable(shape.shaderProgram, bufferMap, null, rawData.vertices.length / 3);
  shape.depthDrawable = new Drawable(depthShader, {}, null, rawData.vertices.length / 3);


  shape.depthDrawable.uniformLocations = depthShader.getUniformLocations(["uLightViewMatrix", "uProjectionMatrix",]);
  shape.depthDrawable.uniformSetup = () => {
    gl.uniformMatrix4fv(
      shape.depthDrawable.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      shape.depthDrawable.uniformLocations.uLightViewMatrix,
      false,
      lightViewMatrix
    );

    shape.depthDrawableInitialized = true;
  };

  // Checkout the drawable class' draw function. It calls a uniform setup function every time it is drawn. 
  // Put your uniforms that change per frame in this setup function.
  shape.myDrawable.uniformLocations = shape.shaderProgram.getUniformLocations(['uModelViewMatrix', 'uProjectionMatrix', 'uLightPosition', 'uCameraPosition', 'uTexture', 'uProjectedTexture', 'uTexNorm', 'uTexDiffuse', 'uTexAmbient', 'uTexSpecular']);
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
      shape.texture
    )
    gl.uniform1i(
      shape.myDrawable.uniformLocations.uProjectedTexture,
      depthTexture
    )
    /* BIND APPROPRIATE TEXTURE TYPE */
    if(shape.shaderType == "image") {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, shape.texture);
      gl.uniform1i(
        shape.myDrawable.uniformLocations.uTexture,
        shape.texture
      )
    } else if(shape.shaderType == "cubemap" || shape.shaderType == "dynamicCubemap") {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, shape.texture);
      gl.uniform1i(
        shape.myDrawable.uniformLocations.uTexture,
        shape.texture
      )
    }
    if(shape.shaderType == "normalmap") {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, normalTex);
      gl.uniform1i(
        shape.myDrawable.uniformLocations.uTexNorm,
        0
      )
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, diffuseTex);
      gl.uniform1i(
        shape.myDrawable.uniformLocations.uTexDiffuse,
        1
      )
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, ambientTex);
      gl.uniform1i(
        shape.myDrawable.uniformLocations.uTexAmbient,
        2
      )
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, specularTex);
      gl.uniform1i(
        shape.myDrawable.uniformLocations.uTexSpecular,
        3
      )
    }
  };
  shape.drawableInitialized = true;
}

// After all the DOM has loaded, we can run the main function.
window.onload = main;
