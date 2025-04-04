"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Edit2, Trash } from "lucide-react"
import type { Column as ColumnType } from "@/app/page"
import { Card } from "@/components/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ColumnProps {
  column: ColumnType
  addCard: (columnId: string, cardTitle: string, cardDescription: string) => void
  onDragStart: (cardId: string, columnId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  renameColumn: (columnId: string, newTitle: string) => void
  prepareDeleteColumn: (columnId: string) => void
  deleteCard: (columnId: string, cardId: string) => void
  updateCard: (columnId: string, cardId: string, title: string, description: string) => void
}

export function Column({
  column,
  addCard,
  onDragStart,
  onDragOver,
  onDrop,
  renameColumn,
  prepareDeleteColumn,
  deleteCard,
  updateCard,
}: ColumnProps) {
  const [newCardTitle, setNewCardTitle] = useState("")
  const [newCardDescription, setNewCardDescription] = useState("")
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState(column.title)

  const handleAddCard = () => {
    if (newCardTitle.trim() === "") return

    addCard(column.id, newCardTitle, newCardDescription)
    setNewCardTitle("")
    setNewCardDescription("")
    setIsCardDialogOpen(false)
  }

  const handleRenameColumn = () => {
    if (newColumnTitle.trim() === "") return

    renameColumn(column.id, newColumnTitle)
    setIsRenameDialogOpen(false)
  }

  const prepareRenameColumn = () => {
    setNewColumnTitle(column.title)
    setIsRenameDialogOpen(true)
  }

  return (
    <div
      className="bg-muted/40 rounded-lg p-3 min-w-[272px] max-w-[272px] h-fit"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{column.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={prepareRenameColumn}
            title="Переименовать список"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm">{column.cards.length}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={() => prepareDeleteColumn(column.id)}
            title="Удалить список"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            onDragStart={onDragStart}
            deleteCard={deleteCard}
            updateCard={updateCard}
          />
        ))}
      </div>

      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground mt-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить карточку
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую карточку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Заголовок
              </label>
              <Input
                id="title"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Введите заголовок карточки"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Описание
              </label>
              <Textarea
                id="description"
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                placeholder="Введите описание карточки"
                rows={3}
              />
            </div>
            <Button onClick={handleAddCard} className="w-full">
              Добавить карточку
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переименовать список</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="columnTitle" className="text-sm font-medium">
                Название
              </label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Введите новое название списка"
              />
            </div>
            <Button onClick={handleRenameColumn} className="w-full">
              Переименовать
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

