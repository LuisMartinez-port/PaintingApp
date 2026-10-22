import Draw from "./Draw.js";
 

class DrawStarState extends Draw {
 
    points = 5;          
    innerRatio = 0.4;    
    draw(graphics, start) {
        const radius = this.distance();
 
        graphics.star(start.x, start.y, this.points, radius, radius * this.innerRatio);
    }
}
 
export default DrawStarState;
 