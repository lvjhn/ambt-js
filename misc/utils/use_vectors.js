import { Point } from "../../src/core/utils/point.js";

import {
    magnitude, 
    normalize,
    dotProduct,
    projectToLine
} from "../../src/core/utils/vectors.js";

console.log("Creating points.")
const randomPoints = Point.randomSet({ count: 3 }) 
for(let i in randomPoints) {
    console.log(`\t#${i} = ${randomPoints[i].toString()}`)
}

console.log()

console.log(`Getting magnitude of each point.`) 
for(let i in randomPoints) {
    console.log(`\t#${i} = ${randomPoints[i]} = ${magnitude(randomPoints[i])}`)
}

console.log()

console.log(`Normalizing each point.`) 
for(let i in randomPoints) {
    console.log(`\t#${i} = ${randomPoints[i]} = ${normalize(randomPoints[i])}`)
}

console.log()

console.log(`Projecting point #3 to #1 and #2.`) 
const projectionA = projectToLine(randomPoints[2], randomPoints[0], randomPoints[1])
console.log(`\tProjection: ${projectionA}`)

console.log() 

console.log(`Projecting point [7, 8, 9] to [1, 2, 3] and [4, 5, 6].`) 
const projectionB = Point.projectToLine(
    new Point([1, 2, 3]), 
    new Point([4, 5, 6]), 
    new Point([7, 8, 9])
)
console.log(`\tProjection: ${projectionB}`)
