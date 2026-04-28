# Лабораторная работа №4


## Особенности реализации

| Действие | Метод | URL |
| :--- | :--- | :--- |
| Получить список книг | `GET` | `http://localhost:3000/books` |
| Получить книгу по ISBN | `GET` | `http://localhost:3000/books/11112` |
| Получить список пользователей | `GET` | `http://localhost:3000/users` |
| Добавить книгу | `POST` | `http://localhost:3000/books` |
| Добавить пользователя | `POST` | `http://localhost:3000/users` |
| Выдать книгу | `POST` | `http://localhost:3000/issue` |
| Удалить книгу | `DELETE` | `http://localhost:3000/books/11111` |
| Bернуть книгу | `POST` | `http://localhost:3000/return` |

---

<br>
<br>



# Примеры в Thunder Client
## 1. Добавление книги
Сначала методы POST, затем GET,и DELETE
Метод: `POST`
URL:
```
http://localhost:3000/books
```

Body → JSON:
```json
{
  "title": "Мёртвые души",
  "author": "Гоголь",
  "isbn": "11162",
  "count": 3
}
```

## 2. Добавление пользователя

Метод: `POST` 
URL:

```bash
http://localhost:3000/users
```

Body → JSON:
```json
{
  "firstName": "Егор",
  "lastName": "Плотников",
  "cardNumber": "u1"
}
```

## 3. Выдача книги пользователю

Метод: `POST`
URL:

```
http://localhost:3000/issue
```

Body → JSON:
``` json
{
  "isbn": "11162",
  "cardNumber": "u1"
}
```
## 4. Просмотр списка книг

Метод: `GET`
URL:
```
http://localhost:3000/books
```
**Ответ:**
```json
{
  "list": [
    {
      "id": 1,
      "title": "1984",
      "author": "Оруэлл",
      "isbn": "11111",
      "total": 5,
      "available": 2
    },
    {
      "id": 2,
      "title": "Чужие дети",
      "author": "Егоров",
      "isbn": "11112",
      "total": 6,
      "available": 5
    },
    {
      "id": 3,
      "title": "Мертвые Души",
      "author": "Гоголь",
      "isbn": "11162",
      "total": 12,
      "available": 10
    }
  ],
  "inventory": {
    "11111": 2,
    "11112": 5,
    "11162": 10
  }
}
```
## 6. Найти книгу по ISBN

Метод: `GET`
URL:
```
http://localhost:3000/books/11112
```
## 7. Удаление книги

Метод: `DELETE`
URL:
```
http://localhost:3000/books/11111
```
**Ответ:**
```json
{
  "message": "Книга удалена"
}
```