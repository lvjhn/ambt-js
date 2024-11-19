import { 
    createGenerator, 
    randomInteger,
    randomFloating,
    pickFromArray,
    randomNumbers
} from "../../../src/core/utils/common/random.js";

console.log("Creating generator.")
const generator = createGenerator()
console.log(`\tGenerator: ${generator.constructor.name}(${generator.seed})`)

console.log("Creating random integers.")
const integerA = randomInteger({ min: 0, max: 100, generator })
const integerB = randomInteger({ min: 0, max: 100, generator })
const integerC = randomInteger({ min: 0, max: 100, generator })
console.log("\tInteger A:", integerA)
console.log("\tInteger B:", integerB)
console.log("\tInteger C:", integerC)

console.log("Creating random floating point numbers.")
const floatA = randomFloating({ min: 0, max: 100, generator })
const floatB = randomFloating({ min: 0, max: 100, generator })
const floatC = randomFloating({ min: 0, max: 100, generator })
console.log("\tFloat A:", floatA)
console.log("\tFloat B:", floatB)
console.log("\tFloat C:", floatC)

console.log("Randomly pick elements from an array.")
const array = [5, 9, 10, 1, 2, 11, 8, 7, 4, 3]
console.log(`\tArray: ${array.join(", ")}`)
console.log(`\tPicked Items: ${pickFromArray({ array, k : 3, generator}).join(", ")}`)

console.log() 

console.log("Generating array of random numbers (-1 to 1).")
const randomNos = randomNumbers({ count: 10, generator }) 
console.log(randomNos)
