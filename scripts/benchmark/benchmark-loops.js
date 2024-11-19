/** 
 * Common benchmarks about the system. 
 */

import { Benchmarker } from "../../src/core/utils/common/benchmark.js";

const benchmark = new Benchmarker() 

// --- loop 1000 items --- // 
benchmark.start("loop-1000")
for(let i = 0; i < 1000; i++); 
benchmark.end("loop-1000")
console.log("Loop 1000      :", benchmark.duration("loop-1000"))

// --- loop 100000 items --- // 
benchmark.start("loop-10000")
for(let i = 0; i < 10000; i++); 
benchmark.end("loop-10000")
console.log("Loop 10000     :", benchmark.duration("loop-10000"))

// --- loop 100000 items --- // 
benchmark.start("loop-100000")
for(let i = 0; i < 100000; i++); 
benchmark.end("loop-100000")
console.log("Loop 100000    :", benchmark.duration("loop-100000"))

// --- loop 1000000 items --- // 
benchmark.start("loop-1000000")
for(let i = 0; i < 1000000; i++); 
benchmark.end("loop-1000000")
console.log("Loop 1000000   :", benchmark.duration("loop-1000000"))

// --- loop 1000000 items --- // 
benchmark.start("loop-10000000")
for(let i = 0; i < 10000000; i++); 
benchmark.end("loop-10000000")
console.log("Loop 10000000  :", benchmark.duration("loop-10000000"))
