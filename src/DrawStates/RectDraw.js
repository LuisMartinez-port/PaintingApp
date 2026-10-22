import Draw from "./Draw.js";
 
class DrawRectState extends Draw {
 
    draw(graphics) {
        const { x, y, width, height } = this.bounds();
 
        graphics.rect(x, y, width, height);
    }
}
 
export default DrawRectState;
 