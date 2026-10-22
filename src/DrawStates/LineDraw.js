import Draw from "./Draw.js";
 
class DrawLineState extends Draw {
 
    filled = false;  
 
    draw(graphics, start, end) {
        graphics.moveTo(start.x, start.y).lineTo(end.x, end.y);
    }
}
 
export default DrawLineState;
 