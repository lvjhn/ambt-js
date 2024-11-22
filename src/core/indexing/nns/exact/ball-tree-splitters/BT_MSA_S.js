/** 
 * BTAxisSplitter.js 
 * ---
 * Axis of maximum spread based splitting for multi-way Ball Tree.
 */
import { BallTree } from "../ball-tree.js";
import { Point } from "../../../../utils/project/point.js";

export class BTMaxSpreadAxisSplitter 
{
    /** 
     * @param {BallTree} tree - the tree associated with this splitter
     * @param {Object} options - options associated with this splitter
     */
    constructor(tree, options) {
        // --- the tree associated with this splitter --- // 
        this.tree = tree 
    }

    /** 
     * Split a given points and extract children.  
     * @param {Point[]} - points to consider
     * @param {number} - current depth in the tree 
     */
    split(points, depth) {
        // --- find axis of maximum spread --- //
        const maxSpreadAxis = this.findAxisOfMaxSpread(points)
        
        // --- sort points by axis --- // 
        points = this.sortPointsByAxis(points, maxSpreadAxis.index)
        
        // --- extract children by partition --- //
        const children = this.extractChildren(points, depth)
        
        return children
    }   

    /** 
     * Finds the axis of maximum spread for a given set of points.
     * @param {Point[]} - points to consider
     */
    findAxisOfMaxSpread(points) {
        // --- get number of dimensions --- // 
        const dimCount = points[0].dimCount()

        // --- container for maximum values per dimensions --- //
        let maxIndex  = -1 
        let maxSpread = -Infinity

        // --- loop through each dimension and find out target axis --- // 
        for(let i = 0; i < dimCount; i++) {
            // --- compute range of current dimension --- //
            let dimMin = Infinity 
            let dimMax = -Infinity
            for(let j = 0; j < points.length; j++) {
                const point      = points[j]
                const dimValue   = point.at(i)
          
                if(dimValue > dimMax) {
                    dimMax = dimValue
                }
                if(dimValue < dimMin) {
                    dimMin = dimValue
                }
            }   

            // --- check if range of current dimension is larger --- //
            const currentSpread = dimMax - dimMin
            if(currentSpread > maxSpread) {
                maxIndex = i 
                maxSpread = currentSpread
            }
        }

        return { 
            index: maxIndex,
            spread: maxSpread
        }
    }
   
    /**
     * Sorts points at a given axis.
     * 
     * @param {Point[]} points - points to consider
     * @param {number} axis - axis to sort with
     */
    sortPointsByAxis(points, axis) {
        points.sort((a, b) => a.at(a) - b.at(axis))
        return points
    }

    /** 
     * Extract children based on the number of branches. 
     * 
     * @param {Point[]} points - points to consider 
     * @param {number} depth - depth of node at the tree 
     */
    extractChildren(points, depth) {
        // --- determine number of branches --- // 
        const branchCount = this.tree.branching(points, depth) 
        
        // --- determine no. of points per branch 
        const perBranchPoints = Math.ceil(points.length / branchCount) 
        
        // --- extract partitions --- //
        const children = [] 
        let prevIndex = 0 
        let i 


        // --- handle main partitions --- //
        for(i = 0; i < points.length; i += perBranchPoints) {
            if(i == 0) continue
            const subset = points.slice(prevIndex, i)
            children.push(subset)
            prevIndex = i
        }

        // --- handle remainder --- // 
        if(i >= points.length) {
            const subset = points.slice(prevIndex, points.length)
            children.push(subset) 
        }

        return children
    }
}