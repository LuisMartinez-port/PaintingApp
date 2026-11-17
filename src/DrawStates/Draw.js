import { Graphics } from "pixi.js";
import HistoryManager from "../managers/HistoryManager.js";
import StyleManager from "../managers/StyleManager.js";
import DrawAction from "../actions/DrawAction.js";
import { dashes, dots, stripes } from "./Patterns.js";

class Draw {

    static MinimumSize = 2;

    static StripeSpacing = 8; 
    static StripeWidth = 2;   
    start = null;
    end = null;
    graphics = null;
    style = null; 

    constructor(layer) {
        this.layer = layer;
    }

    get isDrawing() {
        return this.graphics !== null;
    }

    onPointerDown(position) {
        this.start = {x: position.x, y: position.y};
        this.end = {x: position.x, y: position.y};

        this.style = StyleManager.current();

       
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

        shape.recipe = this.snapshot();
        shape.shapeStyle = this.style;

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
        this.start = null;
        this.end = null;
        this.graphics = null;
        this.style = null;
    }

  
    snapshot() {
        const copy = new this.constructor(this.layer);
        copy.start = { ...this.start };
        copy.end = { ...this.end };
        return copy;
    }

    redraw() {
        this.render(this.graphics, this.style);
    }

    render(graphics, style) {
        graphics.clear();

        const { points, closed } = this.outline();
        const corners = points.flatMap((p) => [p.x, p.y]);

        const fillType = closed ? style.fillType : "none";

        if (fillType === "solid") {
            graphics.poly(corners).fill({ color: style.fillColor, alpha: style.fillAlpha });
        } else if (fillType === "striped") {
            const lines = stripes(points, Draw.StripeSpacing);
            for (const [a, b] of lines) {
                graphics.moveTo(a.x, a.y).lineTo(b.x, b.y);
            }
            if (lines.length > 0) {
                graphics.stroke({ color: style.fillColor, alpha: style.fillAlpha, width: Draw.StripeWidth });
            }
        }

       
        const width = fillType === "none" ? Math.max(style.strokeWidth, 1) : style.strokeWidth;
        if (width <= 0) {
            return;
        }

        const color = style.strokeColor;

        if (style.strokeType === "dashed") {
            const pieces = dashes(points, closed, width * 4 + 2, width * 3 + 2);
            for (const dash of pieces) {
                graphics.moveTo(dash[0].x, dash[0].y);
                for (const p of dash.slice(1)) {
                    graphics.lineTo(p.x, p.y);
                }
            }
            if (pieces.length > 0) {
                graphics.stroke({ color, width });
            }
        } else if (style.strokeType === "dotted") {
            const spots = dots(points, closed, width * 2 + 3);
            for (const p of spots) {
                graphics.circle(p.x, p.y, width / 2);
            }
            if (spots.length > 0) {
                graphics.fill({ color });
            }
        } else {
            if (closed) {
                graphics.poly(corners);
            } else {
                graphics.moveTo(points[0].x, points[0].y);
                for (const p of points.slice(1)) {
                    graphics.lineTo(p.x, p.y);
                }
            }
            graphics.stroke({ color, width });
        }
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

    
    outline() {
        throw new Error(`${this.constructor.name} must implement outline()`);
    }
}

export default Draw;