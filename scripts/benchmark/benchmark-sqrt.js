/** 
 * Common benchmarks about the system. 
 */

import { Benchmarker } from "../../src/core/utils/common/benchmark.js";

const benchmark = new Benchmarker() 

benchmark.start("sqrt-100")
for(let i = 0; i < 100; i++) {
    Math.sqrt(Math.random() * 1e+10)
}
benchmark.end("sqrt-100")

console.log("Math.sqrt(30)    :", benchmark.duration("sqrt-100") / 100)
