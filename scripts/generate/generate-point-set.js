/** 
 * Generates point sets.
 */
import { Point } from "@src/core/utils/project/point.js";
import { PointRepository } from "@src/core/utils/project/point-repository.js";
import { createGenerator } from "@src/core/utils/common/random.js";

// --- check arguments --- //
if (process.argv.length < 4) {
    console.log("Error: ust supply arguments [SEED] [DIM_COUNT] [POINT_COUNT]")
    console.log("[SEED]        - seed value for the generator") 
    console.log("[DIM_COUNT]   - no. of dimensions per point")
    console.log("[POINT_COUNT] - no. of points to generate") 
    process.exit()
}

// --- set up --- // 
const SEED              = parseInt(process.argv[2])
const DIM_COUNT         = parseInt(process.argv[3]) 
const POINT_COUNT       = parseInt(process.argv[4]) 
const OUTPUT_FOLDER     = "./data/point-sets/" 

// --- create generator --- // 
console.log("Creating generator.")
const generator = createGenerator(SEED) 

// --- generate points --- //
console.log("Generate points.")
const points = Point.randomSet({ count: POINT_COUNT, dimCount: DIM_COUNT })

// --- creating point repository --- // 
console.log("Creating point repository.") 
const saveLocation = 
    `${OUTPUT_FOLDER}r-${SEED}/${DIM_COUNT}.${POINT_COUNT}.bin`
let pointRepositoryA = new PointRepository({ 
    points: points,
    saveLocation: saveLocation,
    dims : points[0].dimCount()
})
console.log(`\tSize: ${pointRepositoryA.size()}`)

// --- save point repository --- // 
console.log("Saving point repository.")
await pointRepositoryA.save() 

// --- test load point repository --- // 
console.log("Test loading point repository.")
const pointRepositoryB = new PointRepository({
    saveLocation: saveLocation,
    dims: pointRepositoryA.dimCount()
})

console.log(`\tSize Before Load: ${pointRepositoryB.size()}`)
await pointRepositoryB.load()
console.log(`\tSize After Load: ${pointRepositoryB.size()}`)
