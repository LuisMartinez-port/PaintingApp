import { Graphics } from "pixi.js";
import HistoryManager from "../managers/HistoryManager.js";
import DrawAction from "../actions/DrawAction.js";

class Draw {

    static MinimumSize = 2;

    static FILL = { color: 0xff8800, alpha: 0.1  };
    static STROKE = { color: 0x000000, width: 2 };

    filled = true;

    start = null;
    
    end = null;
        
    graphics = null;

    constructor(layer) {
        this.layer = layer;
    }


    get isDrawing() {
        return this.graphics !== null;
    }

    onPointerDown(position) {
        this.start = {x: position.x, y: position.y};
        this.end = {x: position.x, y: position.y};

        this.graphics = new Graphics();
        this.layer.addChild(this.graphics);
        this.redraw();

    }

    onPointerMove(position) {
        if (!this.isDrawing) {
            return;
        }
 
        this.end = { x: position.x, y: position.y };
        this.redraw();
        
    }

    onPointerUp(position){
        if (!this.isDrawing) {
            return;
        }

        this.end = {x: position.x, y: position.y};
        this.redraw();

        if (this.distance() < Draw.MinimumSize) {
            this.cancel();
            return;
        }

        const shape = this.graphics;
        shape.removeFromParent();
        this.reset();

        HistoryManager.perform(new DrawAction(shape, this.layer));
    }


    cancel() {
        if (this.graphics) {
            this.graphics.removeFromParent();
            this.graphics.destroy();
        }
        this.reset();

    }

    reset() {
        this.start=null;
        this.end=null;
        this.graphics=null;


    }

    redraw() {
        this.graphics.clear();
        this.draw(this.graphics, this.start, this.end);
 
        if (this.filled) {
            this.graphics.fill(Draw.FILL);
        }
        this.graphics.stroke(Draw.STROKE);
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

     draw(graphics, start, end) {
        throw new Error(`${this.constructor.name} must implement draw()`);
    }

}

export default Draw;