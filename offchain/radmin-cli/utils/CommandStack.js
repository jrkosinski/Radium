/**
 * Stores past commands for retrieval using up/down arrow keys. 
 */
class CommandStack {
    queue = [];
    maxSize = 10;
    currentPosition = 0;

    /**
     * Set the max size of the queue (it will start overwriting itself after n 
     * elements)
     * @param {number} size max size of queue 
     */
    constructor(size) {
        if (size)
            this.maxSize = size;
    }

    /**
     * Push a new command onto the stack. 
     * @param {string} s command 
     */
    push(s) {
        const isDuplicate = ((this.queue.length > 0) && this.queue[this.queue.length - 1] == s);

        if (!isDuplicate) {
            this.queue.push(s);
            if (this.queue.length > this.maxSize)
                this.queue = this.queue.slice(1);
        }
        this.currentPosition = this.queue.length;
    }

    /**
     * Gets the text of the command at the current stack pointer. 
     * @returns string 
     */
    current() {
        if (this.currentPosition > this.queue.length - 1)
            this.currentPosition = this.queue.length - 1;
        return this.queue[this.currentPosition];
    }

    /**
     * Moves to the previous and returns the text of the command at that stack pointer.
     * @returns 
     */
    prev() {
        if (this.currentPosition > 0)
            this.currentPosition--;
        return this.current();
    }

    /**
     * Advances to the next and returns the text of the command at that stack pointer.
     * @returns 
     */
    next() {
        if (this.currentPosition < this.queue.length - 1)
            this.currentPosition++;
        return this.current();
    }
}

module.exports = CommandStack;