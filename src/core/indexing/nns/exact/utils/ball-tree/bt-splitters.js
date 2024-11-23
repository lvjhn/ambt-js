/** 
 * DEFAULT SPLITTERS 
 */
import { Point } from "../../../../../utils/project/point.js"

/**
 * Projection Based Splitter
 */
export class BTProjectionSplitter 
{
    constructor(tree) {
        this.tree = tree 
    }

    /**
     * Split a given set of points to children.
     * @param {Point[]} points - points to consider 
     * @param {number} depth - depth of node in tree
     */
    split(points, depth) {
        // --- projection line --- // 
        const projectionLine = this.findProjectionLine(points)

        // --- projected points --- // 
        const projectedPoints = this.projectPoints(projectionLine, points)

        // --- sort points based on their projection --- // 
        points = this.sortPoints(projectionLine, projectedPoints, points)
        
        // --- split points to children --- // 
        const children = this.splitPoints(points) 

        return children
    }

    /**
     * Finds the projection line of the given set of points.
     * @param {Points[]} points - points to consider
     * @returns {Point[]}
     */
    findProjectionLine(points) {
        const keyPoint      = points[0] 
        const firstPoint_   = keyPoint.farthestFrom(points) 
        const secondPoint_  = points[firstPoint_.index].farthestFrom(points) 
        const firstPoint    = points[firstPoint_.index] 
        const secondPoint   = points[secondPoint_.index]
        return [ firstPoint, secondPoint ]
    }

    /** 
     * Projects points to the projection line.
     * @param {Point[]} line - line to project onto
     * @param {Point[]} points - points to project 
     * @returns {Point[]} 
     */
    projectPoints(line, points) {
        const projectedPoints = points.map(
            point => Point.projectToLine(line[0], line[1], point)
        )
        for(let i = 0; i < projectedPoints.length; i++) {
            projectedPoints[i].index = i
        }
        return projectedPoints
    }

    /**
     * Sort points based on their projections on a line.
     * @param {Point[]} line - line where the points are projected onto
     * @param {Point[]} projectedPoints - point projections on the line 
     * @param {Point[]} points - points that are projected to the line 
     */
    sortPoints(line, projectedPoints, points) {
        // --- sort points based on distances --- //
        const distances = []
        const firstPoint = line[0]
        for(let i = 0; i < projectedPoints.length; i++) {
            const otherPoint = projectedPoints[i] 
            const distance = this.tree.measure(firstPoint, otherPoint)
            distances.push({ point: otherPoint, distance: distance })
        }
        distances.sort((a, b) => a.distance - b.distance)

        // --- get sorted points --- //
        points = distances.map(item => points[item.point.index]) 

        return points
    }

    /** 
     * Split points based on median distance. 
     * @param {Point[]} points - points to consider 
     */
    splitPoints(points) {
        const medianIndex = Math.floor(points.length / 2) 
        const left = points.slice(0, medianIndex) 
        const right = points.slice(medianIndex) 
        return [left, right]
    }
}