import { Point } from "../../src/core/utils/point.js";

import {
    magnitude, 
    normalize,
    dotProduct,
    cosineSimilarity
} from "../../src/core/utils/vectors.js";

console.log("Creating points.")
const randomPoints = Point.randomSet({ count: 3 }) 
for(let i in randomPoints) {
    i = parseInt(i)
    console.log(`\t#${i + 1} = ${randomPoints[i].toString()}`)
}

console.log()

console.log(`Getting magnitude of each point.`) 
for(let i in randomPoints) {
    i = parseInt(i)
    console.log(`\t#${i + 1} = ${randomPoints[i]} = ${magnitude(randomPoints[i])}`)
}

console.log()

console.log(`Normalizing each point.`) 
for(let i in randomPoints) {
    i = parseInt(i)
    console.log(`\t#${i + 1} = ${randomPoints[i]} = ${normalize(randomPoints[i])}`)
}

console.log()

console.log(`Computing dot product of #1 and #2.`)
const dotProduct_ = dotProduct(randomPoints[0], randomPoints[1])
console.log(`\tDot Product of #1 and #2: ${dotProduct_}`)

console.log() 

console.log(`Computing cosine similarity of #1 and #2.`)
const cosineSimilarity_ = cosineSimilarity(randomPoints[0], randomPoints[1])
console.log(`\tCosine Similarity of #1 and #2: ${cosineSimilarity_}`)