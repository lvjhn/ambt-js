/**
 * BruteForceNNS 
 * ---
 * Brute force method for nearest neighbor searches.
 */
import { Indexer } from "../../indexer.js";

export class BruteForceNNS extends Indexer
{
    constructor(options) {
        // --- initialize parent class --- //
        super(options)
    }
    
    /**
     * TREE CONSTRUCTION
     */
    construct() {
        this.logger.log("Hello!")
    }
}