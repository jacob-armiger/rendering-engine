// class Model {
//   constructor() {
//     this.scaleVector = [1, 1, 1];
//     this.orbitVector = [0, 0, 0];
//     this.position = [0, 0, 0];
//     this.speed = 1;
//   }

//   updateScale(scale) {
//     this.scaleVector = [scale, scale, scale];
//   }

//   // calcPos(time) {
//   //     // return [this.dist*Math.sin(time),0, this.dist*Math.cos(time)]
//   // }
// }

// // x = radius * cos(theta)
// // theta being 1/orbitalPeriod,
// // as a lower orbital period will go faster.

// // z = radius * sin(theta)

// function createModelData() {
//   let ratio = 2.5; // This is NOT a hard coded value for object bounds. This is used for experimenting with object system sizes

//   let obj1 = new Model(); // 16 ratio
//   obj1.updateScale(3 * ratio);
//   obj1.position = [-1, 0, 0];

//   let obj2 = new Model();
//   obj2.updateScale(3 * ratio);
//   obj2.position = [5, 0, 0];
//   obj2.orbitVector = [0, 1, 0];
//   obj2.speed = 1.47;

//   let models = [obj1];
//   return models;
// }

class Shape {
  constructor() {
    this.textureIMG = "sd_ut_system_logo.png"
    this.objDataPath = "../shared/resources/models/sphere_with_vt.obj"

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
    this.objDataPath = "../../shared/resources/models/" + objFile
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
}


function createShapeData() {
  list = [];

  let floor = new Shape();
  floor.setObjDataPath("floor.obj");

  floor.setPositionValue(0, -1.3, 0);
  floor.setScaleValue(20);
  floor.setRotationValues([1, 0, 0], -1.55, false);

  list.push(floor)

  let ball = new Shape();
  ball.setObjDataPath("sphere_with_vt.obj");

  ball.setRotationValues([1, 1, 0], 0, true);
  ball.setPositionValue(2, 0, 0);
  list.push(ball)

  let cube = new Shape()
  cube.setObjDataPath("box_with_vt.obj");

  cube.setPositionValue(-2,0,2)
  list.push(cube)

  // let shapes = [floor,ball, cube];
  return list;
}