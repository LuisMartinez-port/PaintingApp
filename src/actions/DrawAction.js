import Action from "./Action.js";


class DrawAction extends Action {

    constructor(shape, layer) {
        super();
        this.shape = shape; 
        this.layer = layer;  
    }

    execute() {
        this.layer.addChild(this.shape);
    }

    undo() {
        this.shape.removeFromParent();
    }

    discard() {
        this.shape.destroy();
    }
}

export default DrawAction;