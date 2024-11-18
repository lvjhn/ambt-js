/** 
 * Measures 
 * --------------------------------------------------------------------------------------
 * Common measurements and metrics. 
 */

export function cosineSimilarity(A, B) {

}

export function euclideanDistance(A, B) {

}

export function cosineDistance(A, B) {

}

export function fixedCosineDistance(A, B) {

}

export function inverse(measure) {
    return (A, B) => {
        return -1 * measure(A, B)
    }
}

