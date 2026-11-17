# Composite Pattern

**Files:** `actions/GroupAction.js`, `actions/UngroupAction.js`, `actions/StyleAction.js`, `actions/DeleteAction.js`, `actions/TransformAction.js`, `managers/SelectionManager.js`

```mermaid
classDiagram
    direction TB

    class Container {
        <<Pixi>>
        +position : Point
        +scale : Point
        +children : Container[]
        +getBounds() Bounds
    }

    class Graphics {
        <<Pixi>>
        +recipe : Draw
        +shapeStyle : Style
    }

    class ShapeGroup {
        +isGroup : true
    }

    class GroupAction {
        +execute()
        +undo()
    }
    class UngroupAction {
        +execute()
        +undo()
    }
    class StyleAction {
        +shapesIn(object) Graphics[]$
    }
    class TransformAction
    class DeleteAction
    class SelectionManager {
        <<static>>
        +selectAt(point, additive)$
        +selectInRect(rect, additive)$
    }

    Container <|-- Graphics : leaf (a drawn shape)
    Container <|-- ShapeGroup : composite
    ShapeGroup o-- "2..*" Container : children (shapes or groups)

    GroupAction ..> ShapeGroup : creates
    UngroupAction ..> ShapeGroup : takes apart
    StyleAction ..> ShapeGroup : recurses into
    TransformAction ..> Container : moves / scales any
    DeleteAction ..> Container : removes any
    SelectionManager ..> Container : selects any

    note for ShapeGroup "Not its own class in the code: a Pixi Container<br>made in GroupAction with isGroup = true.<br>It can hold shapes or other groups."
    note for StyleAction "shapesIn() calls itself on each child,<br>so restyling reaches shapes in nested groups."
```