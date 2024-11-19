import { BruteForceNNS } from "../../../../src/core/indexing/nss/exact/brute-force.js"; 
import { UseIndexer } from "../../use_indexers.js";

const indexer = new UseIndexer()

indexer.buildIndexer = function () {
    const nns = new BruteForceNNS()
    nns.build(this.points)
    this.indexer = nns
}

indexer.start()