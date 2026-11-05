import TransformState from "./TransformState.js";

class MoveState extends TransformState {

    preview(position) {
        const dx = position.x - this.start.x;
        const dy = position.y - this.start.y;

        this.shapes.forEach((shape, i) => {
            shape.position.set(this.before[i].x + dx, this.before[i].y + dy);
        });
    }
}

export default MoveState;