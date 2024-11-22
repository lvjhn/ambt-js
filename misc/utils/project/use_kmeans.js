
import { Point } from "../../../src/core/utils/project/point.js";
import { KMeans } from "../../../src/core/utils/project/kmeans.js";
import { PointRepository } from "../../../src/core/utils/project/point-repository.js";

console.log("Generating points.") 
const points = Point.randomSet({ count: 100 }) 

console.log("Assign indices to points.")
const pointRepository = new PointRepository({ points }) 

console.log("Create k-means object.") 
const kmeans = new KMeans({
    centroidCount: 3, 
    points: pointRepository
})


kmeans.fit(10)

const clusters = kmeans.extractClusters()


console.log(clusters)