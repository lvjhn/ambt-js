/**
 * Point Class
 * --------------------------------------------------------------------------------------
 * Represents a point in 2 dimensional space.
 */
import { settings } from "../../../settings.js"
import { createGenerator, randomFloating } from "./random.js"
import { dotProduct } from "./vectors.js"

export class Point
{
    /**
     * Generator object for the point class.
     */
    static generator = createGenerator(settings.random.defaultSeed)
    
    /**
     * Minimum number to generate for a point.
     */
    static generateMin = -10 

    /** 
     * Maximum number to generate for a point.
     */
    static generateMax = 10


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
        return `Point(${this.value.map(x => x.toFixed(4)).join(", ")})`
    }

    /**
     * Generator/factory for a random point.
     * 
     * @param {*} dimCount - number of dimensions for the given point
     * @returns {Point} - the new randomly generated point object
     */
    static random(dimCount = 2) {
        const value = 
            new Array(dimCount)
                .fill(null)
                .map((v, i) => randomFloating({ 
                    min: Point.generateMin,
                    max: Point.generateMax,
                    generator: Point.generator
                }))
        return new Point(value)
    }   

    /**
     * Generate multiple random points. 
     * 
     * @param {*} count 
     * @param {*} dimCount 
     */
    static randomSet({
        count = 5,
        dimCount = 3
    }) {
        return (
            new Array(count)
                .fill(null)
                .map((v, i) => Point.random())
        )
    }

    /** 
     * Get value of component at a given position.
     * @param {number} position - position of the component
     */
    at(position) {
        return this.value.at(position)
    }

    /** 
     * Returns the value of the point.
     */
    dims() {
        return this.value
    }

    /** 
     * Returns the number of dimensions.
     */
    dimCount() {
        return this.value.length
    }


    /**
     * Projects an n-dimensional point (C) to an n-dimensional line (A, B)
     * 
     * @param {Point} A - the first point of the line 
     * @param {Point} B - the second point of the line
     * @param {Point} C - the point to projec to the line AB
     */
    static projectToLine(A, B, C) {
        const AB = new Point(A.dims().map((_, i) => B.at(i) - A.at(i)))
        const AC = new Point(A.dims().map((_, i) => C.at(i) - A.at(i)))

        const DP_ACAB = dotProduct(AC, AB) 
        const DP_ABAB = dotProduct(AB, AB) 
        const scalar = DP_ACAB / DP_ABAB

        const projectionVector = 
            new Point(AB.dims().map((_, i) => scalar * AB.at(i)))

        const projectedPoint = 
            new Point(A.dims().map((_, i) => A.at(i) + projectionVector.at(i)))
        
        return projectedPoint
    }


    /** 
     * Returns the farthest point from a point in given set of points. 
     * @param {Point} point - the point to consider 
     * @param {Point[]} pointSet - array (set) of points to look up
     * @param {(a: Point[], b: Point[]) : number} measure - measuring function to use
     * @returns {Point} - the farthest point in the points set
     */
    farthestPoint(point, pointSet, measure) {
        return maxIndex, maxDistance
    }
} 
