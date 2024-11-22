/** 
 * ball-tree.js
 * -------------------------------------------------------------------------------------
 * Implements a ball tree class.
 */
import { Indexer, NEAREST, FARTHEST } from "../../indexer.js"
import { Point } from "../../../utils/project/point.js"
import { PointRepository } from "../../../utils/project/point-repository.js"
import { Benchmarker } from "../../../utils/common/benchmark.js"
import { Heap } from "../../../utils/common/heap.js"

import { BTMaxSpreadAxisSplitter } from "./ball-tree-splitters/BT_MSA_S.js"

/** 
 * @class
 */
export class BallTree extends Indexer
{
    /**
     * @param {Object} options - options object 
     * @param {Function} options.measure - measures.euclideanDistance - measurement/metric function to use   
     * @param {number} options.threshold - threshold for leaf nodes 
     * @param {Function} options.branching - branches per depth
     * @param {number} options.splitter - the splitter associated with this ball tree
     */
    constructor(options) {
        // --- initialize parent class --- // 
        super(options)

        // --- threshold for leaf nodes --- // 
        this.threshold = this.threshold ?? 1
        
        // --- branches per depth --- // 
        this.branching = this.branching ?? ((c, d) => 2)

        // --- tree nodes table --- //
        this.nodes = []

        // --- root node id --- //
        this.rootNodeId = null

        // --- centroids --- // 
        this.centroids = new PointRepository()

        // --- the splitter associated with this ball tree --- // 
        this.splitter = this.splitter ?? "max-spread-axis"

        // --- splitters associated with this ball tree --- // 
        this.splitters = {
            "max-spread-axis" : () => new BTMaxSpreadAxisSplitter(this, {})
        }

        // --- the current splitter object --- // 
        this.splitterObj = null

        // --- tree info --- //
        this.treeInfo = {
            nodeCounts : {
                internal : 0, 
                leaves : 0
            }, 
            depths : {
                all : {},
                leaves : {}
            }
        }

        // --- leaf classes for this index --- // 
        this.leafClasses = new Set([
            BTLeafMultiple,
            BTLeafSingle
        ])
        
    }

    /** 
     * TREE CONSTRUCTION METHODS
     */
    
    /**
     * Constructs the indexer.
     */
    create() {
        this.logger.verboseLog("Creating indexer.") 
        
        // --- localize points --- //
        const points = this.points 

        // --- set up centroid repository --- //
        this.centroids.dimCount = this.points.get(0).dimCount()

        // --- create state object --- // 
        const state = {} 

        // --- create splitter object --- // 
        this.splitterObj = this.splitters[this.splitter]()
        
        // --- start building tree --- // 
        this.rootNodeId = this.buildFor([...points.all()], 0)

        return state 
    }

    /** 
     * Builds for points at a specified depth.
     * @param {Point[]} currentPoints - current points to consider
     * @param {number} depth - depth of the construction progress
     * @returns {number} - node id
     */
    buildFor(currentPoints, depth) {
        // --- threshold value for leaf nodes ---- // 
        const threshold = this.threshold 

        // --- handle cases where number of points is less than threshold --- // 
        if(currentPoints.length <= threshold) {
            // --- register leaf node --- //
            this.treeInfo.nodeCounts.leaves += 1
            if(!(depth in this.treeInfo.depths.leaves)) {
                this.treeInfo.depths.leaves[depth] = 0 
            }
            this.treeInfo.depths.leaves[depth] += 1


            // --- build leaf node --- //
            const nodeId = this.buildLeafNode(currentPoints, depth)
            
            return nodeId
        }
        
        // --- register internal node --- //
        this.treeInfo.nodeCounts.internal += 1
        if(!(depth in this.treeInfo.depths.all)) {
            this.treeInfo.depths.all[depth] = 0 
        }
        this.treeInfo.depths.all[depth] += 1


        // --- build internal node --- // 
        const nodeId = this.buildInternalNode(currentPoints, depth)

        return nodeId 
    }

    /**
     * Builds and register an internal node.
     * 
     * @param {Point[]} currentPoints - points to consider
     * @param {number} depth - depth in the tree
     * @returns {number} - node id
     */
    buildInternalNode(currentPoints, depth) {
        // --- extract children for current points --- //
        const children = this.splitterObj.split(currentPoints)

        // --- extract centroid for current node --- //
        const centroid = Point.centroid(currentPoints)

        // --- register centroid --- // 
        this.centroids.add(centroid)   
        const centroidId = this.centroids.size() - 1   

        // --- extract radius for current node --- // 
        const radius = this.computeRadius(centroid, currentPoints)

        const node = new BTInternalNode({
            tree : this,
            centroidId : centroidId,
            radius   : radius, 
            children : children.map(child => this.buildFor(child, depth + 1)) 
        })

        // --- register node --- //
        this.nodes.push(node)

        // --- create record for current node --- //
        const nodeId = this.nodes.length - 1

        return nodeId
    }

    /** Computes the radius for an internal node. */
    computeRadius(centroid, currentPoints) {
        let { distance: radius } = centroid.farthestFrom(currentPoints) 
        return radius
    }

    /**
     * Builds and registers a leaf node. 
     * 
     * @param {Point[]} currentPoints - points to consider
     * @param {number} depth - depth in the tree
     * @returns {number} - node id
     */
    buildLeafNode(currentPoints, depth) {
        let node = null
        const threshold = this.threshold
            
        // --- build node --- // 
        if(currentPoints.length == 1 && threshold == 1) {
            const remainingPoint = currentPoints[0]
            node = new BTLeafSingle({
                tree: this, 
                pointId : remainingPoint.index
            })
        } else {
            let centroid = Point.centroid(currentPoints)
            let { index, distance: radius } = centroid.farthestFrom(currentPoints) 

            // --- register centroid --- //
            this.centroids.add(centroid)
            const centroidId = this.centroids.size() - 1 

            node = new BTLeafMultiple({
                tree: this, 
                centroidId : centroidId, 
                radius : radius, 
                points : currentPoints.map(point => point.index)
            })
        }

        // --- add to node list --- // 
        this.nodes.push(node)

        // --- create record for current node --- //
        const nodeId = this.nodes.length - 1 

        return nodeId
    }

    /** 
     * TREE QUERIES 
     */
    
    /** @inheritdoc */
    query(target, k, mode = "nearest") {
        // --- create state object --- // 
        const state = {
            visitCount : 1
        } 
        state.benchmarks = {}

        // --- record parameters to state --- // 
        state.inputs = {} 
        state.inputs.target = target
        state.inputs.k = k  
        state.inputs.mode = mode 

        // --- query objects (heap) --- // 
        if(mode == "nearest") {
            state.heap = new Heap({ compareFn: (a, b) => b.distance - a.distance })
        }
        else if(mode == "farthest") {
            state.heap = new Heap({ compareFn: (a, b) => a.distance - a.distance })
        } 
        else {
            throw new Error(`Unknown mode '${mode}'.`)
        }

        // --- create benchmarker object --- // 
        state.benchmark = new Benchmarker() 

        // --- start querying at root node --- // 
        this.searchIn(state, this.getRootNode(), 0)

        // --- post query operations -- //
        state.nearest = state.heap.extract().reverse()

        // --- delete heap --- /
        delete state.heap

        return state
    }

    /** 
     * Searches the current node.
     * 
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being querie s
     * @param {number} depth - construction depth
     */
    searchIn(state, node, depth) {
        state.visitCount += 1
        // --- if node is a leaf handle respectively --- //
        if(this.isLeaf(node)) {
            this.handleLeafNode(state, node, depth)
        } 
        // --- handle internal nodes --- //
        else {
            this.handleInternalNode(state, node, depth)
        }
    }

   
    /** 
     * Handles internal nodes. 
     * 
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being querie s
     * @param {number} depth - construction depth
     */
    handleInternalNode(state, node, depth) {
        // --- get visit order --- // 
        const visitOrder = this.defineVisitOrder(state, node, depth)

        // --- loop through visit order --- //
        this.visitChildren(state, node, depth, visitOrder)
    }

    /** 
     * Defines the visit order for the current node. 
     * 
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being queries
     * @param {number} depth - construction depth
     */
    defineVisitOrder(state, node, depth) {
        // --- target node --- // 
        const target = state.inputs.target

        // --- mode --- //
        const mode = state.inputs.mode

        // --- loop through children and compute distances --- // 
        const distances = []
        const children = node.children 
        for(let i = 0; i < children.length; i++) {
            const childId = children[i]
            const child = this.nodes[childId]
            const childCentroid = child.getCentroid()
            const distance = this.measure(target, childCentroid) 
            distances.push({ index: i, distance: distance }) 
        }

        // --- sort by distance --- //
        if(mode == "nearest") {
            distances.sort((a, b) => a.distance - b.distance)
        }
        else if(mode == "farthest") {
            distances.sort((a, b) => b.distance - a.distance)
        }
        else {
            throw new Error(`Unknown mode ${mode}.`)
        }

        return distances
    }   

    /** 
     * Visits children of an internal node. 
     * 
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being queries
     * @param {number} depth - construction depth
     */
    visitChildren(state, node, depth, visitOrder) {
        for(let visitItem of visitOrder) {
            if(this.shouldVisit(state, node, depth, visitItem)) {
                const childIndex = visitItem.index
                const childId = node.children[childIndex]
                const child = this.nodes[childId] 
                this.searchIn(state, child, depth + 1)
            }
        }
    }

    /**
     * Defines whether a child node must be visited. 
     * 
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being queries
     * @param {number} depth - construction depth
     * @param {BTNode} child - the child to check whether to be visited
     */
    shouldVisit(state, node, depth, visitItem, heap) {
        // --- target --- //
        const target = state.inputs.target 
      
        // --- get candidate node to visit --- //
        const childId = node.children[visitItem.index] 
        const child = this.nodes[childId] 
        
        // --- get centroid of candidate child node to visit --- // 
        const centroid = child.getCentroid()

        // --- distance to target --- // 
        const distance = this.measure(centroid, target)

        // --- get radius of candidate child node to visit --- // 
        const radius = child.getRadius() 

        // --- check if whether node should be visited --- //
        return this.visitCheckCondition(state, node, depth, distance, radius)
    }

    /**
     * Defines the check condition before visiting a node. 
     *
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being queries
     * @param {number} depth - construction depth
     * @param {BTNode} child - the child to check whether to be visited
     */
    visitCheckCondition(state, node, depth, distance, radius) {
        // --- heap --- // 
        const heap = state.heap 

        // --- query count --- // 
        const k = state.inputs.k

        // --- visit automatically if heap can accomodate more elements --- //
        if(heap.size() < k) return true 

        // --- max. distance in heap --- //
        const heapTop = heap.peek().distance 

        return distance - radius < heapTop
    }

    /** 
     * Handles leaf nodes. 
     * 
     * @param {Object} state - state object for the query
     * @param {BTNode} node - current node being querie s
     * @param {number} depth - construction depth
     */
    handleLeafNode(state, node, depth) {
        // --- extract info about query --- // 
        const { target, k, mode } = state.inputs
        const { heap } = state 
    
        // --- loop through points and register them --- // 
        const points = node.getPoints()
        for(let i = 0; i < points.length; i++) {
            // --- current point to register --- //
            const point = points[i]

            // --- compute distance --- //
            const distance = this.measure(target, point) 

            // --- add to heap if can accomodate --- // 
            if(heap.size() < k) {
                heap.push({ id: point.index, distance: distance })
            }
            // --- if heap cannot accomodate push and pop top most item --- // 
            else {
                const heapTop = heap.peek().distance
                if(distance < heapTop) {
                    heap.push({ id: point.index, distance: distance })
                    heap.pop()
                }
            }
        }
    }

    /** 
     * TREE TRAVERSAL 
     */
    traverse(traverseFn = () => {}) {
        this.traverseNode(this.rootNodeId, traverseFn, 0)
    }   

    traverseNode(nodeId, traverseFn, depth) {
        const node = this.nodes[nodeId] 
        
        traverseFn(node, depth)
        
        if(this.isLeaf(node)) {
            return
        }

        const children = node.children 
        for(let childId of children) {
            this.traverseNode(childId, traverseFn, depth + 1)
        }
    }   

    /** 
     * UTILITY METHODS
     */

    /** 
     * Check if a node is a leaf.
     * @param {Point} node - the node to check
     */

    isLeaf(node) {
        return this.leafClasses.has(node.constructor)
    } 

    /**
     * Returns the root node of the tree.
     * @returns {BTNode} - the root node of the tree
     */
    getRootNode() {
        return this.nodes[this.rootNodeId]
    }

    /** 
     * Comparator based on mode.
     */
    comparator(mode, a, b) {
        if(mode == "nearest") {
            return a < b 
        } 
        else if(mode == "farthest") {
            return b > a
        }
        else {
            throw new Error(`Unknown mode '${mode}'.`)
        }
    }
}

/**
 * Reference to a point.
 */
export class PointRef 
{
    constructor(pointId) {
        this.pointId = pointId 
    }

    serialize() {
        return this.pointId 
    }

    static deserialize(pointId) {
        new PointRef(parseInt(pointId))
    }
}


/**
 * Generic Ball Tree Node
 */
export class BTNode 
{
    getCentroidId() {
        return this.centroidId
    }

    getCentroid() {
        return this.tree.centroids.get(this.getCentroidId())
    }

    getRadius() {
        return this.radius
    }
}

/**
 * Internal Node for Ball Tree
 */
export class BTInternalNode extends BTNode
{
    constructor({ tree, centroidId, radius, children } = {}) {
        super() 
        this.tree = tree
        this.centroidId = centroidId
        this.radius = radius
        this.children = children 
    }

    getCentroidId() {
        return this.centroidId
    }

    getRadius() {
        return this.radius 
    }

    getChildren() {
        return this.children
    }
}

/** 
 * Leaf Nodes for Ball Tree 
 */

export class BTLeafSingle extends BTNode
{
    constructor({ tree, pointId } = {}) {
        super()
        this.tree = tree
        this.pointId = pointId
    }

    getCentroidId() {
        return this.pointId
    }

    getRadius() {
        return 0
    }

    getCentroid() {
        return this.tree.points.get(this.getCentroidId())
    }

    getPoints() {
        return [this.getCentroid()]
    }
}

export class BTLeafMultiple extends BTNode
{
    constructor({ tree, centroidId, radius, points } = {}) {
        super() 
        this.tree = tree 
        this.centroidId = centroidId
        this.radius = radius 
        this.points = points
    }

    getPoints() {
        return this.points.map(pointId => this.tree.points[pointId])
    }
}
