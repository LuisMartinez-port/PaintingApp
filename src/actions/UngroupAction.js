import Action from "./Action.js";
import TransformAction from "./TransformAction.js";


class UngroupAction extends Action {

    constructor(groups, layer) {
        super();
        this.groups = groups;
        this.layer = layer;
        this.records = []; 
    }

    execute() {
        this.records = this.groups.map((group) => ({
            group,
            index: this.layer.getChildIndex(group),
            children: [...group.children],
            childTransforms: group.children.map(TransformAction.capture),
        }));

        
        const frontToBack = [...this.records].sort((a, b) => b.index - a.index);

        for (const { group, index, children } of frontToBack) {
            const g = TransformAction.capture(group);
            group.removeFromParent();

            children.forEach((child, i) => {
                const c = TransformAction.capture(child);

                TransformAction.apply(child, {
                    x: g.x + g.scaleX * c.x,
                    y: g.y + g.scaleY * c.y,
                    scaleX: g.scaleX * c.scaleX,
                    scaleY: g.scaleY * c.scaleY,
                });

              
                this.layer.addChildAt(child, index + i);
            });
        }
    }

    undo() {
        const backToFront = [...this.records].sort((a, b) => a.index - b.index);

        for (const { group, index, children, childTransforms } of backToFront) {
            children.forEach((child, i) => {
                TransformAction.apply(child, childTransforms[i]);
                group.addChild(child);
            });

            this.layer.addChildAt(group, index);
        }
    }

    discard() {
    }
}

export default UngroupAction;