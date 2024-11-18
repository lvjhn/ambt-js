/** 
 * Customizable Heap Implementation
 * ---------------------------------------------------------------------------------------
 * Implements a customizable heap that can be configured with a custom comparator. 
 */

export class Heap {
    /**
     * @param {*} options - options object  
     * @param {*} options.compareFn - compare function
     */
    constructor({
        compareFn = (a, b) => a - b
    } = {}) {
        // --- custom compare function --- // 
        this.compareFn = compareFn 

        // --- contains the actual data of the heap --- // 
        this.data = []
    }

    /** 
     * Returns a string representation of the heap. 
     * @returns {string}
     */
    toString() {
        return `Heap(size=${this.size()})`
    }
    
    /**
     * Returns the size of the heap.
     * @returns {number}
     */
    size() {
        return this.data.length
    }

    /**
     * Returns the index of a parent node in the heap given a child's index.
     * @param {number} index - the index of the node
     * @returns {number}
     */
    parentIndex(index) {
        return Math.floor((index - 1) / 2)
    }

    /**
     * Returns the index of the left child node given a parent's index.
     * @param {number} index - the index of the node 
     * @returns {number}
     */
    leftChildIndex(index) {
        return 2 * index + 1
    }

    /**
     * Returns the index of the right child node given a parent's index.
     * @param {number} index - the index of the node 
     * @returns {number}
     */
    rightChildIndex(index) {
        return 2 * index + 2
    }       

    /**
     * Swaps two elements in the heap given their indices.
     * @param {number} i - the first element to swap 
     * @param {number} j - the second element to swap
     */
    swap(i, j) {
        const temp = this.data[i] 
        this.data[i] = this.data[j] 
        this.data[j] = temp 
    }

    /**
     * Adds an element to the heap. 
     * @param {any} value 
     */
    push(value) {
        this.data.push(value)
        this.bubbleUp(this.size() - 1)
    }

    /**
     * Removes the current topmost element in the heap and returns it.
     * @returns {any} 
     */
    pop() {
        if(this.size() == 0) {
            return null 
        }
        this.swap(0, this.size() - 1)
        const root = this.data.pop() 
        this.bubbleDown(0)
        return root
    }

    /**
     * Returns the topmost element in the heap (does not remove it). 
     * @returns {any | null}
     */
    peek() {
        if(this.size() > 0) {
            return this.data[0]
        } else {
            return null 
        }
    }

    /**
     * Adds all of the elements in the heap more efficiently.
     * @param {any[]} - the array to convert to heap
     */
    heapify(array) {
        this.data = [...array] 
        const start = this.parentIndex(this.size() - 1)
        for(let i = start; i >= 0; i--) {
            this.bubbleDown(i)
        }
    }

    /**
     * Bubble ups an element in the heap.
     * @param {number} - index of the element to bubble up
     */
    bubbleUp(index) {
        while(index > 0) {
            const parent = this.parentIndex(index)
            const a = this.data[index] 
            const b = this.data[parent]
            if(this.compareFn(a, b) >= 0) {
                break
            }
            this.swap(index, parent) 
            index = parent 
        }
    }

    /**
     * Bubbles down an element in the heap. 
     * @param {number} - the index of the element to bubble down
     */
    bubbleDown(index) {
        let lastIndex = this.size() - 1
        let smallest = null
        while(true) {
            const left = this.leftChildIndex(index) 
            const right = this.rightChildIndex(index)
            smallest = index 

            if(
                left <= lastIndex && 
                this.compareFn(this.data[left], this.data[smallest]) < 0
            ) {
                smallest = left 
            }

            if(
                right <= lastIndex && 
                this.compareFn(this.data[right], this.data[smallest]) < 0
            ) {
                smallest = right 
            }

            if(smallest != index) {
                this.swap(index, smallest)
                index = smallest
            } else {
                break
            }
        }
    }

    /**
     * Extracts the contents of the heap to an array and removes all elements
     * along the way.
     * @returns {any[]} - array of heap items
     */
    extract() {
        const array = [] 
        while(this.size() > 0) {
            array.push(this.pop())
        }
        return array
    }

    /**
     * Converts the heap to an array without removing its contents. 
     * @return {any[]} - array of heap items
     */
    toArray() {
        const copy = new Heap() 
        copy.data = [...this.data]
        copy.compareFn = this.compareFn
        const array = copy.extract()
        return array
    }
}