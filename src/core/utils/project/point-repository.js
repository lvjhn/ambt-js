/** 
 * Point Repository
 * --------------------------------------------------------------------------------------
 * Creates a savable/loadable repository of points and assign identifies to points.
 */
import { Point } from "./point.js";
import { currentTime } from "../common/clock.js";
import { 
    baseFolder, 
    createDirectoryIfNotExists,
    arrayToBytes_float32,
    bytesToArray_float32
 } from "../common/helpers.js";
import { normalize } from "./vectors.js";

export class PointRepository 
{
    /**
     * @param {Object} options - options object 
     * @param {Point[]} - array of points to store
     */
    constructor({
        points       = [],
        saveLocation = `./temp/points/${currentTime()}`,
        dims         = null
    } = {}) {     
        // --- save location of the repository --- // 
        this.saveLocation = saveLocation 

        // --- no. of dimensions --- // 
        this.dims   = dims
        
        // --- array of points to store --- // 
        this.setPoints(points)
    }

    /**
     * Loads the repository it exists.
     */
    async loadIfExists() {
        // --- import file system (doesn't work in the browser) --- //    
        const fs = (await import("fs")).default 

        // --- whether to load the file automatically if it exists --- // 
        if(fs.existsSync(fs.saveLocation)) {
            await this.load()
        }
    }

    /** 
     * Sets the active points in the repository.
     * @param {Point[]} points - the points to set
     */
    setPoints(points) {
        this.points = points 
        Point.setIndices(points)
    }

    /**
     * Gets the number of dimensions of points in the repository.
     */
    dimCount() {
        return this.dims
    }

    /** 
     * Returns the point at a given index.
     * @param {number} index - the index of the point to return 
     * @returns {Point} - the points with the given index
     */
    get(index) {
        return this.points[index]
    }

    /** 
     * Size of the point repository. 
     */
    size() {
        return this.points.length
    }

    /**
     * Saves the point repository in binary format.
     * (Does not work in browser, must manually save points).
     * 
     * @param {Object} options - options object 
     * @param {Function} options.onFileCreated 
     *  called when the savefile has been created 
     * @param {Function} options.onSavePoint 
     *  called when a point has been appended to the savefile
     * @param {Function} options.onBeforeClose 
     *  called before closing the savefile
     */
    async save({ onSavePoint = (chunk, point, index) => {} } = {}) {
        const self = this 

        return new Promise(async (resolve, reject) => { 
            // --- import file system (doesn't work in the browser) --- //
            const fs = (await import("fs")).default 

            // --- save location --- // 
            const saveLocation = self.saveLocation

            // --- check if directory exists --- // 
            const baseFolder_ = baseFolder(saveLocation) 
            await createDirectoryIfNotExists(baseFolder_)

            // --- remove previousy saved file if it exists --- //
            if(fs.existsSync(saveLocation)) {
                fs.unlinkSync(saveLocation)
            }

            // --- iterate over each point and write each to the output stream --- // 
            const points = this.points
            for(let i = 0; i < points.length; i++) {
                const point = points[i]
                const pointValue = point.dims() 
                const chunk = arrayToBytes_float32(pointValue)
                onSavePoint(chunk, point, i)
                fs.appendFileSync(saveLocation, chunk)
            }   

            resolve(true)
        })
    }   
    
    /**
     * Loads the point repository in binary format.
     * (Does not work in browser, must manually save points).
     * 
     * @param {Object} options - options object 
     * @param {Function} options.onFileOpened 
     *  called when the savefile has been opened 
     * @param {Function} options.onLoadPoint 
     *  called when a point has been loaded 
     * @param {Function} options.onBeforeClose 
     *  called before closing the savefile
     */
    async load({
        onFileOpened = (inStream) => {},
        onLoadPoint = (chunk, point, index) => {}, 
        onBeforeClose = (inStream) => {}
    } = {}) {
        let self = this 

        return new Promise(async (resolve, reject) =>  {
            this.points = []

            // --- import file system (doesn't work in the browser) --- //
            const fs = (await import("fs")).default 

            // --- save location --- // 
            const saveLocation = self.saveLocation

            // --- load input file as input stream --- //
            const chunkSize = 4 * self.dimCount()

            // --- running index --- // 
            let i = 0 

            // --- create input stream --- //
            const inStream = fs.createReadStream(saveLocation, {
                highWaterMark: chunkSize
            })

            // --- run callback function after opening file --- //
            onFileOpened(inStream)

            // --- read the file --- //
            inStream.on('data', (chunk) => {
                const point = bytesToArray_float32(chunk)
                self.points.push(new Point(point))
                onLoadPoint(chunk, point, i)
                i += 1
            })
            
            // --- close the file when stream has ended --- //
            inStream.on('end', () => {
                onBeforeClose(inStream)
                inStream.close()
                resolve(true)
            })

            // --- close the file when stream has ended --- //
            inStream.on('error', (e) => {
                throw e
            })
        })
    }

    /**s 
     * Error on length to avoid confusion with size()
     */
    get length() {
        throw new Error(
            "Length is not defined on PointRepository object, use size() instead."
        )
    }

    /** 
     * Normalizes each of the point in the point set.
     */
    normalize() {
        const points = this.points
        for(let i = 0; i < points.length; i++) {
            const point = points[i] 
            points[i].value = normalize(point).value
        }    
    }

    /** 
     * Gets all points in the repository.
     */
    all() {
        return this.points
    }
}