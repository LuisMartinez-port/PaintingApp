import Action from "./Action.js";


class TransformAction extends Action {

  
    constructor(shapes, before, after) {
        super();
        this.shapes = shapes;
        this.before = before;
        this.after = after;
    }

    execute() {
        this.shapes.forEach((shape, i) => TransformAction.apply(shape, this.after[i]));
    }

    undo() {
        this.shapes.forEach((shape, i) => TransformAction.apply(shape, this.before[i]));
    }


    static capture(shape) {
        return {
            x: shape.position.x,
            y: shape.position.y,
            scaleX: shape.scale.x,
            scaleY: shape.scale.y,
        };
    }


    static apply(shape, transform) {
        shape.position.set(transform.x, transform.y);
        shape.scale.set(transform.scaleX, transform.scaleY);
    }
}

export default TransformAction;