# Template Method Pattern

**Files:** `DrawStates/Draw.js` and every shape file (`CircleDraw.js`, `RectDraw.js`, `LineDraw.js`, `StarDraw.js`, `PolygonDraw.js`), `DrawStates/TransformState.js`, `DrawStates/MoveState.js`, `DrawStates/ScaleState.js`

## Drawing shapes

```mermaid
classDiagram
    direction TB

    class Draw {
        <<abstract>>
        +onPointerDown(position)
        +onPointerMove(position)
        +onPointerUp(position)
        +render(graphics, style)
        +snapshot() Draw
        +distance() number
        +bounds() Rect
        +outline()* Outline
    }

    class DrawCircleState {
        +outline() Outline
    }
    class DrawRectState {
        +outline() Outline
    }
    class DrawLineState {
        +outline() Outline
    }
    class DrawStarState {
        +points : number
        +innerRatio : number
        +outline() Outline
    }
    class PolygonDraw {
        +points : number[][]
        +outline() Outline
    }
    class TriangleDraw {
        +points
    }
    class DiamondDraw {
        +points
    }
    class PentagonDraw {
        +points
    }
    class HexagonDraw {
        +points
    }
    class ArrowDraw {
        +points
    }

    class Patterns {
        <<module>>
        +dashes(points, closed, dashLength, gapLength)
        +dots(points, closed, spacing)
        +stripes(points, spacing)
    }

    Draw <|-- DrawCircleState
    Draw <|-- DrawRectState
    Draw <|-- DrawLineState
    Draw <|-- DrawStarState
    Draw <|-- PolygonDraw
    PolygonDraw <|-- TriangleDraw
    PolygonDraw <|-- DiamondDraw
    PolygonDraw <|-- PentagonDraw
    PolygonDraw <|-- HexagonDraw
    PolygonDraw <|-- ArrowDraw
    Draw ..> Patterns : uses in render()

    note for Draw "render() is the template:<br>1. call outline() (the step subclasses fill in)<br>2. draw the fill: solid, stripes, or none<br>3. draw the border: solid, dashes, or dots"
    note for PolygonDraw "A middle layer: implements outline() once.<br>Each polygon only supplies its corner points."
```

## Moving and resizing

```mermaid
classDiagram
    direction TB

    class TransformState {
        <<abstract>>
        +onPointerDown(position)
        +onPointerMove(position)
        +onPointerUp(position)
        +cancel()
        +begin()
        +preview(position)*
    }
    class MoveState {
        +preview(position)
    }
    class ScaleState {
        +center : Point
        +startDistance : number
        +begin()
        +preview(position)
    }

    TransformState <|-- MoveState
    TransformState <|-- ScaleState

    note for TransformState "The pointer methods are the template:<br>down: snapshot transforms, call begin()<br>move: call preview()<br>up: call preview(), save one TransformAction"
```