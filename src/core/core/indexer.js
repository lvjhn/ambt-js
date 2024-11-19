/** 
 * Indexer Class 
 * --------------------------------------------------------------------------------------
 * Defines base class for indexers.
 */
import { PointRepository } from "../utils/project/point-repository.js"
import { indent } from "../utils/common/helpers.js"
import { Logger } from "../utils/common/logger.js"

export class Indexer 
{
    static NEAREST  = 0 
    static FARTHEST = 1

    /**
     * @param {Object} options - options object 
     */
    constructor(options = {}) {
        // --- logger object --- //
        this.logger = new Logger(this)
    }

    /**
     * TREE CONSTRUCTION METHODS
     */

    /**
     * Sets the points of the indexer.
     * @param {PointRepository} points 
     */
    setPoints(points) {
        if(!(points instanceof PointRepository)) {
            throw new Error("The arguments `points` must be a PointRepository object.")
        }        
        this.point = points
    }   

    /**
     * Builds the indexer.
     * @param {PointRepository} points 
     */
    build(points) {
        // --- set the points --- // 
        this.logger.verboseLog("Setting points.")
        this.setPoints(points)

        // --- construct indexer --- //
        this.logger.verboseLog("Constructing indexer.")
        this.construct()
    }

    /** 
     * Constructs the indexer, must be implemented by child clsas.
     */
    construct() {
        this.logger.log("construct() : Must be implemented by child object.")
    }

    /** 
     * TREE QUERIES
     */

    /**
     * Queries the indexer for a given vector with target k.
     * @param {Point[]} target - the point to query
     * @param {number} k - number of element to return 
     * @param {mode} mode - whether Indexer.NEAREST or Indexer.FARTHEST
     */
    query(target, k, mode = Indexer.NEAREST) {
        this.logger.log("construct() : Must be implemented by child object.")
    }

}