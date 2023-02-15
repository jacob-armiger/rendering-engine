class Planet {
    constructor (scale,dist) {
        this.scale = scale
        this.dist = dist
        this.position = [0,0,0]
    }

    calcPos(time) {
        return [this.dist*Math.sin(time),0, this.dist*Math.cos(time)]
    }
}

// used circle equation in x and z axis, 

// x = radius * cos(theta)
// theta being 1/orbitalPeriod,
// as a lower orbital period will go faster.

// z = radius * sin(theta)

function createPlanetData() {
    let ratio = 1

    let sun = new Planet(      2*ratio, 0) // 16 ratio
    sun.position = [0,0,-6]

    let mercury = new Planet( 0.3*ratio, 4)
    let venus = new Planet(   0.9*ratio, 5)
    
    let earth = new Planet(     1*ratio, 1)
    earth.position = [3,0,-6]
    // let angle = degreesToRadians(270)
    // earth.position = [4*Math.sin(angle),0, 4*Math.cos(angle)]

    let mars = new Planet(    1*ratio, 3) //0.5 ratio
    mars.position = [6,0,-6]

    let jupiter = new Planet(  11*ratio, 10)
    let saturn = new Planet(    9*ratio, 15)
    let uranus = new Planet(    4*ratio, 18.5)
    let neptune = new Planet( 3.9*ratio, 21)
    let pluto = new Planet(    .2*ratio, 23)

    // let planets = [sun, mercury,venus,earth,mars,jupiter,saturn,uranus,neptune,pluto]
    let planets = [sun, earth, mars]
    return planets
}