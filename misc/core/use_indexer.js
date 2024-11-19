import { PointRepository } from "../../src/core/utils/project/point-repository.js";
import { Point } from "../../src/core/utils/project/point.js";
import { Indexer } from "../../src/core/core/indexer.js";

// --- generate points --- //
console.log("Generating points.") 
const points = Point.randomSet({ count: 1000 }) 

// --- create point repository --- //
console.log("Creating point repository.")
const pointRepository = new PointRepository({ points })

// --- create indexer --- //
console.log("Creating indexer.")
const indexer = new Indexer({ indent: 1 })
indexer.logger.verbose = true

// --- build the indexer --- //
console.log("Building indexer.")
indexer.build(pointRepository)

// --- query the indexer --- // 
console.log("Querying the indexer.") 
indexer.query(pointRepository.get(0), 10, Indexer.NEAREST)