/** 
 * Benchmarker Class 
 * -------------------------------------------------------------------------------------
 * Simple benchmarking utility class.
 */

export class Benchmarker 
{
    constructor() {
        this.benchmarks = {}
    }

    /**
     * Marks the start of a section with name.
     * @param {string} name - the name of the section to create 
     */
    start(name) {
        this.benchmarks[name] = {}
        this.benchmarks[name].start = process.hrtime.bigint()  
    }

    /** 
     * Marks the end of a section with name. 
     * @param {string} name - the name of the section to mark as ended
     */
    end(name) {
        this.benchmarks[name].end = process.hrtime.bigint()
        
        const start = this.benchmarks[name].start
        const end = this.benchmarks[name].end 

        this.benchmarks[name].duration = end - start 
    }

    /** 
     * Gets the duration of a given benchmark name. 
     * @param {string} name - the name of the benchmark section to get the duration of
     */
    duration(name) {
        return parseInt(this.benchmarks[name].duration) / 1e+9
    }
}