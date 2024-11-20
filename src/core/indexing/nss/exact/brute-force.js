/**
 * BruteForceNNS 
 * ---
 * Brute force method for nearest neighbor searches.
 */
import { Indexer } from "../../indexer.js";
import { Benchmarker } from "../../../utils/common/benchmark.js";

export class BruteForceNNS extends Indexer
{
    constructor(options) {
        // --- initialize parent class --- //
        super(options)
    }
    
    /* --- TREE CONSTRUCTION --- */
    

    construct() {
        return
    }

    /* --- TREE QUERIES --- */

    query(target, k, mode = Indexer.NEAREST) {
        // --- create response object --- // 
        const response = {}

        // --- create state object --- // 
        const state = {}
        state.response = response
        state.benchmarks = {}

        // --- localize points --- // 
        const points = this.points 

        // --- record parameters to state --- // 
        state.inputs = {}
        state.inputs.target = target 
        state.inputs.k = k 
        state.inputs.mode = mode

        // --- create benchmarker object --- // 
        state.benchmark = new Benchmarker() 

        // --- query distances --- // 
        state.benchmark.start("compute-distances")
        const distances = this.computeDistances(state)
        state.benchmark.end("compute-distances")
        state.benchmarks["compute-distances"] = 
            state.benchmark.duration("compute-distances") 

        // --- sort distances --- // 
        state.benchmark.start("sort-distances") 
        state.benchmark.end("sort-distances")
        this.sortDistances(state, distances)
        state.benchmark.duration('sort-distances')
        state.benchmarks["sort-distances"] = 
            state.benchmark.duration("sort-distances")

        // --- slice distances --- // 
        const nearest = distances.slice(0, k)
        state.results = nearest.map((result) => {
            return { index: result.point.index, distance: result.distance }
        })

        return state
    }

    /**
     * Computes the distances between the target point and other points.
     * @param {Object} state - state object for the query 
     * @returns 
     */
    computeDistances(state) {
        // --- extract state --- // 
        const target = state.inputs.target 

        // --- localize points --- //
        const points = this.points

        // --- container for distances --- // 
        const distances = []

        // --- compute distance of each point to target --- //
        for(let i = 0; i < points.size(); i++) {
            const otherPoint = points.get(i)
            const distance = this.measure(target, otherPoint)
            distances.push({ point: otherPoint, distance })
        }

        return distances
    }   

    /**
     * Sorts the distances between the poind and other points 
     * @param {Object} state - state object for the query
     * @param {number[]} distances - distances between the target and other points  
     */
    sortDistances(state, distances) {
        // --- query mode --- //
        const mode = state.mode

        // --- sort points based on mode --- //
        if(mode == Indexer.NEAREST)
            distances.sort((a, b) => a.distance - b.distance)
        else if(mode == Indexer.FARTHEST) 
            distances.sort((a, b) => b.distance - a.distance)
        else 
            throw new Error("Unknown mode.")
    }
}