# Command Pattern

**Files:** `actions/Action.js`, `actions/DrawAction.js`, `actions/DeleteAction.js`, `actions/TransformAction.js`, `actions/StyleAction.js`, `actions/GroupAction.js`, `actions/UngroupAction.js`, `managers/HistoryManager.js`, `managers/DrawingManager.js`, `DrawStates/Draw.js`, `DrawStates/TransformState.js`, `main.js`

```mermaid
classDiagram
    direction TB

    class Action {
        <<abstract>>
        +execute()*
        +undo()*
        +discard()
    }

    class DrawAction {
        +shape : Graphics
        +layer : Container
        +execute()
        +undo()
        +discard()
    }
    class DeleteAction {
        +shapes : Container[]
        +removed : Record[]
        +execute()
        +undo()
    }
    class TransformAction {
        +shapes : Container[]
        +before : Transform[]
        +after : Transform[]
        +execute()
        +undo()
        +capture(shape) Transform$
        +apply(shape, transform)$
    }
    class StyleAction {
        +shapes : Graphics[]
        +before : Style[]
        +after : Style[]
        +execute()
        +undo()
    }
    class GroupAction {
        +shapes : Container[]
        +group : Container
        +execute()
        +undo()
        +discard()
    }
    class UngroupAction {
        +groups : Container[]
        +records : Record[]
        +execute()
        +undo()
    }

    class HistoryManager {
        <<static>>
        +undoStack : Action[]$
        +redoStack : Action[]$
        +perform(action)$
        +undo()$
        +redo()$
        +canUndo() boolean$
        +canRedo() boolean$
    }

    class Draw {
        <<abstract>>
        +onPointerUp(position)
    }
    class TransformState {
        <<abstract>>
        +onPointerUp(position)
    }
    class DrawingManager {
        <<static>>
        +deleteSelected()$
        +restyleSelected(changes)$
        +groupSelected()$
        +ungroupSelected()$
    }
    class MainJS {
        <<module>>
        undo button / Ctrl+Z
        redo button / Ctrl+Y
    }

    Action <|-- DrawAction
    Action <|-- DeleteAction
    Action <|-- TransformAction
    Action <|-- StyleAction
    Action <|-- GroupAction
    Action <|-- UngroupAction

    HistoryManager o-- "*" Action : undoStack / redoStack

    Draw ..> DrawAction : creates
    TransformState ..> TransformAction : creates
    DrawingManager ..> DeleteAction : creates
    DrawingManager ..> StyleAction : creates
    DrawingManager ..> GroupAction : creates
    DrawingManager ..> UngroupAction : creates

    Draw ..> HistoryManager : perform()
    TransformState ..> HistoryManager : perform()
    DrawingManager ..> HistoryManager : perform()
    MainJS ..> HistoryManager : undo() / redo()

    note for HistoryManager "perform(): execute, push onto undoStack, clear redoStack<br>undo(): pop undoStack, call undo(), push onto redoStack<br>redo(): pop redoStack, call execute(), push onto undoStack"
```