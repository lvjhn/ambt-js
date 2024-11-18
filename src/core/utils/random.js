/**
 * Randomness Module
 * --------------------------------------------------------------------------------------
 * Module for generating random items.
 */


import { settings } from "../../../settings.js";
import { currentTime } from "./clock.js";
import Chance from "chance"

/**
 * Creates a generator. By default uses chance.js.
 * @param {number} seed - the seed value to use. 
 */
export function createGenerator(seed = settings.random.defaultSeed) {
    return new Chance(seed)
}  

/**
 * Generate random integers (within min-max), wrapper 
 * function. (enables drop-in support for other libraries)  
 * 
 * @param {Object} options - Options to use.
 * @param {number} options.min - minimum value. 
 * @param {number} options.max - maximum value
 * @param {any}    options.generator 
 *      The generator to use (must implement .integer({ min, max}))
 */
export function randomInteger({ 
    min = 0, 
    max = 100, 
    generator = createGenerator(currentTime())
}) {
    return generator.integer({ min, max })
}

/**
 * Generate random floating point numbers (within min-max), wrapper 
 * function. (enables drop-in support for other libraries)  
 * 
 * @param {Object} options - options to use.
 * @param {number} options.min - minimum value. 
 * @param {number} options.max - maximum value.
 * @param {any}    options.generator 
 *      the generator to use (must implement .integer({ min, max}))
 */
export function randomFloating({
    min = 0, 
    max = 100, 
    generator = createGenerator(currentTime())
}) {
    return generator.floating({ min, max })
}

/**
 * Picks multiple elements from an array of values. 
 * @param {any[]}  options.array - array of values to select value from.
 * @param {number} options.k - the number of element to select.
 * @param {any}    options.generator - the generator to use 
 */
export function pickFromArray({
    array = [],
    k = 0, 
    generator = createGenerator(currentTime())
}) {
    return generator.pick(array, k)
} 

/**
 * Generates a random array of floating point from 0 to 1.
 * 
 * @param {any[]}  options.array - array of values to select value from.
 * @param {number} options.k - the number of element to select.
 * @param {any}    options.generator - the generator to use 
 */
export function randomNumbers({
    count = 5,
    generator = createGenerator(currentTime())
}) {
    const items = [] 
    for(let i = 0; i < count; i++) {
        items.push(randomFloating({ min: -1, max: 1, generator }))
    }
    return items
} 
