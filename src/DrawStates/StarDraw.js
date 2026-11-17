import Draw from "./Draw.js";
 
class DrawStarState extends Draw {
 
    points = 5;          
    innerRatio = 0.4;    

    outline() {
        const outer = this.distance();
        const inner = outer * this.innerRatio;
        const corners = [];

        
        for (let i = 0; i < this.points * 2; i++) {
            const radius = i % 2 === 0 ? outer : inner;
            const angle = -Math.PI / 2 + (i * Math.PI) / this.points;
            corners.push({
                x: this.start.x + radius * Math.cos(angle),
                y: this.start.y + radius * Math.sin(angle),
            });
        }

        return { points: corners, closed: true };
    }
}
 
export default DrawStarState;