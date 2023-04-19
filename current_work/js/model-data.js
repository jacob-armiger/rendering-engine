class Shape {
  constructor() {
    // Sources
    this.objPath = ""
    this.shader = null
    this.shaderType = null

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
    this.shader = src
    this.shaderType = type
  }

  setObj(objFile) {
    this.objPath = "../../shared/resources/models/" + objFile
  }

  setShaderSrc(shaderName) {
    this.shaderVertSrc = `../../shared/resources/shaders/verts/${shaderName}.vert`
    this.shaderFragSrc = `../../shared/resources/shaders/frags/${shaderName}.frag`
  }

}


function createShapeData() {
  list = [];

  let floor = new Shape();
  floor.setObj("floor.obj");
  floor.setShaderSrc("texturePhong");
  floor.setTexParams("sidewalk.jpg", "image");
  floor.setPositionValue(0, -1.3, 0);
  floor.setScaleValue(20);
  floor.setRotationValues([1, 0, 0], -1.55, false);
  list.push(floor);

  let rockball = new Shape();
  rockball.setObj("sphere_with_vt.obj");
  rockball.setShaderSrc("texturePhong");
  rockball.setTexParams("sidewalk.jpg", "image");
  // rockball.setRotationValues([0, 0, 0], 0, true);
  rockball.setPositionValue(5, 0, 0);
  list.push(rockball);

  let powerT = new Shape();
  powerT.setObj("box_with_vt.obj");
  powerT.setShaderSrc("texturePhong");
  powerT.setTexParams("hd_power_t.png", "image");
  powerT.setRotationValues([1, 1, 0], 0, true);
  powerT.setPositionValue(0, 6, 0);
  list.push(powerT);

  let coitBall = new Shape();
  coitBall.setObj("sphere_with_vt.obj");
  coitBall.setShaderSrc("textureCubemap");
  coitBall.setTexParams("coit_tower/", "cubemap");
  coitBall.setRotationValues([0, 1, 0], 0, false);
  coitBall.setPositionValue(4, 3, 0);
  list.push(coitBall);

  let reflectiveBall = new Shape();
  reflectiveBall.setObj("sphere_with_vt.obj");
  reflectiveBall.setShaderSrc("textureCubemap");
  reflectiveBall.setTexParams(null, "dynamicCubemap");
  reflectiveBall.setRotationValues([0, 1, 0], 0, false);
  reflectiveBall.setPositionValue(0, 0, 0);
  list.push(reflectiveBall);

  let bumpyCube = new Shape()
  bumpyCube.setObj("box_with_vt.obj");
  bumpyCube.setShaderSrc("textureNormMap")
  bumpyCube.setTexParams("toy_box", "normalmap")
  // bumpyCube.setRotationValues([0, 1, 0], 0, true);
  bumpyCube.setPositionValue(-5,1,0)
  list.push(bumpyCube)

  return list;
}