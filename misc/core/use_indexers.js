/**
 * UseIndexer 
 * ---
 * Helper class for using/checking functions indexers.
 */
import { Point } from "../../src/core/utils/project/point.js"
import { PointRepository } from "../../src/core/utils/project/point-repository.js"
import { Indexer } from "../../src/core/indexing/indexer.js"

export class UseIndexer
{
    start () {
        // --- generate random points --- //
        console.log("Generating points.") 
        this.generatePoints()

        // --- build indexer --- // 
        console.log("Building indexer.") 
        this.buildIndexer() 

        // --- query indexer --- // 
        console.log("Querying indexer.") 
        this.queryIndexer() 
    }

    generatePoints() {
        const points = Point.randomSet({ count: 1000 }) 
        this.points = new PointRepository({ points }) 
    }

    buildIndexer() {
        const indexer = new Indexer({ indent: 1 })
        indexer.build(this.points)
        indexer.logger.verbose = true
        this.indexer = indexer 
    }

    queryIndexer() {
        const results = this.indexer.query(this.points[0], 10, Indexer.NEAREST)
        console.log(results)
    }
}