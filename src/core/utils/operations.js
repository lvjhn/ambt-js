/**
 * Default Utility Functions
 * --------------------------------------------------------------------------------------
 * Default utility functions used in the project. 
 */
import { Point } from "./point.js";

/**
 * Gets the normalized value of a point (either a point class or a list) as 
 * normalized to a list.
 * 
 * @param {Point | number[]} point - The point to consider.
 */
export function valueOf(point) {
    if (point.hasOwnProperty('value')) {
        return point.value 
    } else {
        return point 
    }
}

