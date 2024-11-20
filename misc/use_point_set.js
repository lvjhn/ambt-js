import { PointRepository } from "@src/core/utils/project/point-repository.js"

console.log("Loading point repository.")
const pointRepository = new PointRepository({ 
    saveLocation : "./data/point-sets/glove/glove-wiki-gigaword-50.bin",
    dims: 50
})

await pointRepository.load()

