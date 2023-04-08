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
    this.objDataPath = "../../shared/resources/models/" + objFile
  }

  setShaderSrc(shaderName) {
    this.shaderVertSrc = `../../shared/resources/shaders/verts/${shaderName}.vert`
    this.shaderFragSrc = `../../shared/resources/shaders/frags/${shaderName}.frag`
  }

}


function createShapeData() {
  list = [];

  let floor = new Shape();
  floor.setObjDataPath("floor.obj");
  floor.setShaderSrc("texturePhong")
  floor.setTexParams("sidewalk.jpg", "image")

  floor.setPositionValue(0, -1.3, 0);
  floor.setScaleValue(20);
  floor.setRotationValues([1, 0, 0], -1.55, false);

  list.push(floor)

  let ball = new Shape();
  ball.setObjDataPath("sphere_with_vt.obj");
  ball.setShaderSrc("texturePhong")
  ball.setTexParams("sidewalk.jpg", "image")

  ball.setRotationValues([0, 0, 0], 0, true);
  ball.setPositionValue(4, 0, 0);
  list.push(ball)
  let top = new Shape();
  top.setObjDataPath("sphere_with_vt.obj");
  top.setShaderSrc("texturePhong")
  top.setTexParams("sidewalk.jpg", "image")

  top.setRotationValues([0, 0, 0], 0, true);
  top.setPositionValue(0, 6, 0);
  list.push(top)
  // let front = new Shape();
  // front.setObjDataPath("sphere_with_vt.obj");
  // front.setShaderSrc("texturePhong")
  // front.setTexParams("sidewalk.jpg", "image")

  // front.setRotationValues([0, 0, 0], 0, true);
  // front.setPositionValue(0, 0, 6);
  // list.push(front)

  // let ball2 = new Shape();
  // ball2.setObjDataPath("sphere_with_vt.obj");
  // ball2.setShaderSrc("textureCubemap")
  // ball2.setTexParams("coit_tower/", "cubemap")

  // ball2.setRotationValues([0, 0, 0], 0, true);
  // ball2.setPositionValue(4, 3, 0);
  // list.push(ball2)

  // let cube = new Shape()
  // cube.setObjDataPath("box_with_vt.obj");
  // cube.setShaderSrc("texture")
  // cube.setTexParams(null, null)

  // // cube.setRotationValues([1, 1, 0], 0, true);
  // cube.setPositionValue(0,0,0)
  // list.push(cube)


  // let cube2 = new Shape()
  // cube2.setObjDataPath("box_with_vt.obj");
  // cube2.setShaderSrc("texturePhong")
  // cube2.setTexParams("hd_power_t.png", "image")

  // // cube2.setRotationValues([1, 1, 0], 0, true);
  // cube2.setPositionValue(0,4,0)
  // list.push(cube2)

  return list;
}