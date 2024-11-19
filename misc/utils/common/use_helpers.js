import { randomNumbers, createGenerator } from "../../../src/core/utils/common/random.js";
import { 
    argMin, 
    argMax,
    median,
    repeatStr,
    indent,
    baseFolder, 
    fileName,
    createDirectoryIfNotExists,
    fillMatrix,
    arrayAdd,
    arraySubtract
} from "../../../src/core/utils/common/helpers.js";


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


console.log() 

console.log("Extracting base folder and file name of a file path.") 
const filePath = "./some/path/to/file.js"
console.log(`\tFile Path   : ${filePath}`)
console.log(`\tBase Folder : ${baseFolder(filePath)}`)
console.log(`\tFile Name   : ${fileName(filePath)}`)

console.log() 

console.log("Create directory if it does not exist yet.") 
console.log(`\tDirectory: ./temp/dir`)
createDirectoryIfNotExists("./temp/dir")

console.log() 


console.log("Creating a zero matrix..") 
console.log(fillMatrix(5, 5, 0))


console.log() 


console.log("Subtracting arrays.") 
const arrayA = [1, 2, 3]
const arrayB = [6, 5, 4]
console.log(`\tArray A    : ${arrayA}`)
console.log(`\tArray B    : ${arrayB}`)
console.log(`\tSum        : ${arrayAdd(arrayA, arrayB)}`)
console.log(`\tDifference : ${arraySubtract(arrayA, arrayB)}`)
