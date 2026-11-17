import Draw from "./Draw.js";
 
class DrawLineState extends Draw {
 
    outline() {
        return {
            points: [this.start, this.end],
            closed: false,
        };
    }
}
 
export default DrawLineState;