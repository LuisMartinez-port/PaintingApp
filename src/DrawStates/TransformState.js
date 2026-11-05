import SelectionManager from "../managers/SelectionManager.js";
import HistoryManager from "../managers/HistoryManager.js";
import TransformAction from "../actions/TransformAction.js";


class TransformState {

    start = null;   
    shapes = [];    
    before = [];    

    get isDragging() {
        return this.start !== null;
    }

    onPointerDown(position) {
        if (SelectionManager.getSelected().length === 0) {
            SelectionManager.selectAt(position);
        }

        this.shapes = SelectionManager.getSelected();
        if (this.shapes.length === 0) {
            return;
        }

        this.start = { x: position.x, y: position.y };
        this.before = this.shapes.map(TransformAction.capture);
        this.begin();
    }

    onPointerMove(position) {
        if (!this.isDragging) {
            return;
        }

        this.preview(position);
        SelectionManager.refresh();  
    }

    onPointerUp(position) {
        if (!this.isDragging) {
            return;
        }

        this.preview(position);

        const shapes = this.shapes;
        const before = this.before;
        const after = shapes.map(TransformAction.capture);
        this.reset();

        const changed = after.some((t, i) =>
            t.x !== before[i].x || t.y !== before[i].y ||
            t.scaleX !== before[i].scaleX || t.scaleY !== before[i].scaleY
        );

        if (changed) {
            HistoryManager.perform(new TransformAction(shapes, before, after));
        }
        SelectionManager.refresh();
    }

    cancel() {
        if (this.isDragging) {
            this.shapes.forEach((shape, i) => TransformAction.apply(shape, this.before[i]));
            SelectionManager.refresh();
        }
        this.reset();
    }

    reset() {
        this.start = null;
        this.shapes = [];
        this.before = [];
    }

    begin() {
    }

   
    preview(position) {
        throw new Error(`${this.constructor.name} must implement preview()`);
    }
}

export default TransformState;