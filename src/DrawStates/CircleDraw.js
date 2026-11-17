import Draw from "./Draw.js";
 
// Click sets the center, drag sets the radius.
class DrawCircleState extends Draw {
 
    outline() {
        const radius = this.distance();

       
        const sides = Math.max(24, Math.ceil(radius));
        const points = [];

        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            points.push({
                x: this.start.x + radius * Math.cos(angle),
                y: this.start.y + radius * Math.sin(angle),
            });
        }

        return { points, closed: true };
    }
}
 
export default DrawCircleState;