import Draw from "./Draw.js";
 
// Click sets the center, drag sets the radius.
class DrawCircleState extends Draw {
 
    draw(graphics, start) {
        graphics.circle(start.x, start.y, this.distance());
    }
}
 
export default DrawCircleState;
 