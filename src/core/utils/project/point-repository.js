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
    bytesToArray_float32,
    fileName,
    replaceExtension
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
        dims         = null,
        DataClass    = null 
    } = {}) {     
        // --- no. of dimensions --- // 
        this.dims   = dims

        // --- data class --- // 
        this.DataClass = DataClass
        
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
     * @param {string} saveLocation - where to save 
     * 
     */
    async save(saveLocation) {
        const self = this 

        return new Promise(async (resolve, reject) => { 
            // --- save point values --- //
            await this.savePointValues(saveLocation) 

            // --- save point data --- //
            if(self.DataClass != null) {
                await this.savePointData(saveLocation) 
            }

            resolve(true)
        })
    }   

    /** 
     * Saves point values.
     * 
     * @param {string} saveLocation - where to save 
     */
    async savePointValues(saveLocation) {
        const self = this 

        return new Promise(async (resolve, reject) => {
            // --- import file system (doesn't work in the browser) --- //
            const fs = (await import("fs")).default 

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
                fs.appendFileSync(saveLocation, chunk)
            }   

            resolve(true)
        })
    }

    /** 
     * Gets location of data file. 
     */
    dataFileLocation(saveLocation) {
        const baseFolder_       = baseFolder(saveLocation)
        const fileName_         = replaceExtension(
            fileName(saveLocation), 
            ".data.json", 
            1
        )
        const dataFileLocation = baseFolder_ + "/" + fileName_ 
        return dataFileLocation
    }

    /** 
     * Saves point data. 
     * 
     * @param {string} saveLocation - where to save 
     */
    async savePointData (saveLocation) {
        const self = this 

        return new Promise(async (resolve, reject) => {
            const fs = (await import("fs")).default

            // --- JSON container for point data --- // 
            const json = []

            // --- points --- // 
            const points = self.points

            // --- loop through points and add point data to json array --- // 
            for(let i = 0; i < points.length; i++) {
                // --- current point --- //
                const point = points[i] 

                // --- stringified data --- /
                const serialized = point.data.serialize() 

                // --- append to json data --- // 
                json.push(serialized)
            }

            // --- save json file --- //
            const jsonStr = JSON.stringify(json) 

            // --- get location of data file --- // 
            const dataFileLocation = this.dataFileLocation(saveLocation)
            
            // --- save data file --- // 
            fs.writeFileSync(dataFileLocation, jsonStr)

            resolve(true)
        })  
    }
    
    /**
     * Loads the point repository in binary format.
     * (Does not work in browser, must manually save points).
     * 
     * @param {string} saveLocation - where to load
     */
    async load(saveLocation) {
        const self = this 

        return new Promise(async (resolve, reject) =>  {
            // --- load point values -- // 
            await this.loadPointValues(saveLocation) 
            
            // --- load point data --- //
            if(self.DataClass != null) {
                await this.loadPointData(saveLocation) 
            }

            resolve(true)
        })
    }

    /**
     * Loads point values. 
     * 
     * @param {string} saveLocation - where to load
     */
    async loadPointValues(saveLocation) {
        const self = this 

        return new Promise(async (resolve, reject) => {
            this.points = []

            // --- import file system (doesn't work in the browser) --- //
            const fs = (await import("fs")).default 

            // --- load input file as input stream --- //
            const chunkSize = 4 * self.dimCount()

            // --- running index --- // 
            let i = 0 

            // --- create input stream --- //
            const inStream = fs.createReadStream(saveLocation, {
                highWaterMark: chunkSize
            })

            // --- read the file --- //
            inStream.on('data', (chunk) => {
                const point = bytesToArray_float32(chunk)
                self.points.push(new Point(point))
            })
            
            // --- close the file when stream has ended --- //
            inStream.on('end', () => {
                inStream.close()
                resolve(true)
            })

            // --- close the file when stream has ended --- //
            inStream.on('error', (e) => {
                throw e
            })
        })
    }

    /**
     * Loads point data.
     * 
     * @param {string} saveLocation - where to load
     */
    async loadPointData(saveLocation) {
        const self = this 
        
        return new Promise(async (resolve, reject) => {
            // --- import file system --- // 
            const fs = (await import("fs")).default

            // --- data file location --- // 
            const dataFileLocation = self.dataFileLocation(saveLocation)
            
            // --- load data file --- // 
            const data = JSON.parse(fs.readFileSync(dataFileLocation))

            // -- points in the repository --- //
            const points = self.points

            // --- loop through each point and assign data --- //
            for(let i = 0; i < data.length; i++) {
                // --- extract and deserialize record --- // 
                const record = self.DataClass.deserialize(data[i]) 

                // --- attach data to point --- // 
                points[i].data = record
            }
 
            resolve(true)
        })
    }

    /**
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

    /** 
     * Adds a point to the repository. 
     * 
     * @param {Point} point - point to add
     */
    add(point) {
        this.points.push(point)
    }
}