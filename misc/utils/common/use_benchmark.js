import { Benchmarker } from "../../../src/core/utils/common/benchmark.js" 

const benchmark = new Benchmarker() 

benchmark.start("loop") 
for(let i = 0; i < 1000000; i++) {
    const a = i + (i + 1)
}
benchmark.end("loop") 

console.log(benchmark.duration("loop"))