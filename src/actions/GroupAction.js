import { Container } from "pixi.js";
import Action from "./Action.js";


class GroupAction extends Action {

    constructor(shapes, layer) {
        super();
        this.shapes = shapes;
        this.layer = layer;

        this.group = new Container();
        this.group.isGroup = true; 

        this.removed = [];  
    }

    execute() {
       
        this.removed = this.shapes
            .map((shape) => ({ shape, index: this.layer.getChildIndex(shape) }))
            .sort((a, b) => a.index - b.index);

       
        const frontIndex = this.removed[this.removed.length - 1].index;
        const groupIndex = frontIndex - (this.removed.length - 1);

      
        for (const { shape } of this.removed) {
            this.group.addChild(shape);
        }

        this.layer.addChildAt(this.group, groupIndex);
    }

    undo() {
        this.group.removeFromParent();

     
        for (const { shape, index } of this.removed) {
            this.layer.addChildAt(shape, index);
        }
    }

  
    discard() {
        if (this.group.children.length === 0) {
            this.group.destroy();
        }
    }
}

export default GroupAction;