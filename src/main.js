import { Application, Assets, Sprite, Rectangle  } from "pixi.js";
import ToolsManager from "./managers/ToolsManager.js";
import DrawManager from "./managers/DrawingManager.js";
import HistoryManager from "./managers/HistoryManager.js";
 
import "../style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
 
(async () => {
    // Create a new application
    const app = new Application();
 
    // Initialize the application
    const container = document.getElementById("pixi-container");
 
    await app.init({
        background: "#aaaaaa",
        resizeTo: container
    });
 
    // Start listening for click-and-drag on the canvas.
    DrawManager.initialize(app);
 
    ToolsManager.addToolGroup("Shapes",["fa-solid","fa-shapes"], [
        ToolsManager.getTool("Ellipse",["fa-regular","fa-circle"], () => {
            DrawManager.selectCircle();
        }),
        ToolsManager.getTool("Rectangle",["fa-regular","fa-square"], () => {
            DrawManager.selectRectangle();
        }),
        ToolsManager.getTool("Line",["fa-solid","fa-lines-leaning"], () => {
            DrawManager.selectLine();
        }),
        ToolsManager.getTool("Star",["fa-regular","fa-star"], () => {
            DrawManager.selectStar();
        })
    ]);
 
    let fillColorPicker = ToolsManager.getColorPicker("Fill Color");
    let strokeColorPicker = ToolsManager.getColorPicker("Stroke Color");
    let strokeInput = document.getElementById("stroke");
 
    ToolsManager.addTool(fillColorPicker);
    ToolsManager.addTool(strokeColorPicker);
 
    ToolsManager.addTool(ToolsManager.getTool("Select Tool",["fa-solid","fa-arrow-pointer"], () => {
        DrawManager.selectSelectTool();
    }));
 
    // The tools below aren't built yet. Each one calls clearTool() so that
    // picking it stops dragging from drawing shapes.
    ToolsManager.addTool(ToolsManager.getTool("Move Tool",["fa-solid","fa-up-down-left-right"], () => {
        DrawManager.clearTool();
    }));
 
    ToolsManager.addTool(ToolsManager.getTool("Scale Tool",["fa-solid","fa-up-right-and-down-left-from-center"], () => {
        DrawManager.clearTool();
    }));
 
    ToolsManager.addTool(ToolsManager.getTool("Delete Tool",["fa-solid","fa-trash-can"], () => {
        DrawManager.clearTool();
    }));
 
    ToolsManager.addTool(ToolsManager.getTool("Group Tool",["fa-solid","fa-object-group"], () => {
        DrawManager.clearTool();
    }));
 
    ToolsManager.addTool(ToolsManager.getTool("Ungroup Tool",["fa-regular","fa-object-group"], () => {
        DrawManager.clearTool();
    }));
 
    container.appendChild(app.canvas);
 
    let undoBtn = document.getElementById("undo");
    let redoBtn = document.getElementById("redo");

    const undo = () => {
        DrawManager.cancelInProgress();
        HistoryManager.undo();
    };

    const redo = () => {
        DrawManager.cancelInProgress();
        HistoryManager.redo();
    };
 
    undoBtn.addEventListener("click", undo);
    redoBtn.addEventListener("click", redo);

    // Grey out the buttons when there's nothing to undo or redo.
    const updateUndoRedoButtons = () => {
        undoBtn.disabled = !HistoryManager.canUndo();
        redoBtn.disabled = !HistoryManager.canRedo();
    };
    HistoryManager.ChangedEvent.addListener(updateUndoRedoButtons);
    updateUndoRedoButtons();

    // Keyboard shortcuts: Ctrl+Z to undo, Ctrl+Y or Ctrl+Shift+Z to redo.
    document.addEventListener("keydown", (event) => {
        
        if (event.target.tagName === "INPUT") {
            return;
        }
        if (!event.ctrlKey && !event.metaKey) {
            return;
        }

        const key = event.key.toLowerCase();

        if (key === "z" && !event.shiftKey) {
            event.preventDefault();
            undo();
        } else if (key === "y" || (key === "z" && event.shiftKey)) {
            event.preventDefault();
            redo();
        }
    });
    

    // Load the bunny texture
    /*const texture = await Assets.load("./assets/bunny.png");

    // Create a bunny Sprite
    const bunny = new Sprite(texture);

    // Center the sprite's anchor point
    bunny.anchor.set(0.5);

    // Move the sprite to the center of the screen
    bunny.position.set(app.screen.width / 2, app.screen.height / 2);

    // Add the bunny to the stage
    app.stage.addChild(bunny);

    // Listen for animate update
    app.ticker.add((time) => {
        // Just for fun, let's rotate mr rabbit a little.
        // * Delta is 1 if running at 100% performance *
        // * Creates frame-independent transformation *
        bunny.rotation += 0.1 * time.deltaTime;
    });*/
})();