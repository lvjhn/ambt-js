/** 
 * K-Means Clustering 
 * --------------------------------------------------------------------------------------
 * Implements a simple k-means clustering algorithm.
 */
import { Point } from "./point.js"
import { PointRepository } from "./point-repository.js"
import { indent } from "../common/helpers.js"
import { fillMatrix } from "../common/helpers.js"
import { arrayAdd } from "../common/helpers.js"

export class KMeans 
{   
    /**
     * @param {*} options - options object 
     * @param {number} centroidCount - no. of centroids to assign 
     * @param {boolean} options.verbose - whether to display log messages 
     * @param {indent} options.indentation - indentation level of log messages
     * @param {PointRepository} options.points - points to consider in the k-means
     */
    constructor({
        centroidCount = 2, 
        points = [],
        verbose = true, 
        indentation = 1
    } = {}) {
        // --- no. of centroids to assign --- // 
        this.centroidCount = centroidCount 

        // --- whether to display log messages --- // 
        this.verbose = verbose 

        // --- indentation level --- // 
        this.indent = indentation

        // --- active centroids --- //
        this.centroids = null

        // --- points that the k-means object was trained on --- // 
        this.setPoints(points) 

        // --- cluster assignments of each point --- //
        this.clusterAssignments = []
    } 

    /**
     * Set the point repository used in this class. 
     * @param {PointRepository} points -
     */
    setPoints(points) {
        if(!(points instanceof PointRepository)) {
            throw new Error("Must be a PointRepoistory object.")
        }
        this.points = points 
    }

    /** 
     * Checks if has been fitted with at least one iteration.
     */
    hasInitialized() {
        return this.centroidCount.length >= 0 
    }

    /** 
     * Checks the centroid count.
     */
    checkCentroidCount() {
        if(this.centroidCount < 0) {
            throw new Error("Centroid count must be greater than 0.")
        }
    }

    /** 
     * Check no. of points 
     */
    checkPointCount() {
        if(this.points.size() < 0) {
            throw new Error("No. of points must be greater than centroids.")
        }
    }

    /** 
     * Check requirements. 
     **/
    checkRequirements() {
        this.checkCentroidCount()
        this.checkPointCount()
    }

    /** 
     * Fits the k-mean algorithm on n-poins with n iterations.
     * @param {number} iterCount - no. of iterations to perform/fit
     */
    fit(iterCount) {
        for(let i = 0; i < iterCount; i++) {
            if(this.verbose) {
                console.log(`${indent(this.indent)}Fitting ${i + 1} of ${iterCount}.`)
            }
            this.fitOne()
        }
    }

    /**
     * Initializes the centroids.
     */
    initializeCentroids(force) {
        if(this.centroids && this.centroids.length >= 0 && !force) {
            return
        }
        this.centroids = Point.randomSet({ count: this.centroidCount })
    }

    /** 
     * Fits one iteration of the k-means algorithm. 
     */
    fitOne() {
        // --- initialize centroids if needed -- //
        this.initializeCentroids() 

        // --- initial checks --- //
        this.checkRequirements() 

        // --- step a: find distances to current centroids --- //
        this.assignClusters() 

        // --- step b: update centroids --- //
        this.updateCentroids()

        // --- step a : reassign clusters --- //
        this.assignClusters()
    }

    /**
     * Step 1 of the algorithm which is to assign clusters to points
     * based on their ditances to current centroids.
     */
    assignClusters() {
        // --- the current centroids --- //
        const centroids = this.centroids

        // --- assign points to centroids --- // 
        const assignments = []
        const distances   = []
        
        // --- current points --- //
        const points = this.points 

        // --- loop through points and assign clusters --- //
        for(let i = 0; i < points.size(); i++) {
            const point = points.get(i)
            const nearest = point.nearestFrom(centroids) 
            assignments[i] = nearest.index 
            distances[i] = nearest.distance
        }

        // --- update records--- // 
        this.assignments = assignments 
        this.distances = distances
    }

    /**
     * Step 2 of the algorithm which is to update the centoids
     * based on current assignments. 
     */
    updateCentroids() {
        // --- no of centroids --- //
        const centroidCount = this.centroidCount

        
        // --- current points --- //
        const points = this.points 

        // --- no. of dimensions --- //
        const dimCount = points.dimCount()

        // --- create empty centroids --- //
        const centroids = fillMatrix(centroidCount, dimCount, 0) 

        // --- cluster assignments --- //
        const assignments = this.assignments 

        // --- cluster sizes --- //
        const clusterSizes = Array(this.centroidCount).fill(0)

        // --- loop through points and add values to centoids --- // 
        for(let i = 0; i < points.size(); i++) {
            const point = points.get(i)
            const clusterIndex = assignments[i]
            const clusterCentroid = centroids[clusterIndex]
            const updatedCentroid = arrayAdd(clusterCentroid, point.dims())
            centroids[clusterIndex] = updatedCentroid
            clusterSizes[clusterIndex] += 1
        }

        // --- get the average of each centroid based on cluster size --- //
        for(let i = 0; i < centroidCount; i++) {
            const centroid = centroids[i] 
            for(let j = 0; j < dimCount; j++) {
                centroid[j] /= clusterSizes[i]
            }
        }

        // --- update current centroids --- //
        this.centroids = centroids
    }   

    /** 
     * Extracts and points to clusters as a 2D array.
     */
    extractClusters() {
        // --- create empty clusters --- // 
        const clusters = new Array(this.centroidCount).fill([]) 

        // --- localize points --- //
        const points = this.points

        // --- localize cluster assignments --- /
        const clusterAssignments = this.assignments

        // ---
        // loop through each point and 
        // find out which cluster they belong to
        // ---
        
        for(let i = 0; i < points.size(); i++) {
            const clusterIndex = clusterAssignments[i] 
            const point = points.get(i)
            clusters[clusterIndex].push(point)
        }

        return clusters
    }
}

