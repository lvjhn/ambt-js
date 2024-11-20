import { BruteForceNSS } from "../../../../src/core/indexing/nns/exact/brute-force.js";
import { UseIndexer } from "../../use_indexers.js";
import { createGenerator } from "../../../../src/core/utils/common/random.js";
import { settings } from "../../../../settings.js";

const indexer = new UseIndexer()

class PointData 
{
    /**
     * @param {Object} data - data for the given point 
     */
    constructor(data) {
        this.radius = data.radius ?? 1
    }
}

indexer.buildIndexer = function () {
    // --- set radii of points --- // 
    const generator = createGenerator(settings.random.defaultSeed)
    for(let point of this.points.all()) {
        point.data = new PointData({ 
            radius: generator.floating({
                min: -10,
                max: 10
            }
        )})
    }

    // --- build indexer -- //
    const nns = new BruteForceNSS({
        measure: settings.indexers.measure
    })
    nns.build(this.points)
    this.indexer = nns
}

indexer.start()