import { Graphics } from "pixi.js";
import Utils from "./Utils.js";
import HistoryManager from "./HistoryManager.js";

// Remembers which shapes are selected and draws a blue box around each one.
class SelectionManager {

    static HIGHLIGHT = { color: 0x0099ff, width: 2 };
    static PADDING = 4;  

    static selected = [];
    static layer = null;     
    static highlight = null; 

    static initialize(layer, overlay) {
        this.layer = layer;

        this.highlight = new Graphics();
        overlay.addChild(this.highlight);

        HistoryManager.ChangedEvent.addListener(() => this.refresh());
    }

    static getSelected() {
        return [...this.selected];
    }

     static selectInRect(rect, additive = false) {
        const area = toCenterRect(rect);

        const found = this.layer.children.filter((shape) =>
            Utils.checkAABB(toCenterRect(shape.getBounds()), area)
        );

        if (!additive) {
            this.selected = [];
        }
        for (const shape of found) {
            if (!Utils.existsInArray(this.selected, shape)) {
                this.selected.push(shape);
            }
        }
        this.refresh();
    }

    static selectAt(point, additive = false) {
        const shape = this.shapeAt(point);

        if (!additive) {
            this.selected = shape ? [shape] : [];
        } else if (shape) {
            if (Utils.existsInArray(this.selected, shape)) {
                Utils.removeFromArray(this.selected, shape);
            } else {
                this.selected.push(shape);
            }
        }
        this.refresh();
    }

    
    static shapeAt(point) {
        const shapes = this.layer.children;

        for (let i = shapes.length - 1; i >= 0; i--) {
            if (containsPoint(shapes[i].getBounds(), point)) {
                return shapes[i];
            }
        }
        return null;
    }

    static clear() {
        this.selected = [];
        this.refresh();
    }

    static refresh() {
        this.selected = this.selected.filter((shape) => shape.parent === this.layer);

        const pad = this.PADDING;
        this.highlight.clear();

        for (const shape of this.selected) {
            const box = shape.getBounds();

            this.highlight
                .rect(box.x - pad, box.y - pad, box.width + pad * 2, box.height + pad * 2)
                .stroke(this.HIGHLIGHT);
        }
    }
}


function toCenterRect({ x, y, width, height }) {
    return {
        x: x + width / 2,
        y: y + height / 2,
        width,
        height,
    };
}

function containsPoint(box, point) {
    return point.x >= box.x && point.x <= box.x + box.width &&
           point.y >= box.y && point.y <= box.y + box.height;
}

export default SelectionManager;