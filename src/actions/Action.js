// Parent class for every change to the drawing that can be undone.

class Action {

   
    execute() {
        throw new Error(`${this.constructor.name} must implement execute()`);
    }

    
    undo() {
        throw new Error(`${this.constructor.name} must implement undo()`);
    }

    
    discard() {
    }
}

export default Action;