class Shape {
  constructor() {
    // Sources
    this.objPath = ""
    this.shader = null
    this.shaderType = null

    // World translation data
    this.animate = false
    this.animateSpeed = 1

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

  scaleObject(scalar) {
    this.scaleVector = [scalar,scalar,scalar]
  }
  
  scaleByAxis(x,y,z) {
    this.scaleVector = [x,y,z]
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

  let floor0 = new Shape();
  floor0.setObj("plane.obj");
  floor0.setShaderSrc("textureNormmap");
  floor0.setTexParams("stone", "normalmap");
  floor0.setPositionValue(0, -2.7, 0);
  floor0.scaleByAxis(40,1,40);
  list.push(floor0);

  /* -------------SCENE----------------- */
  let reflectiveBall = new Shape();
  reflectiveBall.setObj("sphere_with_vt.obj");
  reflectiveBall.setShaderSrc("textureCubemap");
  reflectiveBall.setTexParams(null, "dynamicCubemap");
  reflectiveBall.setRotationValues([0, 1, 0], 0, false);
  reflectiveBall.scaleObject(8);
  reflectiveBall.setPositionValue(0, 0, 0);
  list.push(reflectiveBall);
  
  let column = new Shape();
  column.setObj("column.obj");
  column.setShaderSrc("texturePhong");
  column.setTexParams("sidewalk.jpg", "image");
  column.setPositionValue(2.2, -2.4, 2.2);
  // column.scaleObject(7);
  column.setRotationValues([1, 0, 0], 0, false);
  list.push(column);

  let fallingColumn = new Shape();
  fallingColumn.animate = true
  fallingColumn.animateSpeed = getRandomDec()
  fallingColumn.setObj("column.obj");
  fallingColumn.setShaderSrc("texturePhong");
  fallingColumn.setTexParams("sidewalk.jpg", "image");
  fallingColumn.setPositionValue(3, 1.5, -2.5);
  // fallingColumn.scaleObject(7);
  fallingColumn.setRotationValues([1, 1, 0], -0.6, true);
  list.push(fallingColumn);

  let apollo = new Shape();
  apollo.animate = true
  apollo.animateSpeed = getRandomDec()
  apollo.setObj("apollo.obj");
  apollo.setShaderSrc("texturePhong");
  apollo.setTexParams("sidewalk.jpg", "image");
  apollo.setRotationValues([1, 1, 1], 0, true);
  apollo.setPositionValue(0, 0, -5);
  list.push(apollo);

  let powerT = new Shape();
  powerT.animate = true
  powerT.animateSpeed = getRandomDec()
  powerT.setObj("box_with_vt.obj");
  powerT.setShaderSrc("texturePhong");
  powerT.setTexParams("hd_power_t.png", "image");
  powerT.setRotationValues([1, 1, 0], 0.3, true);
  powerT.setPositionValue(4, 0, 0);
  powerT.scaleObject(1);
  list.push(powerT);

  for(let i = 0; i < 30; i++) {
    let block = new Shape();
    block.animate = true
    block.animateSpeed = getRandomDec()
    block.setObj("box_with_vt.obj");
    block.setShaderSrc("texturePhong");
    block.setTexParams("sidewalk.jpg", "image");
    block.setRotationValues([1, 1, 1], 0, true);
    block.setPositionValue(getRandomInt(2, 8), 0, getRandomInt(-8, 8));
    block.scaleObject(1);
    list.push(block);
  }
  for(let i = 0; i < 30; i++) {
    let block = new Shape();
    block.animate = true
    block.animateSpeed = getRandomDec()
    block.setObj("box_with_vt.obj");
    block.setShaderSrc("texturePhong");
    block.setTexParams("sidewalk.jpg", "image");
    block.setRotationValues([1, 1, 1], 0, true);
    block.setPositionValue(getRandomInt(-8, -2), 0, getRandomInt(-8, 8));
    block.scaleObject(1);
    list.push(block);
  }
  /* --------------SCENE---------------- */


  // let rockball = new Shape();
  // rockball.setObj("sphere_with_vt.obj");
  // rockball.setShaderSrc("texturePhong");
  // rockball.setTexParams("sidewalk.jpg", "image");
  // // rockball.setRotationValues([0, 0, 0], 0, true);
  // rockball.animate = true
  // rockball.setPositionValue(0, 0 ,0);
  // list.push(rockball);

  // let coitBall = new Shape();
  // coitBall.setObj("sphere_with_vt.obj");
  // coitBall.setShaderSrc("textureCubemap");
  // coitBall.setTexParams("coit_tower/", "cubemap");
  // coitBall.setRotationValues([0, 1, 0], 0, false);
  // coitBall.setPositionValue(4, 3, 0);
  // list.push(coitBall);


  // let bumpyCube = new Shape()
  // bumpyCube.setObj("box_with_vt.obj");
  // bumpyCube.setShaderSrc("textureNormMap")
  // bumpyCube.setTexParams("toy_box", "normalmap")
  // // bumpyCube.setRotationValues([0, 1, 0], 0, true);
  // bumpyCube.setPositionValue(-5,1,0)
  // list.push(bumpyCube)

  return list;
}