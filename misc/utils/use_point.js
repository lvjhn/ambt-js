import { Point } from "../../src/core/utils/point.js";

console.log("Creating point.")
const customPoint = new Point([1.0, 1.5, 2.0]) 
console.log(customPoint.toString())

console.log()

console.log("Creating a random point.")
const randomPoint = Point.random(3)
console.log(randomPoint.toString())

console.log()

console.log("Create multiple random points.")
const randomPoints = Point.randomSet(3)
for(let point of randomPoints) {
    console.log(`\t${point.toString()}`)
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

console.log(`Finding farthest points.`) 
const keyPoint = Point.random() 
const pointSet = Point.randomSet(5)
console.log(`\tKey Point: ${keyPoint}`)
console.log(`\tPoint Set:`)
for(let i in pointSet) {
    console.log(`\t\t#${i} = ${pointSet[i].toString()}`)
} 
console.log(`\tFarthest Point:`)




