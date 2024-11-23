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
    let minIndex = null 
    let minValue = Infinity 
    for(let i = 0; i < values.length; i++) {
        if(values[i] < minValue) {
            minIndex = i 
            minValue = values[i]
        }
    }
    return minIndex
}

/**
 * Gets the first index of the maximum value in a given array.
 * 
 * @param {any[]} values - value to consider
 * @returns {number} - index (first one) of the maximum value in the array
 */
export function argMax(values) {
    let maxIndex = null 
    let maxValue = -Infinity 
    for(let i = 0; i < values.length; i++) {
        if(values[i] > maxValue) {
            maxIndex = i 
            maxValue = values[i]
        }
    }
    return maxIndex
}


/**
 * Gets the minimum value in a given array.
 * 
 * @param {any[]} values 
 * @returns {number}
 */
export function minimum(values) {
    let minValue = Infinity 
    for(let i = 0; i < values.length; i++) {
        if(values[i] < minValue) {
            minDistance = values[i]
        }
    }
    return minValue
}

/**
 * Gets the maximum value in a given array.
 * 
 * @param {any[]} values - value to consider
 * @returns {number} 
 */
export function maximum(values) {
    let maxValue = -Infinity 
    for(let i = 0; i < values.length; i++) {
        if(values[i] > maxValue) {
            maxValue = values[i]
        }
    }
    return maxValue
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

/** 
 * Repeats a string n-times. 
 * @param {string} str - the string to repeat 
 * @param {number} repeats - the number of times to repeat the string
 * @returns {string} - the final string
 */
export function repeatStr(str, repeats) {
    let finalStr = "" 
    for(let i = 0; i < repeats; i++) {
        finalStr += str
    }
    return finalStr
}


/** 
 * Indents using 4 spaces n times.
 * @param {number} times - no. of times to indent 
 * @returns {string} - indentation string
 */
export function indent(times) {
    return repeatStr("    ", times)
}


/**
 * Gets the file name part of a file path.
 * @param {string} file 
 */
export function fileName(filePath) {
    return filePath.split("/").at(-1)
}

/**
 * Gets the base folder part a file path.
 * @param {string} file 
 */
export function baseFolder(filePath) {
    const parts = filePath.split("/")
    const baseFolder = parts.slice(0, parts.length - 1).join("/")
    return baseFolder
}

/**
 * Creates a directory if it does not exist yet.
 * @param {string} directory - the directory to create
 */
export async function createDirectoryIfNotExists(directory) {
    const fs = (await import("fs")).default
    if(fs.existsSync(directory)) {
       return false  
    }
    fs.mkdirSync(directory, { recursive: true })
    return true 
}

/** 
 * Encodes an array of floating point numbers (4 bytes) to bytes. 
 * @param {array[]} array - array to convert 
 */
export function arrayToBytes_float32(array) {
    const floatArray = new Float32Array(array)
    const bytes = new Uint8Array(floatArray.buffer)
    return bytes
}

/** 
 * Encodes an array of floating point numbers (8 bytes) to bytes. 
 * @param {array[]} array - array to convert 
 */
export function arrayToBytes_float64(array) {
    const floatArray = new Float64Array(array)
    const bytes = new Uint8Array(floatArray.buffer)
    return bytes
}


/** 
 * Decodes a series of bytes to array of floating point numbers (4 bytes).
 * @param {array[]} array - array to convert 
 */
export function bytesToArray_float32(array) {
    const data          = array
    const itemsFloat    = new Float32Array(
        data.buffer, 
        data.byteOffset, 
        data.byteLength / Float32Array.BYTES_PER_ELEMENT
    );
    const items = Array.from(itemsFloat)
    return items
}

/** 
 * Encodes a series of bytes array of floating point numbers (8 bytes)s. 
 * @param {array[]} array - array to convert 
 */
export function bytesToArray_float64(array) {
    const data          = array
    const itemsFloat    = new Float64Array(
        data.buffer, 
        data.byteOffset, 
        data.byteLength / Float64Array.BYTES_PER_ELEMENT
    );
    const items = Array.from(itemsFloat)
    return items
}

/**
 * Creates a M x N matrix and fill its with values.
 * @param {number} rows - no. of rows 
 * @param {number} columns - no. of columns
 * @returns {number[number[]]} - rows x columns matrix filled with zeroes 
 */
export function fillMatrix(rows, columns, fill) {
    const matrix = []
    for(let i = 0; i < rows; i++) {
        const row = []
        for(let j = 0; j < columns; j++) {
            row.push(0)
        }
        matrix.push(row)
    }
    return matrix
}

/** 
 * Adds two arrays together.
 * @param {number[]} A - first array  
 * @param {number[]} B - second array
 * @returns {number} - resulting array
 */
export function arrayAdd(A, B) {
    const total = Array.from(A.length).fill(0) 
    for(let i = 0; i < A.length; i++){
        total[i] = A[i] + B[i]
    }
    return total
}

/** 
 * Subtracts two arrays.
 * @param {number[]} A - first array  
 * @param {number[]} B - second array
 * @returns {number} - resulting array
 */
export function arraySubtract(A, B) {
    const total = Array.from(A.length).fill(0) 
    for(let i = 0; i < A.length; i++){
        total[i] = A[i] - B[i]
    }
    return total
}

/** 
 * Replaces file extension of a file.
 * @param {string} fileName - file to rename 
 * @param {string} newExt - new extension 
 * @param {number} suffixCount 
 *  no. of dots from the right to consider when replacing extension
 */
export function replaceExtension(fileName, newExt, suffixCount) {
    const tokens = fileName.split(".") 
    const nameParts = tokens.slice(0, tokens.length - suffixCount) 
    const name = nameParts.join(".") + newExt
    return name
}