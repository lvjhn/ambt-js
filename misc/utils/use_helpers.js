import { randomNumbers, createGenerator } from "../../src/core/utils/random.js";
import { 
    argMin, 
    argMax,
    median
} from "../../src/core/utils/helpers.js";


const generator = createGenerator(123456789)

console.log("Checking argMin and argMax.")
const randomNos = randomNumbers({ count: 8, generator })
console.log(`\tNumbers : ${randomNos.join(", ")}`)
console.log(`\tArg Min : ${argMin(randomNos)}`)
console.log(`\tArg Max : ${argMax(randomNos)}`)

console.log("Checking median.")
console.log(`\tNumbers : ${randomNos.sort().join(", ")}`)
console.log(`\tMedian  : ${median(randomNos, (a, b) => a - b)}`)
