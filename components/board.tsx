"use client"

import type React from "react"

import { useState } from "react"
import type { Column as ColumnType } from "@/app/page"
import { Column } from "@/components/column"

interface BoardProps {
  columns: ColumnType[]
  addCard: (columnId: string, cardTitle: string, cardDescription: string) => void
  moveCard: (cardId: string, sourceColumnId: string, destinationColumnId: string) => void
  renameColumn: (columnId: string, newTitle: string) => void
  prepareDeleteColumn: (columnId: string) => void
  deleteCard: (columnId: string, cardId: string) => void
  updateCard: (columnId: string, cardId: string, title: string, description: string) => void
}

export function Board({
  columns,
  addCard,
  moveCard,
  renameColumn,
  prepareDeleteColumn,
  deleteCard,
  updateCard,
}: BoardProps) {
  const [draggingCard, setDraggingCard] = useState<{ id: string; columnId: string } | null>(null)

  const handleDragStart = (cardId: string, columnId: string) => {
    setDraggingCard({ id: cardId, columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (draggingCard && draggingCard.columnId !== columnId) {
      moveCard(draggingCard.id, draggingCard.columnId, columnId)
    }
    setDraggingCard(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          addCard={addCard}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
          renameColumn={renameColumn}
          prepareDeleteColumn={prepareDeleteColumn}
          deleteCard={deleteCard}
          updateCard={updateCard}
        />
      ))}
    </div>
  )
}

