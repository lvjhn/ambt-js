/** 
 * Measures 
 * --------------------------------------------------------------------------------------
 * Common measurements and metrics. 
 */
import { Point } from "./point.js"
import { cosineSimilarity } from "./vectors.js"


/**
 * Computes the euclidean distance between two points.
 * @param {Point} A - the first point 
 * @param {Point} B - the second point
 */
export function euclideanDistance(A, B) {
    let total = 0 
    for(let i = 0; i < A.dimCount(); i++) {
        const AB = A.at(i) - B.at(i)
        const ABAB = AB * AB
        total += ABAB
    }
    let distance = Math.sqrt(total) 
    return distance
}

/**
 * Computes the manhattan distance between two points.
 * @param {Point} A - the first point 
 * @param {Point} B - the second point
 */
export function manhattanDistance(A, B) {
    let total = 0 
    for(let i = 0; i < A.dimCount(); i++) {
        const AB = A.at(i) - B.at(i)
        total += AB
    }
    return total
}

export function cosineDistance(A, B) {
    return 1 - cosineSimilarity(A, B)
}

export function modifiedCosineDistance(A, B) {
    return Math.sqrt(2 * cosineDistance(A, B))
}


