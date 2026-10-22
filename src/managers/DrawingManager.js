import CircleDraw from "../DrawStates/CircleDraw.js";
import RectDraw from "../DrawStates/RectDraw.js";
import LineDraw from "../DrawStates/LineDraw.js";
import StarDraw from "../DrawStates/StarDraw.js";
 

class DrawingManager {
 
    static app = null;
    static currentTool = null; 
 
    static initialize(app) {
        this.app = app;
        const stage = app.stage;
 
        
        stage.eventMode = "static";
        stage.hitArea = app.screen;
 
        stage.on("pointerdown", (e) => this.currentTool?.onPointerDown(e.global));
        stage.on("globalpointermove", (e) => this.currentTool?.onPointerMove(e.global));
        stage.on("pointerup", (e) => this.currentTool?.onPointerUp(e.global));
        stage.on("pointerupoutside", (e) => this.currentTool?.onPointerUp(e.global));
    }
 
    static selectCircle() {
        this.setTool(new CircleDraw(this.app.stage));
    }
 
    static selectRectangle() {
        this.setTool(new RectDraw(this.app.stage));
    }
 
    static selectLine() {
        this.setTool(new LineDraw(this.app.stage));
    }
 
    static selectStar() {
        this.setTool(new StarDraw(this.app.stage));
    }
 
   
    static deselect() {
        this.setTool(null);
    }
 
    static setTool(tool) {
        this.currentTool?.cancel();
        this.currentTool = tool;
    }
}
 
export default DrawingManager;