import * as measures from "@src/core/utils/project/measures.js"

export const settings = {
    random : {
        defaultSeed : 1234567890
    },
    indexers : {
        pointCount : 100,
        dimCount : 300,
        measure : measures.cosineDistance
    }
}