
import { Point } from "../../../src/core/utils/project/point.js";

import { 
    euclideanDistance,
    manhattanDistance,
    cosineDistance,
    modifiedCosineDistance
} from "../../src/core/utils/measures.js";

console.log("Creating points.")
const randomPoints = Point.randomSet({ count: 3, dimCount: 4 }) 
for(let i in randomPoints) {
    i = parseInt(i)
    console.log(`\t#${i + 1} = ${randomPoints[i].toString()}`)
}

console.log()

console.log("Computing euclidean distance between #1 and #2.") 
const euclideanDistance_ = euclideanDistance(randomPoints[0], randomPoints[1])
console.log(`\tDistance: ${euclideanDistance_}`)

console.log()

console.log("Computing manhattan distance between #1 and #2.") 
const manhattanDistance_ = manhattanDistance(randomPoints[0], randomPoints[1])
console.log(`\tDistance: ${manhattanDistance_}`)

console.log()

console.log("Computing cosine distance between #1 and #2.") 
const cosineDistance_ = cosineDistance(randomPoints[0], randomPoints[1])
console.log(`\tDistance: ${cosineDistance_}`)

console.log()

console.log("Computing modified cosine distance between #1 and #2.") 
const modifiedCosineDistance_ = modifiedCosineDistance(randomPoints[0], randomPoints[1])
console.log(`\tDistance: ${modifiedCosineDistance_}`)