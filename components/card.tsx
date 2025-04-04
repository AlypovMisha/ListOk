"use client"

import { useState } from "react"
import { Trash, MoreVertical, Edit } from "lucide-react"
import type { Card as CardType } from "@/app/page"
import { Card as CardUI, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CardProps {
  card: CardType
  columnId: string
  onDragStart: (cardId: string, columnId: string) => void
  deleteCard: (columnId: string, cardId: string) => void
  updateCard?: (columnId: string, cardId: string, title: string, description: string) => void
}

export function Card({ card, columnId, onDragStart, deleteCard, updateCard }: CardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description)

  const handleDeleteCard = () => {
    deleteCard(columnId, card.id)
    setIsDeleteDialogOpen(false)
  }

  const handleUpdateCard = () => {
    if (editTitle.trim() === "") return

    if (updateCard) {
      updateCard(columnId, card.id, editTitle, editDescription)
    }
    setIsEditDialogOpen(false)
  }

  const openEditDialog = () => {
    setEditTitle(card.title)
    setEditDescription(card.description)
    setIsEditDialogOpen(true)
  }

  return (
    <>
      <CardUI
        className="cursor-grab active:cursor-grabbing relative group"
        draggable
        onDragStart={() => onDragStart(card.id, columnId)}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{card.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={openEditDialog}>
                  <Edit className="h-4 w-4" />
                  <span>Редактировать</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-500 cursor-pointer"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                  <span>Удалить</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {card.description && <p className="text-xs text-muted-foreground mt-1">{card.description}</p>}
        </CardContent>
      </CardUI>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление карточки</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить карточку "{card.title}"? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteCard}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование карточки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="editTitle" className="text-sm font-medium">
                Заголовок
              </label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Введите заголовок карточки"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="editDescription" className="text-sm font-medium">
                Описание
              </label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Введите описание карточки"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateCard}>Сохранить</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

