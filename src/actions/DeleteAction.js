import Action from "./Action.js";


class DeleteAction extends Action {

    constructor(shapes) {
        super();
        this.shapes = shapes;
        this.removed = [];  
    }

    execute() {
    
        this.removed = this.shapes
            .map((shape) => ({
                shape,
                parent: shape.parent,
                index: shape.parent.getChildIndex(shape),
            }))
            .sort((a, b) => a.index - b.index);

        for (const { shape } of this.removed) {
            shape.removeFromParent();
        }
    }

    undo() {
      
        for (const { shape, parent, index } of this.removed) {
            parent.addChildAt(shape, index);
        }
    }
}

export default DeleteAction;