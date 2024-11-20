import { PointRepository } from "../../../src/core/utils/project/point-repository.js"; 
import { Point } from "../../../src/core/utils/project/point.js";

console.log("Generating points.") 
const points = Point.randomSet({ count: 10000 }) 
// for(let i in points) {
//     i = parseInt(i)
//     console.log(`\t#${i + 1} = ${points[i].toString()}`)
// }


console.log("Creating point repository.")
const pointRepository = new PointRepository({ 
    points, 
    saveLocation : "./temp/points/custom-points.bin",
    dims: points[0].dimCount()
})

await pointRepository.save()

await pointRepository.load({
    onLoadPoint (chunk, point, index) {
        console.log(chunk, point)
    }
})


console.log(`\tSize: ${pointRepository.size()}`) 

console.log() 

console.log("Normalizing points.")
console.log(`\tBefore normalization: ${pointRepository.get(0)}`)

pointRepository.normalize()

console.log(`\tAfter normalization : ${pointRepository.get(0)}`)
