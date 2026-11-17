# State Pattern

**Files:** `managers/DrawingManager.js`, `DrawStates/Draw.js`, `DrawStates/SelectState.js`, `DrawStates/TransformState.js`, `DrawStates/MoveState.js`, `DrawStates/ScaleState.js`, and the shape files in `DrawStates/`

```mermaid
classDiagram
    direction TB

    class DrawingManager {
        <<static>>
        +currentTool : Tool$
        +initialize(app)$
        +selectCircle()$
        +selectRectangle()$
        +selectLine()$
        +selectStar()$
        +selectCustomShape(ShapeClass)$
        +selectSelectTool()$
        +selectMoveTool()$
        +selectScaleTool()$
        +clearTool()$
        -setTool(tool)$
    }

    class Tool {
        <<interface>>
        +onPointerDown(position, event)
        +onPointerMove(position)
        +onPointerUp(position)
        +cancel()
    }

    class Draw {
        <<abstract>>
        +onPointerDown(position)
        +onPointerMove(position)
        +onPointerUp(position)
        +cancel()
    }

    class SelectState {
        +onPointerDown(position, event)
        +onPointerMove(position)
        +onPointerUp(position)
        +cancel()
    }

    class TransformState {
        <<abstract>>
        +onPointerDown(position)
        +onPointerMove(position)
        +onPointerUp(position)
        +cancel()
    }

    class DrawCircleState
    class DrawRectState
    class DrawLineState
    class DrawStarState
    class PolygonDraw
    class MoveState
    class ScaleState

    DrawingManager o-- "0..1" Tool : currentTool
    DrawingManager ..> Tool : forwards pointer events

    Tool <|.. Draw
    Tool <|.. SelectState
    Tool <|.. TransformState

    Draw <|-- DrawCircleState
    Draw <|-- DrawRectState
    Draw <|-- DrawLineState
    Draw <|-- DrawStarState
    Draw <|-- PolygonDraw
    TransformState <|-- MoveState
    TransformState <|-- ScaleState

    note for DrawingManager "The Pixi stage sends pointerdown / move / up here,<br>and DrawingManager forwards them to currentTool.<br>Toolbar buttons call select...() to swap the state."
    note for Tool "Not a real class in the code (JavaScript has no interfaces).<br>Every tool has these four methods, so any of them<br>can be the current state."
```