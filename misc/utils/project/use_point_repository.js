import { PointRepository } from "../../../src/core/utils/project/point-repository.js"; 
import { Point } from "../../../src/core/utils/project/point.js";

console.log("Generating points with random data.") 
const points = Point.randomSet({ count: 1000 }) 

class PointData 
{
    constructor(label, radius) {
        this.label = label,
        this.radius = radius 
    }

    serialize () {
        return JSON.stringify([this.label, this.radius])
    }

    static deserialize (json) {
        const data = JSON.parse(json)
        const point = new PointData(data[0], data[1])
        return point
    }
}

// --- set point data --- //
console.log("Setting point data.")
for(let i in points) {
    points[i].data = new PointData("point-" + i, Math.random())
}


console.log("Creating point repository.")
const pointRepositoryA = new PointRepository({ 
    points, 
    saveLocation : "./temp/points/custom-points.bin",
    dims: points[0].dimCount(), 
    DataClass : PointData
})

await pointRepositoryA.save()

const pointRepositoryB = new PointRepository({ 
    saveLocation : "./temp/points/custom-points.bin",
    dims: points[0].dimCount(),
    DataClass : PointData
})

await pointRepositoryB.load()


console.log(`\tSize: ${pointRepositoryB.size()}`) 

console.log() 

console.log("Normalizing points.")
console.log(`\tBefore normalization: ${pointRepositoryB.get(0)}`)

pointRepositoryB.normalize()

console.log(`\tAfter normalization : ${pointRepositoryB.get(0)}`)


console.log(`\tPoint Data:`, pointRepositoryB.get(0).data)
