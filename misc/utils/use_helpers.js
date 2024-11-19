import { randomNumbers, createGenerator } from "../../src/core/utils/random.js";
import { 
    argMin, 
    argMax,
    median,
    repeatStr,
    indent
} from "../../src/core/utils/helpers.js";


const generator = createGenerator(123456789)

console.log("Checking argMin and argMax.")
const randomNos = randomNumbers({ count: 8, generator })
console.log(`\tNumbers : ${randomNos.join(", ")}`)
console.log(`\tArg Min : ${argMin(randomNos)}`)
console.log(`\tArg Max : ${argMax(randomNos)}`)

console.log()

console.log("Checking median.")
console.log(`\tNumbers : ${randomNos.sort().join(", ")}`)
console.log(`\tMedian  : ${median(randomNos, (a, b) => a - b)}`)

console.log() 

console.log("Repeating a string 4 times.")
console.log(`\tString: Hello`) 
console.log(`\tRepeated: ${repeatStr("Hello", 4)}`)

console.log() 

console.log("Checking indentation function.") 
console.log(`${indent(1)}Indented one times.`)
console.log(`${indent(2)}Indented two times.`) 
console.log(`${indent(3)}Indented three times.`)