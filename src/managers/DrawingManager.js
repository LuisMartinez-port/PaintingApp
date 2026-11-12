import { Container } from "pixi.js";
import CircleDraw from "../DrawStates/CircleDraw.js";
import RectDraw from "../DrawStates/RectDraw.js";
import LineDraw from "../DrawStates/LineDraw.js";
import StarDraw from "../DrawStates/StarDraw.js";
import SelectState from "../DrawStates/SelectState.js";
import MoveState from "../DrawStates/MoveState.js";
import ScaleState from "../DrawStates/ScaleState.js";
import SelectionManager from "./SelectionManager.js";
import HistoryManager from "./HistoryManager.js";
import DeleteAction from "../actions/DeleteAction.js";
import GroupAction from "../actions/GroupAction.js";
import UngroupAction from "../actions/UngroupAction.js";

class DrawingManager {
 
    static app = null;
    static currentTool = null; 

    static shapes = null;   
 
    static initialize(app) {
        this.app = app;
        const stage = app.stage;

     
        this.shapes = new Container();
        this.overlay = new Container();
        stage.addChild(this.shapes, this.overlay);

        SelectionManager.initialize(this.shapes, this.overlay);
 
        stage.eventMode = "static";
        stage.hitArea = app.screen;
 
        stage.on("pointerdown", (e) => this.currentTool?.onPointerDown(e.global, e));
        stage.on("globalpointermove", (e) => this.currentTool?.onPointerMove(e.global));
        stage.on("pointerup", (e) => this.currentTool?.onPointerUp(e.global));
        stage.on("pointerupoutside", (e) => this.currentTool?.onPointerUp(e.global));
    }
 
    static selectCircle() {
        this.setDrawTool(new CircleDraw(this.shapes));
    }
 
    static selectRectangle() {
        this.setDrawTool(new RectDraw(this.shapes));
    }
 
    static selectLine() {
        this.setDrawTool(new LineDraw(this.shapes));
    }
 
    static selectStar() {
        this.setDrawTool(new StarDraw(this.shapes));
    }

    static selectSelectTool() {
        this.setTool(new SelectState(this.overlay));
    }

        static selectMoveTool() {
        this.setTool(new MoveState());
    }

    static selectScaleTool() {
        this.setTool(new ScaleState());
    }

   
    static deleteSelected() {
        const shapes = SelectionManager.getSelected();
        if (shapes.length === 0) {
            return;
        }

        this.cancelInProgress();
        HistoryManager.perform(new DeleteAction(shapes));
    }

     static groupSelected() {
        const shapes = SelectionManager.getSelected();
        if (shapes.length < 2) {
            return;
        }

        this.cancelInProgress();
        const action = new GroupAction(shapes, this.shapes);
        HistoryManager.perform(action);
        SelectionManager.setSelected([action.group]);
    }

    static ungroupSelected() {
        const selected = SelectionManager.getSelected();
        const groups = selected.filter((shape) => shape.isGroup);
        if (groups.length === 0) {
            return;
        }

        const others = selected.filter((shape) => !shape.isGroup);
        const freed = groups.flatMap((group) => [...group.children]);

        this.cancelInProgress();
        HistoryManager.perform(new UngroupAction(groups, this.shapes));
        SelectionManager.setSelected([...others, ...freed]);
    }
 

    static clearTool() {
        this.setTool(null);
    }

    static cancelInProgress() {
        this.currentTool?.cancel();
    }

    static setDrawTool(tool) {
        SelectionManager.clear();
        this.setTool(tool);
    }
 
    static setTool(tool) {
        this.cancelInProgress();
        this.currentTool = tool;
    }
}
 
export default DrawingManager;