import * as measures from "@src/core/utils/project/measures.js"

export const settings = {
    random : {
        defaultSeed : 123456789
    },
    indexers : {
        points : {
            mode : "generate",

            // --- generation mode --- // 
            generate : {
                pointCount : 10000,
                dimCount : 2, 
            },

            // --- presets mode --- //
            preset : {
                file : "123456789/2.100",
                dimCount : 2
            } 
          
        },
        normalize: false,
        measure : measures.euclideanDistance, 
        query: {
            target : 60, 
            k : 10, 
            mode : "nearest"
        }
    }
}