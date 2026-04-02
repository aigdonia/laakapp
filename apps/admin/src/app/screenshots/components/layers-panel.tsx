"use client"

import {
  IconTypography,
  IconPhoto,
  IconDeviceMobile,
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconCopy,
  IconTrash,
} from "@tabler/icons-react"
import { useComposer } from "../lib/store"
import type { ScreenElement } from "../lib/types"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function getIcon(type: ScreenElement["type"]) {
  switch (type) {
    case "text":
      return <IconTypography size={14} />
    case "image":
      return <IconPhoto size={14} />
    case "device":
      return <IconDeviceMobile size={14} />
  }
}

function SortableLayer({
  element,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}: {
  element: ScreenElement
  isSelected: boolean
  onSelect: () => void
  onToggleVisibility: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs ${
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-accent/50"
      } ${!element.visible ? "opacity-40" : ""}`}
      onClick={onSelect}
    >
      <span
        className="cursor-grab text-muted-foreground"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical size={12} />
      </span>
      <span className="text-muted-foreground">{getIcon(element.type)}</span>
      <span className="flex-1 truncate">{element.name}</span>
      <div className="flex gap-0.5 shrink-0">
        <button
          className="p-0.5 rounded hover:bg-accent text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onToggleVisibility()
          }}
          title="Toggle visibility"
        >
          {element.visible ? <IconEye size={12} /> : <IconEyeOff size={12} />}
        </button>
        <button
          className="p-0.5 rounded hover:bg-accent text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          title="Duplicate"
        >
          <IconCopy size={12} />
        </button>
        <button
          className="p-0.5 rounded hover:bg-destructive/20 hover:text-destructive text-muted-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="Delete"
        >
          <IconTrash size={12} />
        </button>
      </div>
    </div>
  )
}

export function LayersPanel() {
  const { state, dispatch, activeScreen } = useComposer()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  if (!activeScreen) return null

  // Display top-to-bottom (reverse of z-order)
  const reversed = [...activeScreen.elements].reverse()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const ids = activeScreen.elements.map((el) => el.id)
    // Reverse indices since display is reversed
    const reversedIds = [...ids].reverse()
    const oldIndex = reversedIds.indexOf(active.id as string)
    const newIndex = reversedIds.indexOf(over.id as string)

    const reordered = [...reversedIds]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    dispatch({ type: "REORDER_ELEMENTS", ids: reordered.reverse() })
  }

  return (
    <div className="border-t flex flex-col min-h-0">
      <div className="px-3 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Layers
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {reversed.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No elements
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={reversed.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              {reversed.map((element) => (
                <SortableLayer
                  key={element.id}
                  element={element}
                  isSelected={state.selectedElementId === element.id}
                  onSelect={() =>
                    dispatch({ type: "SELECT_ELEMENT", id: element.id })
                  }
                  onToggleVisibility={() =>
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      id: element.id,
                      changes: { visible: !element.visible },
                    })
                  }
                  onDuplicate={() =>
                    dispatch({ type: "DUPLICATE_ELEMENT", id: element.id })
                  }
                  onDelete={() =>
                    dispatch({ type: "DELETE_ELEMENT", id: element.id })
                  }
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
