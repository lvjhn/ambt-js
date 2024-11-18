/**
 * Clock
 * --------------------------------------------------------------------------------------
 * Clock helpers for commonly used clock functions. 
 */

/**
 * Returns the current time as integer.
 */
export function currentTime() {
    return (new Date()).getTime()
}