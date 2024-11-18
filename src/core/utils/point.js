/**
 * Point Class
 * --------------------------------------------------------------------------------------
 * Represents a point in 2 dimensional space.
 */

export class Point
{
    /**
     * @param {number[]} value - The value of the point.
     */
    constructor(value) {
        this.value = value  
    }

    /**
     * Converts the point to a string.
     */
    toString() {    
        return this.value.map(x => x.toFixed(4)).join(" ")
    }
} 
