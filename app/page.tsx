"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Edit2, Trash2, AlertTriangle } from "lucide-react"
import { Board as BoardComponent } from "@/components/board" // Компонент для отображения доски (колонки и карточки)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Импорт API-функций и типов из services/api.ts с алиасами для избежания конфликтов имён
import {
  Board,
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
  createColumn,
  getBoard,
  updateColumn,
  deleteColumn,
  createCard,
  updateCard as apiUpdateCard,
  deleteCard as apiDeleteCard,
  moveCard as apiMoveCard,
} from "./services/api"

// Типы для локального состояния (если они отличаются от импортированных)
export type Card = {
  id: string
  title: string
  description: string
  columnId: string
}

export type Column = {
  id: string
  title: string
  cards: Card[]
}

export type BoardType = {
  id: string
  title: string
  columns: Column[]
}

export default function Home() {
  // Состояние досок – изначально пустое, затем заполняется через API
  const [boards, setBoards] = useState<BoardType[]>([])
  const [currentBoardId, setCurrentBoardId] = useState<string>("")
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [isNewBoardDialogOpen, setIsNewBoardDialogOpen] = useState(false)
  const [isRenameBoardDialogOpen, setIsRenameBoardDialogOpen] = useState(false)
  const [isDeleteBoardDialogOpen, setIsDeleteBoardDialogOpen] = useState(false)
  const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = useState(false)
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null)
  const [renameBoardTitle, setRenameBoardTitle] = useState("")

  // Загрузка досок с сервера при монтировании
  useEffect(() => {
    async function loadBoards() {
      try {
        const data = await getBoards()
        setBoards(data)
        if (data.length > 0) {
          setCurrentBoardId(data[0].id)
        }
      } catch (error) {
        console.error("Ошибка загрузки досок:", error)
      }
    }
    loadBoards()
  }, [])

  // Получить текущую доску
  const currentBoard: BoardType = boards.find((board: BoardType) => board.id === currentBoardId) || ({} as BoardType)

  // Функция для создания новой доски через API
  const addBoard = async () => {
    if (newBoardTitle.trim() === "") return

    try {
      const newBoard = await createBoard(newBoardTitle)
      setBoards([...boards, newBoard])
      setCurrentBoardId(newBoard.id)
      setNewBoardTitle("")
      setIsNewBoardDialogOpen(false)
    } catch (error) {
      console.error("Ошибка создания доски:", error)
    }
  }

  // Функция для переименования доски через API
  const renameBoard = async () => {
    if (renameBoardTitle.trim() === "") return

    try {
      await updateBoard(currentBoardId, renameBoardTitle)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? { ...board, title: renameBoardTitle } : board,
          ),
      )
      setRenameBoardTitle("")
      setIsRenameBoardDialogOpen(false)
    } catch (error) {
      console.error("Ошибка обновления доски:", error)
    }
  }

  // Функция для удаления доски через API
  const deleteBoardHandler = async () => {
    if (boards.length <= 1) {
      alert("Нельзя удалить последнюю доску")
      return
    }

    try {
      await deleteBoard(currentBoardId)
      const newBoards = boards.filter((board: BoardType) => board.id !== currentBoardId)
      setBoards(newBoards)
      setCurrentBoardId(newBoards[0]?.id || "")
      setIsDeleteBoardDialogOpen(false)
    } catch (error) {
      console.error("Ошибка удаления доски:", error)
    }
  }

  // Функция для создания новой колонки через API
  const addColumnHandler = async () => {
    if (newColumnTitle.trim() === "") return
    try {
      // Предполагается, что createColumn возвращает созданную колонку
      const newColumn = await createColumn(currentBoardId, newColumnTitle)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId
                  ? { ...board, columns: [...board.columns, newColumn] }
                  : board,
          ),
      )
      setNewColumnTitle("")
    } catch (error) {
      console.error("Ошибка создания колонки:", error)
    }
  }

  // Функция переименования колонки через API
  const renameColumn = async (columnId: string, newTitle: string) => {
    if (newTitle.trim() === "") return
    try {
      await updateColumn(columnId, newTitle)
      const updatedBoard = await getBoard(currentBoardId)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? updatedBoard : board
          )
      )
    } catch (error) {
      console.error("Ошибка обновления колонки:", error)
    }
  }

  // Функция подготовки к удалению колонки
  const prepareDeleteColumn = (columnId: string) => {
    setColumnToDelete(columnId)
    setIsDeleteColumnDialogOpen(true)
  }

  // Функция для удаления колонки через API
  const deleteColumnHandler = async () => {
    if (!columnToDelete) return
    try {
      await deleteColumn(columnToDelete)
      const updatedBoard = await getBoard(currentBoardId)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? updatedBoard : board
          )
      )
      setColumnToDelete(null)
      setIsDeleteColumnDialogOpen(false)
    } catch (error) {
      console.error("Ошибка удаления колонки:", error)
    }
  }

  // Функция добавления карточки через API
  const addCard = async (columnId: string, cardTitle: string, cardDescription: string) => {
    try {
      await createCard(columnId, cardTitle, cardDescription)
      const updatedBoard = await getBoard(currentBoardId)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? updatedBoard : board
          )
      )
    } catch (error) {
      console.error("Ошибка создания карточки:", error)
    }
  }

  // Функция перемещения карточки через API
  const moveCard = async (cardId: string, sourceColumnId: string, destinationColumnId: string) => {
    try {
      await apiMoveCard(cardId, sourceColumnId, destinationColumnId)
      const updatedBoard = await getBoard(currentBoardId)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? updatedBoard : board
          )
      )
    } catch (error) {
      console.error("Ошибка перемещения карточки:", error)
    }
  }

  // Функция обновления карточки через API
  const updateCard = async (columnId: string, cardId: string, title: string, description: string) => {
    try {
      await apiUpdateCard(cardId, title, description)
      const updatedBoard = await getBoard(currentBoardId)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? updatedBoard : board
          )
      )
    } catch (error) {
      console.error("Ошибка обновления карточки:", error)
    }
  }

  // Функция удаления карточки через API
  const deleteCard = async (columnId: string, cardId: string) => {
    try {
      await apiDeleteCard(cardId)
      const updatedBoard = await getBoard(currentBoardId)
      setBoards(
          boards.map((board: BoardType) =>
              board.id === currentBoardId ? updatedBoard : board
          )
      )
    } catch (error) {
      console.error("Ошибка удаления карточки:", error)
    }
  }

  // Подготовка к переименованию доски
  const prepareRenameBoard = () => {
    setRenameBoardTitle(currentBoard.title)
    setIsRenameBoardDialogOpen(true)
  }

  return (
      <main className="container mx-auto p-4">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Select value={currentBoardId} onValueChange={setCurrentBoardId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите доску" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board: BoardType) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.title}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={prepareRenameBoard} title="Переименовать доску">
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDeleteBoardDialogOpen(true)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  title="Удалить доску"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <Dialog open={isDeleteBoardDialogOpen} onOpenChange={setIsDeleteBoardDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Удаление доски</DialogTitle>
                    <DialogDescription>
                      Вы уверены, что хотите удалить доску "{currentBoard?.title}"? Это действие нельзя отменить.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex items-center justify-between mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteBoardDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button variant="destructive" onClick={deleteBoardHandler} className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Удалить
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isNewBoardDialogOpen} onOpenChange={setIsNewBoardDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Новая доска
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать новую доску</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label htmlFor="boardTitle" className="text-sm font-medium">
                        Название
                      </label>
                      <Input
                          id="boardTitle"
                          value={newBoardTitle}
                          onChange={(e) => setNewBoardTitle(e.target.value)}
                          placeholder="Введите название доски"
                      />
                    </div>
                    <Button onClick={addBoard} className="w-full">
                      Создать доску
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteColumnDialogOpen} onOpenChange={setIsDeleteColumnDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Удаление списка</DialogTitle>
                    <DialogDescription>
                      Вы уверены, что хотите удалить этот список? Все карточки в нем будут удалены. Это действие нельзя отменить.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex items-center justify-between mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteColumnDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button variant="destructive" onClick={deleteColumnHandler} className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Удалить
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isRenameBoardDialogOpen} onOpenChange={setIsRenameBoardDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Переименовать доску</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label htmlFor="renameBoardTitle" className="text-sm font-medium">
                        Название
                      </label>
                      <Input
                          id="renameBoardTitle"
                          value={renameBoardTitle}
                          onChange={(e) => setRenameBoardTitle(e.target.value)}
                          placeholder="Введите новое название доски"
                      />
                    </div>
                    <Button onClick={renameBoard} className="w-full">
                      Переименовать
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-2">
              <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Название нового списка"
                  className="w-48"
              />
              <Button onClick={addColumnHandler}>Добавить список</Button>
            </div>
          </div>

          <h1 className="text-2xl font-bold">{currentBoard?.title}</h1>
        </div>

        <BoardComponent
            columns={currentBoard?.columns || []}
            addCard={addCard}
            moveCard={moveCard}
            renameColumn={renameColumn}
            prepareDeleteColumn={prepareDeleteColumn}
            deleteCard={deleteCard}
            updateCard={updateCard}
        />
      </main>
  )
}

