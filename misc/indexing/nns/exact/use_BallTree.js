import { BallTree } from "@src/core/indexing/nns/exact/ball-tree.js";
import { UseIndexer } from "../../use_indexers.js";
import { createGenerator } from "@src/core/utils/common/random.js";
import { settings } from "../../../../settings.js";
import { indent } from "@src/core/utils/common/helpers.js";

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

indexer.buildIndexer = async function () {
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
    const nns = new BallTree({
        measure: settings.indexers.measure, 
        threshold : 1, 
        branching: (c, d) => 2,
        splitter: "projection"
    })

    await nns.build(this.points)
    this.indexer = nns

    console.log(nns.treeInfo)
}

await indexer.start()