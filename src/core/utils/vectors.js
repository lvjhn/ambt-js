/** 
 * Vector Class 
 * --------------------------------------------------------------------------------------
 * Utility functions for vectors. 
 */
import { Point } from "./point.js"

/**
 * Gets the magnitude of this points.
 * @param {Point} vectorLike - point/vector to consider
 * @returns {number} - the magnitude of the point
 */
export function magnitude(A) {
    let total = 0
    let magnitude = null

    for(let i in A.dims()) {
        total += A.at(i) * A.at(i)
    }

    magnitude = Math.sqrt(total)

    return magnitude
}

/**
 * Normalizes a point.
 * @param {Point} vectorLike - point/vector to consider
 * @returns {number} - a new array containing the normalized point
 */
export function normalize(A) {
    const magnitude_ = magnitude(A) 
    const normalized = []

    for(let i in A.dims()) {
        const component = A.at(i) / magnitude_
        normalized.push(component)
    }

    return new Point(normalized)
}

/**
 * Returns the dot product of two points. 
 * 
 * @param {Point} A 
 * @param {Point} B 
 */
export function dotProduct(A, B) {
    let dotTotal = 0 
    for(let i in A.dims()) {
        dotTotal += A.at(i) * B.at(i)
    }
    return dotTotal
}

