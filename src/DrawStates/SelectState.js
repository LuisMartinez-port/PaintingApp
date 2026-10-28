import { Graphics } from "pixi.js";
import SelectionManager from "../managers/SelectionManager.js";

// The Select tool.
class SelectState {

    
    static ClickDistance = 3;

    static BOX_FILL = { color: 0x0099ff, alpha: 0.1 };
    static BOX_STROKE = { color: 0x0099ff, width: 1 };

    start = null;
    end = null;
    box = null;  
    additive = false;
    constructor(overlay) {
        this.overlay = overlay;
    }

        onPointerDown(position, event) {
        this.additive = event?.shiftKey ?? false;
        this.start = { x: position.x, y: position.y };

        this.box = new Graphics();
        this.overlay.addChild(this.box);
        this.redraw();
    }

    onPointerMove(position) {
        if (!this.box) {
            return;
        }

        this.end = { x: position.x, y: position.y };
        this.redraw();
    }

    onPointerUp(position) {
        if (!this.box) {
            return;
        }

        this.end = { x: position.x, y: position.y };

        const isClick = this.distance() < SelectState.ClickDistance;
        const area = this.bounds();
        const point = this.end;
        const additive = this.additive;

        this.cancel();

        if (isClick) {
            SelectionManager.selectAt(point, additive);
        } else {
            SelectionManager.selectInRect(area, additive);
        }
    }

    cancel() {
        if (this.box) {
            this.box.removeFromParent();
            this.box.destroy();
        }
        this.start = null;
        this.end = null;
        this.box = null;
        this.additive = false;

    }

    redraw() {
        const { x, y, width, height } = this.bounds();

        this.box
            .clear()
            .rect(x, y, width, height)
            .fill(SelectState.BOX_FILL)
            .stroke(SelectState.BOX_STROKE);
    }

    distance() {
        return Math.hypot(this.end.x - this.start.x, this.end.y - this.start.y);
    }

    bounds() {
        return {
            x: Math.min(this.start.x, this.end.x),
            y: Math.min(this.start.y, this.end.y),
            width: Math.abs(this.end.x - this.start.x),
            height: Math.abs(this.end.y - this.start.y),
        };
    }
}

export default SelectState;