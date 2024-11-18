/** 
 * Helpers Module 
 * --------------------------------------------------------------------------------------
 * Custom helpers (uncategorized).
 */

/**
 * Gets the first index of the minimum value in a given array.
 * 
 * @param {any[]} values 
 * @returns {number} - index (first one) of the minimum value in the array
 */
export function argMin(values) {
    return values.indexOf(Math.min(...values))
}

/**
 * Gets the first index of the maximum value in a given array.
 * 
 * @param {any[]} values - value to consider
 * @returns {number} - index (first one) of the maximum value in the array
 */
export function argMax(values) {
    return values.indexOf(Math.max(...values))
}

/** 
 * Gets the median of values of a given array.
 * @param {any[]} array - array to consider
 * @returns {number} - median value of the array 
 */
export function median(values, comparator = (a, b) => a[i] - b[i]) {
    const valuesCopy = [...values]
    valuesCopy.sort(comparator)
    const medianIndex = Math.floor(values.length / 2)
    return valuesCopy[medianIndex]
}