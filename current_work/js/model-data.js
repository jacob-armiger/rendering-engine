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
    this.position = [0,0,0]
    this.scaleVector = [4,4,4]
    this.boundingVector = [1,1,1]

    this.rotationAxis = [0,1,0]
    this.rotateOnTime = false
    this.roationDegree = 10

    this.modelViewMatrix = null

    this.shaderProgram = null
    this.myDrawable = null
    this.drawableInitialized = false
  }
}


function createShapeData() {

    let floor = new Shape();
    floor.position = [0,-1.3,0]
    floor.scaleVector = [20,20,20]
    floor.rotationAxis = [1,0,0] 
    floor.roationDegree = -1.55
  
    let shape2 = new Shape();
    shape2.position = [2,0,0]
  
    let shapes = [floor,shape2];
    return shapes;
  }