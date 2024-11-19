/** 
 * Logging Class
 * --------------------------------------------------------------------------------------
 * Logging object which can be embedded in any class. 
 */
import { indent } from "./helpers.js"

export class Logger 
{
    /**
     * @param {any} target - object to attach logger
     * @param {Object} options - options object
     * @param {boolean} verbose - whether to display verbose logs 
     * @param {indent} indent - indentation level for logs
     */
    constructor(target, options = {}) {
        this.target = target 
        this.verbose = options.verbose ?? true  
        this.indent = options.indent ?? 1
    }

    /**
     * Logs a given message with indentation.
     * @param  {...string[]} args 
     */
    log(...args) {
        console.log(`${indent(this.indent)}${args.join(" ")}`,)
    }

    /** 
     * Logs a given message only if verbose logging is on.
     * @param {...string} args 
     */
    verboseLog(...args) {
        if(this.verbose) {
            this.log(...args)
        }
    }
}

