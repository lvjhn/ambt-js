import { Point } from "../../../src/core/utils/project/point.js";

console.log("Creating point.")
const customPoint = new Point([1.0, 1.5, 2.0], { id: 0 }) 
console.log(customPoint.toString())

console.log()

console.log("Creating a random point.")
const randomPoint = Point.random(3)
console.log(randomPoint.toString())

console.log()

console.log("Create multiple random points.")
const randomPoints = Point.randomSet(3)
Point.setIndices(randomPoints)
for(let point of randomPoints) {
    console.log(`\t${point.toString()} | ${point.index}`)
}

console.log()


console.log(`Projecting point #3 to #1 and #2.`) 
const projectionA = Point.projectToLine(randomPoints[2], randomPoints[0], randomPoints[1])
console.log(`\tProjection: ${projectionA}`)

console.log() 

console.log(`Projecting point [7, 8, 9] to [1, 2, 3] and [4, 5, 6].`) 
const projectionB = Point.projectToLine(
    new Point([1, 2, 3]), 
    new Point([4, 5, 6]), 
    new Point([7, 8, 9])
)
console.log(`\tProjection: ${projectionB}`)

console.log() 

console.log(`Finding farthest point.`) 
const keyPointA = Point.random() 
const pointSetA = Point.randomSet(5)
console.log(`\tKey Point: ${keyPointA}`)
console.log(`\tPoint Set:`)
for(let i in pointSetA) {
    console.log(`\t\t#${i} = ${pointSetA[i].toString()}`)
} 
console.log(`\tFarthest Point: #${keyPointA.farthestFrom(pointSetA).index + 1}`)

console.log()

console.log(`Finding nearest point.`) 
const keyPointB = Point.random() 
const pointSetB = Point.randomSet(5)
console.log(`\tKey Point: ${keyPointB}`)
console.log(`\tPoint Set:`)
for(let i in pointSetB) {
    console.log(`\t\t#${i} = ${pointSetB[i].toString()}`)
} 
console.log(`\tNearest Point: #${keyPointB.nerastFrom(pointSetB).index + 1}`)


console.log()

console.log(`Finding centroid of the given points.`) 
console.log(`\tCentroid (Set A): ${Point.centroid(pointSetA)}`)
console.log(`\tCentroid (Set B): ${Point.centroid(pointSetB)}`)




