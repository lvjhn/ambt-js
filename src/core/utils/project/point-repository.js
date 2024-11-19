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

export class PointRepository 
{
    /**
     * @param {*} options - options object 
     * @param {Point[]} - array of points to store
     */
    constructor({
        points       = [],
        saveLocation = `./temp/points/${currentTime()}`,
        dimensions   = 3
    } = {}) {     
        // --- save location of the repository --- // 
        this.saveLocation = saveLocation 
        
        // --- number of dimensions --- //
        this.dimensions = dimensions
        
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
        return this.dimensions
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
     */
    async save({
        onFileCreated = (outStream) => {},
        onSavePoint = (point, index) => {}, 
        onBeforeClose = (outStream) => {}
    } = {}) {
        // --- import file system (doesn't work in the browser) --- //
        const fs = (await import("fs")).default 

        // --- save location --- // 
        const saveLocation = this.saveLocation

        // --- check if directory exists --- // 
        const baseFolder_ = baseFolder(saveLocation) 
        await createDirectoryIfNotExists(baseFolder_)

        // --- remove previousy saved file if it exists --- //
        if(fs.existsSync(saveLocation)) {
            fs.unlinkSync(saveLocation)
        }

        // --- create write stream for points --- // 
        const outStream = 
            fs.createWriteStream(saveLocation, { encoding: "binary" })

        // --- iterate over each point and write each to the output stream --- // 
        const points = this.points
        for(let i = 0; i < points.length; i++) {
            const point = points[i]
            const pointValue = point.dims() 
            onSavePoint(point, i) 
            outStream.write(arrayToBytes_float32(pointValue))
        }   

        onBeforeClose(outStream)

        // --- close the write stream --- //
        outStream.close() 
    }   
    
    /**
     * Loads the point repository in binary format.
     * (Does not work in browser, must manually save points).
     */
    async load({
        onFileOpened  = (inStream) => {},
        onLoadPoint = (point, index) => {}, 
        onBeforeClose = (inStream) => {}
    } = {}) {
        let self = this 
        this.points = []

        return new Promise(async (resolve, reject) =>  {

            // --- import file system (doesn't work in the browser) --- //
            const fs = (await import("fs")).default 

            // --- save location --- // 
            const saveLocation = this.saveLocation

            // --- load input file as input stream --- //
            const chunkSize = 4 * this.dimCount()
            const inStream = fs.createReadStream(saveLocation, {
                highWaterMark: chunkSize 
            })

            onFileOpened(inStream)

            // --- read the file --- //
            inStream.on('data', (chunk) => {
                const point = bytesToArray_float32(chunk)
                self.points.push(new Point(point))
                onLoadPoint(chunk)
            })

            inStream.on('eand', () => {
                inStream.close()
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
}