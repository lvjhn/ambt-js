import { PointRepository } from "../../../src/core/utils/project/point-repository.js"; 
import { Point } from "../../../src/core/utils/project/point.js";

console.log("Generating points.") 
const points = Point.randomSet({ count: 100000 }) 
// for(let i in points) {
//     i = parseInt(i)
//     console.log(`\t#${i + 1} = ${points[i].toString()}`)
// }

console.log() 

console.log("Creating point repository.")
const pointRepository = new PointRepository({ 
    points : points.filter((x, i) => Math.random() > 0.5), 
    saveLocation : "./temp/points/custom-points.bin"
})

await pointRepository.save()