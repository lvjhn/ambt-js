/**
 * Point Class
 * --------------------------------------------------------------------------------------
 * Represents a point in 2 dimensional space.
 */
import { createGenerator, randomFloating } from "../common/random.js"
import { dotProduct } from "./vectors.js"
import { euclideanDistance } from "./measures.js"
import { argMin, argMax, maximum, minimum } from "../common/helpers.js"
import { settings } from "../../../../settings.js"

export class Point
{
    /**
     * Generator object for the point class.
     */
    static generator = createGenerator(settings.random.defaultSeed)
    
    /**
     * Minimum number to generate for a point.
     */
    static generateMin = -100

    /** 
     * Maximum number to generate for a point.
     */
    static generateMax = 100

    /** 
     * Collection of all points. 
     */
    static pointSpace  = {} 
    static idCounter = 0

    /**
     * @param {number[]} value - The value of the point.
     * @param {Object} options - options object 
     * @param {number} index - index of the point for reverse look-up (optional)
     */
    constructor(value, { index = 0 } = {}) {
        // --- contains the actual value of the point --- //
        this.value = value  

        // --- register current point in the point space --- //
        this.index = index

        // --- container for data of points --- // 
        this.data = null
    }

    /** 
     * Set the index of each point in an array of points. 
     * @param {Point[]} points - the points to assign index with 
     */
    static setIndices(points) {
        for(let i = 0; i < points.length; i++) {
            points[i].index = i
        }
    }

    /**
     * Returns the points at an index in the repository.
     * @param {number} index 
     * @returns 
     */
    static getById(id) {
        return Point.pointSpace[id]
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
                .map((v, i) => Point.random(dimCount))
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
        const AC = new Point(C.dims().map((_, i) => C.at(i) - A.at(i)))

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
    farthestFrom(pointSet, measureFn = euclideanDistance) {
        let distances = 
            pointSet.map((otherPoint) => measureFn(this, otherPoint))
        let index = argMax(distances)
        let distance = maximum(distances)
        return { index, distance }
    }

    /** 
     * Returns the nearest point from a point in given set of points. 
     * @param {Point} point - the point to consider 
     * @param {Point[]} pointSet - array (set) of points to look up
     * @param {(a: Point[], b: Point[]) : number} measure - measuring function to use
     * @returns {Point} - the farthest point in the points set
     */
    nearestFrom(pointSet, measureFn = euclideanDistance) {
        let distances = 
            pointSet.map((otherPoint) => measureFn(this, otherPoint))
        let index = argMin(distances)
        let distance = minimum(...distances)
        return { index, distance }
    }

    /** 
     * Gets the centroid of a set of points.
     * @param {Points[]} - array of points 
     * @returns {Point} - centroid of the given points
     */
    static centroid(points) {
        // --- initialize center --- //
        const center = []
        const dimCount = points[0].dimCount()
        for(let i = 0; i < dimCount; i++) {
            center.push(0) 
        }

        // --- add points --- //
        for(let i = 0; i < points.length; i++) {
            for(let j = 0; j < dimCount; j++) {
                center[j] = points[i].at(j)
            }
        }

        // --- get center (average) --- //
        for(let i = 0; i < dimCount; i++) {
            center[i] = center[i] / points.length
        }

        return new Point(center)
    }

    /** 
     * Handle length.
     */
    get length() {
        throw new Error("Use .dimCount() instead for Point objects.")
    }

    
} 
