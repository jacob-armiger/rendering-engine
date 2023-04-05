class Shape {
  constructor() {
    this.textureIMG = ""
    this.objDataPath = ""

    this.textureInfo = 

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

  setTexImg(src) {
    this.textureIMG = src
  }

  setObjDataPath(objFile) {
    this.objDataPath = "../../shared/resources/models/" + objFile
  }

  setShaderSrc(shaderName) {
    this.shaderVertSrc = `../../shared/resources/shaders/verts/${shaderName}.vert`
    this.shaderFragSrc = `../../shared/resources/shaders/frags/${shaderName}.frag`
  }

}


function createShapeData() {
  list = [];

  // let floor = new Shape();
  // floor.setObjDataPath("floor.obj");
  // floor.setShaderSrc("textureGouraud")
  // floor.setTexImg("hd_power_t.png")

  // floor.setPositionValue(0, -1.3, 0);
  // floor.setScaleValue(20);
  // floor.setRotationValues([1, 0, 0], -1.55, false);

  // list.push(floor)

  let ball = new Shape();
  ball.setObjDataPath("box_with_vt.obj");
  ball.setShaderSrc("textureGouraud")
  ball.setTexImg("sidewalk.jpg")

  ball.setRotationValues([1, 1, 0], 0, true);
  ball.setPositionValue(3, 0, 0);
  list.push(ball)

  let cube = new Shape()
  cube.setObjDataPath("sphere_with_vt.obj");
  cube.setShaderSrc("texturePhong")
  cube.setTexImg("sidewalk.jpg")

  // cube.setRotationValues([1, 1, 0], 0, true);
  cube.setPositionValue(0,0,0)
  list.push(cube)

  return list;
}