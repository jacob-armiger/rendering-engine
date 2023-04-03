class Shape {
  constructor() {
    this.textureIMG = "sd_ut_system_logo.png"
    this.objDataPath = "../shared/resources/models/sphere_with_vt.obj"
    this.useCubemap = false

    this.position = [0,0,0]
    this.scaleVector = [4,4,4]
    this.boundingVector = [1,1,1]

    this.rotationAxis = [0,1,0]
    this.roationDegree = 10
    this.rotateOnTime = false

    this.modelViewMatrix = null

    this.shaderProgram = null
    this.bufferMap = null
    this.parsedData = null

    this.myDrawable = null
    this.drawableInitialized = false
  }

  setTexImg(src) {
    this.textureIMG = src
  }

  setObjDataPath(objFile) {
    this.objDataPath = "../shared/resources/models/" + objFile
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

  setUseCubemap() {
    this.useCubemap = true
  }

  getUsingCubemap() {
    return this.useCubemap
  }
}


function createShapeData() {
  list = [];

  // let floor = new Shape();
  // floor.setObjDataPath("floor.obj");

  // floor.setPositionValue(0, -1.3, 0);
  // floor.setScaleValue(20);
  // floor.setRotationValues([1, 0, 0], -1.55, false);

  // list.push(floor)

  // let ball = new Shape();
  // ball.setObjDataPath("sphere_with_vt.obj");

  // ball.setRotationValues([1, 1, 0], 0, true);
  // ball.setPositionValue(2, 0, 0);
  // list.push(ball)

  let cube = new Shape()
  cube.setObjDataPath("box_with_vt.obj");
  cube.setUseCubemap()

  cube.setRotationValues([1, 1, 0], 0, true);
  cube.setPositionValue(0,0,0)
  list.push(cube)

  // let shapes = [floor,ball, cube];
  return list;
}