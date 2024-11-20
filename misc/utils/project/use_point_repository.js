import { PointRepository } from "../../../src/core/utils/project/point-repository.js"; 
import { Point } from "../../../src/core/utils/project/point.js";

console.log("Generating points.") 
const points = Point.randomSet({ count: 1000 }) 
// for(let i in points) {
//     i = parseInt(i)
//     console.log(`\t#${i + 1} = ${points[i].toString()}`)
// }


console.log("Creating point repository.")
const pointRepositoryA = new PointRepository({ 
    points, 
    saveLocation : "./temp/points/custom-points.bin",
    dims: points[0].dimCount()
})

await pointRepositoryA.save()

const pointRepositoryB = new PointRepository({ 
    saveLocation : "./temp/points/custom-points.bin",
    dims: points[0].dimCount()
})

await pointRepositoryB.load({
    onLoadPoint (chunk, point, index) {
        console.log(chunk, point)
    }
})


console.log(`\tSize: ${pointRepositoryB.size()}`) 

console.log() 

console.log("Normalizing points.")
console.log(`\tBefore normalization: ${pointRepositoryB.get(0)}`)

pointRepositoryB.normalize()

console.log(`\tAfter normalization : ${pointRepositoryB.get(0)}`)
