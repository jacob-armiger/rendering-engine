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

  // let floor0 = new Shape();
  // floor0.setObj("floor.obj");
  // floor0.setShaderSrc("textureNormmap");
  // floor0.setTexParams("marble_tile", "normalmap");
  // floor0.setPositionValue(0, -1.3, 0);
  // floor0.setScaleValue(20);
  // floor0.setRotationValues([1, 0, 0], -1.55, false);
  // list.push(floor0);

  // let floor = new Shape();
  // floor.setObj("slab2.obj");
  // floor.setShaderSrc("textureNormmap");
  // floor.setTexParams("marble_tile", "normalmap");
  // // floor.setPositionValue(0, -2.5, 0);
  // floor.setPositionValue(1.4, -2.5, 1.4);
  // floor.setRotationValues([1, 0, 0], 0, false);
  // list.push(floor);

  // let floor2 = new Shape();
  // floor2.setObj("slab2.obj");
  // floor2.setShaderSrc("textureNormmap");
  // floor2.setTexParams("marble_tile", "normalmap");
  // // floor2.setPositionValue(2.8, -2.5, 0);
  // floor2.setPositionValue(-1.4, -2.5, -1.4);
  // floor2.setRotationValues([1, 0, 0], 0, false);
  // list.push(floor2);

  // let floor3 = new Shape();
  // floor3.setObj("slab2.obj");
  // floor3.setShaderSrc("textureNormmap");
  // floor3.setTexParams("marble_tile", "normalmap");
  // // floor3.setPositionValue(0, -2.5, 2.8);
  // floor3.setPositionValue(-1.4, -2.5, 1.4);
  // floor3.setRotationValues([1, 0, 0], 0, false);
  // list.push(floor3);

  // let floor4 = new Shape();
  // floor4.setObj("slab2.obj");
  // floor4.setShaderSrc("textureNormmap");
  // floor4.setTexParams("marble_tile", "normalmap");
  // // floor4.setPositionValue(2.8, -2.5, 2.8);
  // floor4.setPositionValue(1.4, -2.5, -1.4);
  // floor4.setRotationValues([1, 0, 0], 0, false);
  // list.push(floor4);

  // let column = new Shape();
  // column.setObj("column.obj");
  // column.setShaderSrc("texturePhong");
  // column.setTexParams("sidewalk.jpg", "image");
  // column.setPositionValue(2.2, -2.2, 2.2);
  // // column.setScaleValue(7);
  // column.setRotationValues([1, 0, 0], 0, false);
  // list.push(column);

  // let fallingColumn = new Shape();
  // fallingColumn.setObj("column.obj");
  // fallingColumn.setShaderSrc("texturePhong");
  // fallingColumn.setTexParams("sidewalk.jpg", "image");
  // fallingColumn.setPositionValue(2.2, 1.5, -2.2);
  // // fallingColumn.setScaleValue(7);
  // fallingColumn.setRotationValues([1, 1, 1], 0.6, false);
  // list.push(fallingColumn);

  // let reflectiveBall = new Shape();
  // reflectiveBall.setObj("sphere_with_vt.obj");
  // reflectiveBall.setShaderSrc("textureCubemap");
  // reflectiveBall.setTexParams(null, "dynamicCubemap");
  // reflectiveBall.setRotationValues([0, 1, 0], 0, false);
  // reflectiveBall.setScaleValue(8);
  // reflectiveBall.setPositionValue(0, 0, 0);
  // list.push(reflectiveBall);

  // let apollo = new Shape();
  // apollo.setObj("apollo.obj");
  // apollo.setShaderSrc("texturePhong");
  // apollo.setTexParams("sidewalk.jpg", "image");
  // apollo.setRotationValues([0, 1, 0], 0, false);
  // // apollo.setScaleValue(3);
  // apollo.setPositionValue(0, 0, -5);
  // list.push(apollo);


  // let block1 = new Shape();
  // block1.setObj("box_with_vt.obj");
  // block1.setShaderSrc("texturePhong");
  // block1.setTexParams("sidewalk.jpg", "image");
  // block1.setRotationValues([1, 1, 0], 0.3, false);
  // block1.setPositionValue(0, 6, 0);
  // block1.setScaleValue(1);
  // list.push(block1);
  // let block2 = new Shape();
  // block2.setObj("box_with_vt.obj");
  // block2.setShaderSrc("texturePhong");
  // block2.setTexParams("sidewalk.jpg", "image");
  // block2.setRotationValues([0, 1, 1], 0.5, false);
  // block2.setPositionValue(0, 5, 1);
  // block2.setScaleValue(1);
  // list.push(block2);

  // let powerT = new Shape();
  // powerT.setObj("box_with_vt.obj");
  // powerT.setShaderSrc("texturePhong");
  // powerT.setTexParams("hd_power_t.png", "image");
  // powerT.setRotationValues([1, 1, 0], 0.3, true);
  // powerT.setPositionValue(4, 0, 0);
  // powerT.setScaleValue(1);
  // list.push(powerT);

  let floor0 = new Shape();
  floor0.setObj("floor.obj");
  floor0.setShaderSrc("texturePhong");
  floor0.setTexParams("sidewalk.jpg", "image");
  floor0.setPositionValue(0, -1.3, 0);
  floor0.setScaleValue(20);
  floor0.setRotationValues([1, 0, 0], -1.55, false);
  list.push(floor0);

  let rockball = new Shape();
  rockball.setObj("sphere_with_vt.obj");
  rockball.setShaderSrc("texturePhong");
  rockball.setTexParams("sidewalk.jpg", "image");
  // rockball.setRotationValues([0, 0, 0], 0, true);
  rockball.setPositionValue(1, 0, 0);
  list.push(rockball);

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