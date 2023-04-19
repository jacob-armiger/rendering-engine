class Shape {
  constructor() {
    // Sources
    this.objDataPath = ""
    this.textureParams = {
      src: null,
      type: null,
    }

    // World translation data
    this.position = [0,0,0]
    this.scaleVector = [4,4,4]
    this.boundingVector = [1,1,1]

    this.rotationAxis = [0,1,0]
    this.roationDegree = 10
    this.rotateOnTime = false

    // Info for shape's shader program
    this.shaderVertSrc = null
    this.shaderFragSrc = null
    this.modelViewMatrix = null

    // Maintain instance of shader prgram
    this.shaderProgram = null
    this.texture = null
    this.targetTexture = null

    // Maintain instance of drawable
    this.myDrawable = null
    this.drawableInitialized = false
  }

  setRotationValues(axis, degree, onTime) {
    this.rotationAxis = axis
    this.roationDegree = degree
    this.rotateOnTime = onTime
  }

  setScaleValue(scalar) {
    this.scaleVector = [scalar,scalar,scalar]
  }

  setPositionValue(x,y,z) {
    this.position = [x,y,z]
  }

  setTexParams(src, type) {
    this.textureParams.src = src
    this.textureParams.type = type
  }

  setObjDataPath(objFile) {
    this.objDataPath = "../shared/resources/models/" + objFile
  }

  setShaderSrc(shaderName) {
    this.shaderVertSrc = `../shared/resources/shaders/verts/${shaderName}.vert`
    this.shaderFragSrc = `../shared/resources/shaders/frags/${shaderName}.frag`
  }

}


function createShapeData() {
  list = [];

  let cube2 = new Shape()
  cube2.setObjDataPath("box_with_vt.obj");
  cube2.setShaderSrc("textureNormMap")
  cube2.setTexParams("toy_box", "normalmap")
  // cube2.setRotationValues([0, 1, 0], 0, true);
  cube2.setPositionValue(0,1,0)
  list.push(cube2)

  return list;
}