import { Heap } from "@src/core/utils/common/heap.js";
import { Point } from "../../../src/core/utils/project/point.js";
import { createGenerator, randomNumbers } from "../../../src/core/utils/common/random.js";

// --- create generator --- // 
console.log("Creating generator.")
const generator = createGenerator(1234567890)
console.log(`\tGenerator: Chance(seed=${generator.seed})`)

// --- generate points --- // 
console.log("Generating values.")
let array = randomNumbers({ count: 10})
array = array.map(x => Math.abs(x))
console.log(`\tValues: ${array.join(" ")}`)

// -- initialize heap --- // 
console.log("Initializing heap.") 
const heap = new Heap({ compareFn: (a, b) => a - b } )
for(let item of array) {
    heap.push(item)
}

// --- converting heap to array --- // 
console.log("Converting heap to array.")
const converted = heap.toArray()
console.log(`\tArray: ${converted.join(", ")}`)


// --- extracting heap to array --- // 
console.log("Extracting heap to array.")
const extracted = heap.extract()
console.log(`\tArray: ${extracted.join(", ")}`)

