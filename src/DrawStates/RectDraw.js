import Draw from "./Draw.js";
 
class DrawRectState extends Draw {
 
    outline() {
        const { x, y, width, height } = this.bounds();

        return {
            points: [
                { x, y },
                { x: x + width, y },
                { x: x + width, y: y + height },
                { x, y: y + height },
            ],
            closed: true,
        };
    }
}
 
export default DrawRectState;