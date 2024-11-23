/** 
 * BallTree 
 * --- 
 * Ball Tree implementation. 
 */
import { Point } from "../../../utils/project/point.js" 
import { PointRepository } from "../../../utils/project/point-repository.js"
import { Indexer } from "../../indexer.js"
import { 
    BTNode, 
    BTInternalNode, 
    BTLeafNodeSingle, 
    BTLeafNodeMultiple 
} from "./utils/ball-tree/bt-nodes.js"
import { Benchmarker } from "../../../utils/common/benchmark.js"

import { BTProjectionSplitter } from "./utils/ball-tree/bt-splitters.js"
import { Heap } from "../../../utils/common/heap.js"

/**
 * Ball Tree Class 
 * @class 
 */
export class BallTree extends Indexer
{
    /**
     * @param {Object} options - options object 
     * @param {Function} options.measure - measurement/metric function to use
     * @param {number} options.threshold - threshold for leaf size 
     * @param {Function} options.branching - branching factor (as function) 
     */
    constructor(options) {
        // --- initialize parent class --- // 
        super(options)

        // --- threshold for leaf size --- // 
        this.threshold = options.threshold ?? 1 

        // --- branching factor --- // 
        this.branching = options.branching ?? ((c, d) => 2)

        // --- tree root --- // 
        this.root = null    

        // --- tree info ---- // 
        this.treeInfo = {
            nodeCounts : {
                internal : 0, 
                leaves : 0,
                all : 0
            }, 
            depths : {
                all : {}, 
                leaves : {}
            }
        } 

        // --- centroids --- // 
        this.centroids = new PointRepository() 

        // --- splitter --- // 
        this.splitter = options.splitter ?? "projection" 

        // --- splitters --- // 
        this.splitters = {
            "projection" : () => new BTProjectionSplitter(this), 
            "axis"       : () => null, 
            "kmeans"     : () => null
        }

        // --- leaf classes --- // 
        this.leafClasses = [
            BTLeafNodeSingle,
            BTLeafNodeMultiple
        ]
    }

    /** 
     * TREE CONSTRUCTION
     */
    create() {
        // --- state object --- // 
        const state = {} 

        // --- configure centroid repository --- // 
        this.centroids.dims = this.points.get(0).dimCount()
        
        // --- create splitter --- // 
        this.splitterObj = this.splitters[this.splitter]()

        // --- start building tree -- //
        this.root = this.buildFor(state, [...this.points.all()], 0)

        return state
    }

    buildFor(state, points, depth) {
        // --- register node visit --- //
        this.treeInfo.nodeCounts.all +=1 

        if(!(depth in this.treeInfo.depths.all)) {
            this.treeInfo.depths.all[depth] = 0 
        }
        this.treeInfo.depths.all[depth] += 1

        // --- handle leaf nodes --- //
        if(points.length <= this.threshold) {
            let leafNode 
            
            // --- register node --- //
            this.treeInfo.nodeCounts.leaves +=1 
            if(!(depth in this.treeInfo.depths.leaves)) {
                this.treeInfo.depths.leaves[depth] = 0 
            }
            this.treeInfo.depths.leaves[depth] += 1

            // --- create node with single point -- //
            if(points.length == 1 && this.threshold == 1) {
                leafNode = new BTLeafNodeSingle({
                    tree : this, 
                    pointId : points[0].index 
                })
            }
            
            // --- create node with multiple points --- // 
            else {
                // --- get centroid of points and register it -- // 
                const centroidId = this.centroids.size()
                const centroid = Point.centroid(points) 
                centroid.index = centroidId
                this.centroids.add(centroid) 

                // --- compute radius of points --- // 
                const { distance: radius } = centroid.farthestFrom(points, this.measure)

                // --- create node --- // 
                leafNode = new BTLeafNodeMultiple({
                    tree : this, 
                    pointIds : points.map(point => point.index), 
                    centroidId : centroidId, 
                    radius : radius 
                })
            }   

            return leafNode 
        }

        // --- register node  -- // 
        this.treeInfo.nodeCounts.internal +=1 
      
        // --- handle internal nodes --- // 
        const children = this.splitterObj.split(points, depth)

        // --- get centroid of points and register it -- // 
        const centroidId = this.centroids.size()
        const centroid = Point.centroid(points) 
        centroid.index = centroidId
        this.centroids.add(centroid) 

        // --- compute radius of points --- // 
        const { distance: radius } = centroid.farthestFrom(points, this.measure)

        // --- create node --- //
        const internalNode = new BTInternalNode({
            tree : this, 
            centroidId : centroidId, 
            radius : radius, 
            children : children.map(
                child => this.buildFor(state, child, depth + 1)
            )
        })

        return internalNode
    }

    /** 
     * TREE QUERIES 
     */
    query(target, k, mode = "nearest") {
        // --- create state object --- // 
        const state = {}
        state.benchmarks = {}
        state.visits = {
            internal : 0,
            leaves : 0, 
            points : 0
        }

        // --- record parameters to state --- // 
        state.inputs = {}
        state.inputs.target = target 
        state.inputs.k = k 
        state.inputs.mode = mode

        // --- create benchmarker object --- // 
        state.benchmark = new Benchmarker() 

        // --- create heap --- // 
        if(mode == "nearest") {
            state.heap = new Heap({ compareFn: (a, b) => b.distance - a.distance })
        }
        else if(mode == "farthest") {
            state.heap = new Heap({ compareFn: (a, b) => a.distance - b.distance })
        }
        else {
            throw new Error(`Unknown mode '${mode}'.`)
        }

        // --- start searching --- // 
        this.searchIn(state, this.root)

        // --- extract results --- // 
        state.results = state.heap.extract().reverse()

        return state
    }

    /**
     * Search for target at a given node.
     * 
     * @param {Object} state - state object  
     * @param {BTNode} node - node to consider
     * @param {number} depth - current depth of node
     */
    searchIn(state, node, depth) {
        // --- extract inputs and heap --- //
        const { target, k, mode } = state.inputs
        const heap = state.heap

        // --- if leaf node --- // 
        if(this.isLeaf(node)) {
            state.visits.leaves += 1 

            const nodePoints = node.getPoints() 
            for(let point of nodePoints) {
                state.visits.points += 1 

                const distance = this.measure(target, point)
                if(heap.size() < k) {
                    heap.push({ id: point.index, distance: distance })
                }
                else {
                    if(distance < heap.peek().distance) {
                        heap.push({ id: point.index, distance: distance })
                        if(heap.size() > k) {
                            heap.pop()
                        }
                    }
                }
            }
        }

        // --- internal node --- //
        else {
            state.visits.internal += 1

            const distanceToLeft  = this.measure(
                target, 
                node.children[0].getCentroid()
            ) 
            const distanceToRight = this.measure(
                target, 
                node.children[1].getCentroid()
            )

            if(distanceToLeft < distanceToRight) {
                if(heap.size() < k || distanceToLeft - node.children[0].getRadius () < heap.peek().distance) {
                    this.searchIn(state, node.children[0], depth + 1)
                }
                if(heap.size() < k || distanceToRight - node.children[1].getRadius () < heap.peek().distance) {
                    this.searchIn(state, node.children[1], depth + 1)
                }
            } else {
                if(heap.size() < k || distanceToRight - node.children[1].getRadius () < heap.peek().distance) {
                    this.searchIn(state, node.children[1], depth + 1)
                }
                if(heap.size() < k || distanceToLeft - node.children[0].getRadius () < heap.peek().distance) {
                    this.searchIn(state, node.children[0], depth + 1)
                }
            }
        }
    }

    /** 
     * UTILITY METHOD
     */

    /**
     * Checks if node is a leaf.
     * @param {BTNode} node - node to consider 
     * @returns {boolean}
     */
    isLeaf(node) {
        for(let nodeClass of this.leafClasses) {
            if(node instanceof nodeClass) {
                return true 
            }
        }
        return false
    }
}
