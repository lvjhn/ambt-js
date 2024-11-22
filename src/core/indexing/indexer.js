/** 
 * Indexer Class 
 * --------------------------------------------------------------------------------------
 * Defines base class for indexers.
 */
import { PointRepository } from "../utils/project/point-repository.js"
import { indent } from "../utils/common/helpers.js"
import { Logger } from "../utils/common/logger.js"
import { euclideanDistance } from "../utils/project/measures.js"

const NEAREST = 0 
const FARTHEST = 1

export class Indexer 
{
    /**
     * @param {Object} options - options object 
     * @param {Function} options.measure - measurement/metric function to use
     */
    constructor(options = {}) {
        // --- measurement/metric function to use --- /
        this.measure = options.measure ?? euclideanDistance

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
        this.points = points
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
        this.logger.indent += 1
        this.logger.log("construct() : Must be implemented by child object.")
        this.logger.indent -= 1
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
    query(target, k, mode = NEAREST) {
        this.logger.indent += 1
        this.logger.log("query() : Must be implemented by child object.")
        this.logger.indent -= 1
    }

}