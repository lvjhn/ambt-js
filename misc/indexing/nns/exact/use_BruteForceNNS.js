import { BruteForceNNS } from "../../../../src/core/indexing/nss/exact/brute-force.js"; 
import { UseIndexer } from "../../use_indexers.js";
import { settings } from "../../../../settings.js";

const indexer = new UseIndexer()

indexer.buildIndexer = async function () {
    const nns = new BruteForceNNS({
        measure: settings.indexers.measure
    })
    await nns.build(this.points)
    this.indexer = nns
}

await indexer.start()