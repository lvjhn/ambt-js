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
    async start () {
        const benchmark = new Benchmarker() 

        // --- generate random points --- //
        console.log("Creating points set.") 
        benchmark.start("create-point-set")
        await this.createPointSet()
        benchmark.end("create-point-set")
        console.log(`\tCreation Duration: ${benchmark.duration("create-point-set")}`)

        // --- build indexer --- // 
        console.log("Building indexer.") 
        benchmark.start("build-indexer")
        await this.buildIndexer() 
        benchmark.end("build-indexer")
        console.log(`\tBuild Duration: ${benchmark.duration("build-indexer")}`)


        // --- query indexer --- // 
        console.log("Querying indexer.") 
        benchmark.start("query-indexer")
        await this.queryIndexer() 
        benchmark.end("query-indexer")
        console.log(`\tQuery Duration: ${benchmark.duration("query-indexer")}`)

    }

    async createPointSet() {
        const mode = settings.indexers.points.mode

        if(mode == "generate") {
            await this.generateRandomPoints()
        }
        else if(mode == "preset") {
            await this.usePreset()
        }
        else {
            throw new Error(`Unknown mode '${mode}'.`)
        }
    }

    async generateRandomPoints() {
        const pointCount = settings.indexers.points.generate.pointCount 
        const dimCount = settings.indexers.points.generate.dimCount

        console.log("Generating random points.")
        
        // --- generate points --- //
        const points = Point.randomSet({
            count     : pointCount, 
            dimCount  : dimCount
        }) 
        

        // --- create point repository --- //
        this.points = new PointRepository({ points })

        if(settings.indexers.normalize) {
            this.points.normalize()
        }
    }

    async usePreset() {
        const presetFile = settings.indexers.points.preset.presetFile
        const dimCount = settings.indexers.points.preset.tdimCount        

        console.log(`Using preset file [${presetFile}].`) 

        // --- define point repository object --- //
        this.points = new PointRepository({
            saveLocation: `./data/point-sets/${presetFile}.bin`,
            dims : dimCount 
        })  
        
        // --- load point repository --- //
        await this.points.load()
    }

    async buildIndexer() {
        const indexer = new Indexer({ indent: 1 })
        indexer.build(this.points)
        indexer.logger.verbose = true
        this.indexer = indexer 
    }

    async queryIndexer() {
        const target = settings.indexers.query.target 
        const k = settings.indexers.query.k 
        const mode = settings.indexers.query.mode

        // --- run query --- //
        const results = this.indexer.query(
            this.points.get(target), 
            k,  
            mode
        )

        // --- display results --- //
        console.log(results)

        if(settings.indexers.normalize) {
            this.points.normalize()
        }
    }
}