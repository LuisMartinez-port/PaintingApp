import { Application, Assets, Sprite, Rectangle  } from "pixi.js";
import ToolsManager from "./managers/ToolsManager.js";
import DrawManager from "./managers/DrawingManager.js";
import HistoryManager from "./managers/HistoryManager.js";
import StyleManager from "./managers/StyleManager.js";
import {TriangleDraw,DiamondDraw,PentagonDraw,HexagonDraw,ArrowDraw,} from "./DrawStates/PolygonDraw.js";
 
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
        ToolsManager.addToolGroup("Custom Shapes",["fa-solid","fa-draw-polygon"], [
        ToolsManager.getTool("Triangle",["fa-solid","fa-caret-up"], () => {
            DrawManager.selectCustomShape(TriangleDraw);
        }),
        ToolsManager.getTool("Diamond",["fa-solid","fa-diamond"], () => {
            DrawManager.selectCustomShape(DiamondDraw);
        }),
        ToolsManager.getTool("Pentagon",["fa-solid","fa-draw-polygon"], () => {
            DrawManager.selectCustomShape(PentagonDraw);
        }),
        ToolsManager.getTool("Hexagon",["fa-solid","fa-dice-d6"], () => {
            DrawManager.selectCustomShape(HexagonDraw);
        }),
        ToolsManager.getTool("Arrow",["fa-solid","fa-arrow-right"], () => {
            DrawManager.selectCustomShape(ArrowDraw);
        })
    ]);
 
    let fillColorPicker = ToolsManager.getColorPicker("Fill Color");
    let strokeColorPicker = ToolsManager.getColorPicker("Stroke Color");
    let strokeInput = document.getElementById("stroke");
 
    ToolsManager.addTool(fillColorPicker);
    ToolsManager.addTool(strokeColorPicker);
        
    const startStyle = StyleManager.current();
    fillColorPicker.value = StyleManager.toHex(startStyle.fillColor);
    strokeColorPicker.value = StyleManager.toHex(startStyle.strokeColor);
    strokeInput.value = startStyle.strokeWidth;

    
    const changeStyle = (changes) => {
        StyleManager.update(changes);
        DrawManager.restyleSelected(changes);
    };

   
    fillColorPicker.addEventListener("change", () => {
        changeStyle({ fillColor: fillColorPicker.getDecimal() });
    });

    strokeColorPicker.addEventListener("change", () => {
        changeStyle({ strokeColor: strokeColorPicker.getDecimal() });
    });

    strokeInput.addEventListener("change", () => {
        const width = Math.max(0, Number(strokeInput.value) || 0);
        strokeInput.value = width;
        changeStyle({ strokeWidth: width });
    });

   
    const svgIcon = (inner) =>
        `<svg width="30" height="30" viewBox="0 0 24 24">${inner}</svg>`;

    const outlineSquare = `<rect x="3" y="3" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"/>`;

    const FILL_ICONS = {
        solid: `<rect x="3" y="3" width="18" height="18" fill="currentColor"/>`,
        striped: outlineSquare + `<path d="M3 15 L15 3 M3 21 L21 3 M9 21 L21 9" stroke="currentColor" stroke-width="2"/>`,
        none: outlineSquare,
    };

    const BORDER_ICONS = {
        solid: `<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3"/>`,
        dashed: `<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3" stroke-dasharray="5 3"/>`,
        dotted: `<line x1="3" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="0.1 5"/>`,
    };

    const fillTypeTool = ToolsManager.getTool("", [], () => {
        const fillType = StyleManager.next(StyleManager.FILL_TYPES, StyleManager.current().fillType);
        changeStyle({ fillType });
        showFillType();
    });

    const showFillType = () => {
        const fillType = StyleManager.current().fillType;
        fillTypeTool.innerHTML = svgIcon(FILL_ICONS[fillType]);
        fillTypeTool.title = `Fill: ${fillType} (click to change)`;
    };

    const borderTypeTool = ToolsManager.getTool("", [], () => {
        const strokeType = StyleManager.next(StyleManager.STROKE_TYPES, StyleManager.current().strokeType);
        changeStyle({ strokeType });
        showBorderType();
    });

    const showBorderType = () => {
        const strokeType = StyleManager.current().strokeType;
        borderTypeTool.innerHTML = svgIcon(BORDER_ICONS[strokeType]);
        borderTypeTool.title = `Border: ${strokeType} (click to change)`;
    };

    showFillType();
    showBorderType();
    ToolsManager.addTool(fillTypeTool);
    ToolsManager.addTool(borderTypeTool);
 
    ToolsManager.addTool(ToolsManager.getTool("Select Tool",["fa-solid","fa-arrow-pointer"], () => {
        DrawManager.selectSelectTool();
    }));
 
    // The tools below aren't built yet. Each one calls clearTool() so that
    // picking it stops dragging from drawing shapes.
     ToolsManager.addTool(ToolsManager.getTool("Move Tool",["fa-solid","fa-up-down-left-right"], () => {
        DrawManager.selectMoveTool();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Scale Tool",["fa-solid","fa-up-right-and-down-left-from-center"], () => {
        DrawManager.selectScaleTool();
    }));

    ToolsManager.addTool(ToolsManager.getTool("Delete Tool",["fa-solid","fa-trash-can"], () => {
        DrawManager.deleteSelected();
    }));
 
        ToolsManager.addTool(ToolsManager.getTool("Group Tool",["fa-solid","fa-object-group"], () => {
        DrawManager.groupSelected();
    }));
 
    ToolsManager.addTool(ToolsManager.getTool("Ungroup Tool",["fa-regular","fa-object-group"], () => {
        DrawManager.ungroupSelected();
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
        if (event.key === "Delete" || event.key === "Backspace") {
            event.preventDefault();
            DrawManager.deleteSelected();
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
        } else if (key === "g" && !event.shiftKey) {
            event.preventDefault();
            DrawManager.groupSelected();
        } else if (key === "g" && event.shiftKey) {
            event.preventDefault();
            DrawManager.ungroupSelected();
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