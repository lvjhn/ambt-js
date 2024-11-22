import * as measures from "@src/core/utils/project/measures.js"
import * as indexer from "@src/core/indexing/indexer.js"

export const settings = {
    random : {
        defaultSeed : 1234567890
    },
    indexers : {
        points : {
            mode : "generate",

            // --- generation mode --- // 
            generate : {
                pointCount : 100,
                dimCount : 300, 
            },

            // --- presets mode --- //
            preset : {
                file : "123456789/2.100",
                dimCount : 2
            } 
          
        },
        measure : measures.cosineDistance, 
        query: {
            target : 50, 
            k : 10, 
            mode : indexer.NEAREST
        }
    }
}