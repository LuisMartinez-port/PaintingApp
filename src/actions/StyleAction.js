import Action from "./Action.js";


class StyleAction extends Action {

    constructor(objects, changes) {
        super();
        this.shapes = objects.flatMap(StyleAction.shapesIn);
        this.before = this.shapes.map((shape) => shape.shapeStyle);
        this.after = this.before.map((style) => ({ ...style, ...changes }));
    }

    execute() {
        this.shapes.forEach((shape, i) => StyleAction.restyle(shape, this.after[i]));
    }

    undo() {
        this.shapes.forEach((shape, i) => StyleAction.restyle(shape, this.before[i]));
    }

  
    static restyle(shape, style) {
        shape.recipe.render(shape, style);
        shape.shapeStyle = style;
    }

    static shapesIn(object) {
        if (object.isGroup) {
            return object.children.flatMap(StyleAction.shapesIn);
        }
        return object.recipe ? [object] : [];
    }
}

export default StyleAction;