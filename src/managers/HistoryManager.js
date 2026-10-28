import { Event } from "../Event.js";

// Keeps track of every action so the user can undo and redo them.

class HistoryManager {

    static undoStack = [];
    static redoStack = [];

    
    static ChangedEvent = new Event();

   
    static perform(action) {
        action.execute();
        this.undoStack.push(action);

       
        for (const undone of this.redoStack) {
            undone.discard();
        }
        this.redoStack = [];

        this.ChangedEvent.invoke();
    }

    static undo() {
        const action = this.undoStack.pop();
        if (!action) {
            return;
        }

        action.undo();
        this.redoStack.push(action);
        this.ChangedEvent.invoke();
    }

    static redo() {
        const action = this.redoStack.pop();
        if (!action) {
            return;
        }

        action.execute();
        this.undoStack.push(action);
        this.ChangedEvent.invoke();
    }

    static canUndo() {
        return this.undoStack.length > 0;
    }

    static canRedo() {
        return this.redoStack.length > 0;
    }
}

export default HistoryManager;