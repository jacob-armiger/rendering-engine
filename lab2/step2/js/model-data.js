class Model {
    constructor () {
        this.scaleVector = [1,1,1]
        this.orbitVector = [0,0,0]
        this.position = [0,0,0]
        this.speed = 1
    }

    updateScale(scale) {
        this.scaleVector = [scale, scale, scale]
    }

    // calcPos(time) {
    //     // return [this.dist*Math.sin(time),0, this.dist*Math.cos(time)]
    // }
}

// x = radius * cos(theta)
// theta being 1/orbitalPeriod,
// as a lower orbital period will go faster.

// z = radius * sin(theta)

function createModelData() {
    let ratio = 2.5           // This is NOT a hard coded value for object bounds. This is used for experimenting with object system sizes 

    let sun = new Model() // 16 ratio
    sun.updateScale(3*ratio)
    sun.position = [0,0,0]

    let mercury = new Model()
    mercury.updateScale(0.3*ratio)
    mercury.position = [3.5,0,0]
    mercury.orbitVector = [0,1,0]
    mercury.speed = 1.47

    let venus = new Model()
    venus.updateScale(0.9*ratio)
    venus.position = [5,0,0]
    venus.orbitVector = [0,-1,0]
    venus.speed = 1.35
    
    let earth = new Model()
    earth.updateScale(1*ratio)
    earth.position = [7,0,0]
    earth.orbitVector = [0,1,0]
    earth.speed = 1.29

    let mars = new Model() //0.5 ratio
    mars.updateScale(0.5*ratio)
    mars.position = [9,0,0]
    mars.orbitVector = [0,1,0]
    mars.speed = 1.24

    let jupiter = new Model()
    jupiter.updateScale(1.8*ratio)
    jupiter.position = [11.5,0,0]
    jupiter.orbitVector = [0,1,0]
    jupiter.speed = 1.13

    let saturn = new Model()
    saturn.updateScale(1.7*ratio)
    saturn.position = [15.3,0,0]
    saturn.orbitVector = [0,1,0]
    saturn.speed = 1.09

    let uranus = new Model()
    uranus.updateScale(1.4*ratio)
    uranus.position = [19,0,0]
    uranus.orbitVector = [0,-1,0]
    uranus.speed = 1.068

    let neptune = new Model()
    neptune.updateScale(1.3*ratio)
    neptune.position = [22,0,0]
    neptune.orbitVector = [0,1,0]
    neptune.speed = 1.055

    let pluto = new Model()
    pluto.updateScale(0.3*ratio)
    pluto.position = [24,0,0]
    pluto.orbitVector = [0,1,0]
    pluto.speed = 1.03

    // let models = [sun, mercury,venus,earth,mars,jupiter,saturn,uranus,neptune,pluto]
    let models = [sun]
    return models
}