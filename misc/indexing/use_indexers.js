/**
 * UseIndexer 
 * ---
 * Helper class for using/checking functions indexers.
 */
import { Point } from "@src/core/utils/project/point.js"
import { PointRepository } from "@src/core/utils/project/point-repository.js"
import { Indexer } from "@src/core/indexing/indexer.js"
import { Benchmarker } from "@src/core/utils/common/benchmark.js"
import { settings } from "../../settings.js"

export class UseIndexer
{
    start () {
        const benchmark = new Benchmarker() 

        // --- generate random points --- //
        console.log("Generating points.") 
        benchmark.start("generate-points")
        this.generatePoints()
        benchmark.end("generate-points")
        console.log(`\tDuration: ${benchmark.duration("generate-points")}`)

        // --- build indexer --- // 
        console.log("Building indexer.") 
        benchmark.start("build-indexer")
        this.buildIndexer() 
        benchmark.end("build-indexer")
        console.log(`\tDuration: ${benchmark.duration("build-indexer")}`)


        // --- query indexer --- // 
        console.log("Querying indexer.") 
        this.queryIndexer() 
    }

    generatePoints() {
        const points = Point.randomSet({ 
            count: settings.indexers.pointCount,
            dimCount: settings.indexers.dimCount
        }) 
        this.points = new PointRepository({ points }) 
    }

    buildIndexer() {
        const indexer = new Indexer({ indent: 1 })
        indexer.build(this.points)
        indexer.logger.verbose = true
        this.indexer = indexer 
    }

    queryIndexer() {
        const results = this.indexer.query(this.points.get(0), 10, Indexer.NEAREST)
        console.log(results)
    }
}