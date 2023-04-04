// Ideally, we like to avoid global vars, a GL context lives as long as the window does
// So this is a case where it is understandable to have it in global space.
var gl = null;
// The rest is here simply because it made debugging easier...
var myShader = null;
var myDrawable = null;
var myDrawableInitialized = null;
var modelViewMatrix = null;
var projectionMatrix = null;
var globalTime = 0.0;
var parsedData = null;

// These global variables apply to the entire scene for the duration of the program
let lightPosition = null
let cameraPos = null
let shapes = createShapeData()

let lastShaderInfo = null
let currentShader = null

let lastBufferMap = null
let currentBufferMap = null

let cubemapHTML = "Yokohama2"

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
  let cubemap = document.getElementById("cubemaps");
  cubemap.onchange = () => {
    cubemapHTML = cubemap.value
    setupScene()
  }
  return sliderDict
}

// Async as it loads resources over the network.
async function setupScene() {
  let vertSource = await loadNetworkResourceAsText('../../shared/resources/shaders/verts/textureCubemap.vert');
  let fragSource = await loadNetworkResourceAsText('../../shared/resources/shaders/frags/textureCubemap.frag');

  for(let shape of shapes) {
    let objData = await loadNetworkResourceAsText(shape.objDataPath);
    initializeMyObject(vertSource, fragSource, objData, shape);
  }
}

function drawScene(deltaTime, sliderVals) {
  globalTime += deltaTime;

  // Update light position
  lightPosition = glMatrix.vec3.fromValues(
    sliderVals.get("lightXVal"),
    sliderVals.get("lightYVal"),
    -sliderVals.get("lightZVal")
  );
  
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (let shape of shapes) {
    // Update Model Matrix
    let modelMatrix = glMatrix.mat4.create();
    let objectWorldPos = shape.position;

    // scale -> rotation on axis to direction -> translate to distance -> rotate around sun
    // glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime*models[0].speed, models[0].orbitVector);  // orbit around center
    glMatrix.mat4.translate(modelMatrix, modelMatrix, objectWorldPos); // translate object away from center
    if(shape.rotateOnTime) {
      glMatrix.mat4.rotate(modelMatrix, modelMatrix, globalTime, shape.rotationAxis); // rotate object on its own axis
    } else {
      glMatrix.mat4.rotate(modelMatrix, modelMatrix, shape.roationDegree, shape.rotationAxis); // rotate object on its own axis
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
      shape.myDrawable.draw();
    }
  }
}


function initializeMyObject(vertSource, fragSource, objData, shape) {
  let rawData = null


  // TODO: Fix for differing shaders
  // let tmpShaderinfo = {vert: vertSource, frag: fragSource}
  // if (lastShaderInfo === null) {
  //   // init shaderinfo
  //   currentShader = new ShaderProgram(vertSource, fragSource);
  //   lastShaderInfo = {vert: vertSource, frag: fragSource}

  //   shape.shaderProgram = currentShader
  // } else if (lastShaderInfo.vert !== tmpShaderinfo.vert || lastShaderInfo.frag !== tmpShaderinfo.frag) {
  //   console.log("CHANGE")
  //   // create new shader program if new shader
  //   currentShader = new ShaderProgram(vertSource, fragSource)
  //   lastShaderInfo = tmpShaderinfo
  //   shape.shaderProgram = currentShader
  // } else if(lastShaderInfo.vert === tmpShaderinfo.vert && lastShaderInfo.frag === tmpShaderinfo.frag) {
  //   console.log("SAME")
  //   shape.shaderProgram = currentShader
  // }
  if(currentShader == null) {
    currentShader = new ShaderProgram(vertSource, fragSource)
  }
  shape.shaderProgram = currentShader

  parsedData = new OBJData(objData); // this class is in obj-loader.js
  rawData = parsedData.getFlattenedDataFromModelAtIndex(0);
  shape.boundingVector = rawData.boundingVector
  
  // rawData.uvs = getCubeUVs()

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
  /*
  let vertexBarycentricBuffer = new VertexArrayData (
    rawData.barycentricCoords,
    gl.FLOAT,
    3
  );
  */

  /*
  For any model that is smooth (non discrete) indices should be used, but we are learning! Maybe you can get this working later?
  One indicator if a model is discrete: a vertex position has two normals.
  A cube is discrete if only 8 vertices are used, but each vertex has 3 normals (each vertex is on the corner of three faces!)
  The sphere and bunny obj models are smooth though */
  // getFlattenedDataFromModelAtIndex does not return indices, but getIndexableDataFromModelAtIndex would
  //let vertexIndexBuffer = new ElementArrayData(rawData.indices);

  // In order to let our shader be aware of the vertex data, we need to bind
  // these buffers to the attribute location inside of the vertex shader.
  // The attributes in the shader must have the name specified in the following object
  // or the draw call will fail, possibly silently!
  // Checkout the vertex shaders in resources/shaders/verts/* to see how the shader uses attributes.
  // Checkout the Drawable constructor and draw function to see how it tells the GPU to bind these buffers for drawing.
  let texture = null;
  let bufferMap = {
    aVertexPosition: vertexPositionBuffer,
    aVertexNormal: vertexNormalBuffer,
  };

  // Generate a cubemap or 2d texture
  if (shape.getUsingCubemap()) {
    let cubemapDir = `../../shared/resources/${cubemapHTML}/`;
    texture = generateCubeMap(cubemapDir);
  } else {
    // If not using a cubemap add TexCoordinates to attributes
    bufferMap["aVertexTexCoord"] = vertexTexCoordBuffer;
    let img = "sidewalk_Albedo.jpg";
    texture = generateTexture(img);
  }

  shape.myDrawable = new Drawable(shape.shaderProgram, bufferMap, null, rawData.vertices.length / 3);
  myDrawable = shape.myDrawable

  // Checkout the drawable class' draw function. It calls a uniform setup function every time it is drawn. 
  // Put your uniforms that change per frame in this setup function.
  myDrawable.uniformLocations = shape.shaderProgram.getUniformLocations(['uModelViewMatrix', 'uProjectionMatrix', 'uLightPosition', 'uCameraPosition', 'uTexture']);
  myDrawable.uniformSetup = () => {
    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      myDrawable.uniformLocations.uModelViewMatrix,
      false,
      shape.modelViewMatrix
    );
    gl.uniform3fv(
      myDrawable.uniformLocations.uLightPosition,
      lightPosition
    );
    gl.uniform3fv(
      myDrawable.uniformLocations.uCameraPosition,
      cameraPos
    );
    gl.uniform1i(
      myDrawable.uniformLocations.uTexture,
      texture
    )
  };
  shape.drawableInitialized = true;
}

// After all the DOM has loaded, we can run the main function.
window.onload = main;