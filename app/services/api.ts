const API_URL = 'https://localhost:7178/api';

// Типы данных
export interface Card {
    id: string;           // Идентификатор карточки, в JSON это будет строка (Guid как string)
    title: string;        // Заголовок карточки
    description: string;  // Описание карточки
    columnId: string;     // Идентификатор колонки (Guid как строка)
    column: Column;       // Поле с объектом колонки (не всегда будет заполнено, но пригодится)
}

export interface Column {
    id: string;           // Идентификатор колонки (Guid как строка)
    title: string;        // Название колонки
    boardId: string;      // Идентификатор доски (Guid как строка)
    board: Board;         // Поле с объектом доски
    cards: Card[];        // Список карточек в колонке
}

export interface Board {
    id: string;           // Идентификатор доски (Guid как строка)
    title: string;        // Название доски
    columns: Column[];    // Список колонок на доске
}

// API для досок
export async function getBoards(): Promise<Board[]> {
    const response = await fetch(`${API_URL}/boards`);
    if (!response.ok) {
        throw new Error('Не удалось получить доски');
    }
    return await response.json();
}

export async function getBoard(id: string): Promise<Board> {
    const response = await fetch(`${API_URL}/boards/${id}`);
    if (!response.ok) {
        throw new Error('Не удалось получить доску');
    }
    return await response.json();
}

export async function createBoard(title: string): Promise<Board> {
    const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });
    if (!response.ok) {
        throw new Error('Не удалось создать доску');
    }
    return await response.json();
}

export async function updateBoard(id: string, title: string): Promise<void> {
    const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title }),
    });
    if (!response.ok) {
        throw new Error('Не удалось обновить доску');
    }
}

export async function deleteBoard(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/boards/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Не удалось удалить доску');
    }
}

// API для колонок
export async function createColumn(boardId: string, title: string): Promise<Column> {
    const response = await fetch(`${API_URL}/columns`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardId, title }),
    });
    if (!response.ok) {
        throw new Error('Не удалось создать колонку');
    }
    return await response.json();
}

export async function updateColumn(id: string, title: string): Promise<void> {
    const response = await fetch(`${API_URL}/columns/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title }),
    });
    if (!response.ok) {
        throw new Error('Не удалось обновить колонку');
    }
}

export async function deleteColumn(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/columns/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Не удалось удалить колонку');
    }
}

// API для карточек
export async function createCard(columnId: string, title: string, description: string): Promise<Card> {
    const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ columnId, title, description }),
    });
    if (!response.ok) {
        throw new Error('Не удалось создать карточку');
    }
    return await response.json();
}

export async function updateCard(id: string, title: string, description: string): Promise<void> {
    const response = await fetch(`${API_URL}/cards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, description }),
    });
    if (!response.ok) {
        throw new Error('Не удалось обновить карточку');
    }
}

export async function moveCard(id: string, sourceColumnId: string, destinationColumnId: string): Promise<void> {
    const response = await fetch(`${API_URL}/cards/${id}/move`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceColumnId, destinationColumnId }),
    });
    if (!response.ok) {
        throw new Error('Не удалось переместить карточку');
    }
}

export async function deleteCard(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/cards/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Не удалось удалить карточку');
    }
}
