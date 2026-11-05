import TransformState from "./TransformState.js";
import SelectionManager from "../managers/SelectionManager.js";


class ScaleState extends TransformState {

    static MinimumScale = 0.05;  
    static MinimumGrab = 10;    

    center = null;     
    startDistance = 0; 

    begin() {
        const box = SelectionManager.getSelectionBounds();
        this.center = {
            x: box.x + box.width / 2,
            y: box.y + box.height / 2,
        };
        this.startDistance = Math.max(this.distanceFromCenter(this.start), ScaleState.MinimumGrab);
    }

    preview(position) {
        
        const factor = Math.max(
            this.distanceFromCenter(position) / this.startDistance,
            ScaleState.MinimumScale
        );

        const c = this.center;

        this.shapes.forEach((shape, i) => {
            const was = this.before[i];

           
            shape.position.set(
                c.x + (was.x - c.x) * factor,
                c.y + (was.y - c.y) * factor
            );
            shape.scale.set(was.scaleX * factor, was.scaleY * factor);
        });
    }

    distanceFromCenter(point) {
        return Math.hypot(point.x - this.center.x, point.y - this.center.y);
    }
}

export default ScaleState;