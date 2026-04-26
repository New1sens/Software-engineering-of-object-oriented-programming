const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

class Book {
    constructor(id, title, author, isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    static validateISBN(isbn) {
        return typeof isbn === 'string' && isbn.length >= 5;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            isbn: this.isbn
        };
    }
}

class User {
    constructor(firstName, lastName, cardNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.cardNumber = cardNumber;
        this.books = [];
    }

    toJSON() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            cardNumber: this.cardNumber,
            books: this.books
        };
    }
}

class Library {
    constructor() {
        this._books = [];
        this._users = [];
        this._inv = {};
        this.load();
    }

    load() {
        if (fs.existsSync('books.json')) {
            const data = JSON.parse(fs.readFileSync('books.json', 'utf8'));
            // совместимость со старым форматом (массив) и новым (объект с list/inventory)
            if (Array.isArray(data)) {
                this._books = data.map(b => ({ ...b }));
                this._inv = {};
                for (const b of this._books) {
                    this._inv[b.isbn] = b.available ?? 0;
                }
            } else {
                this._books = data.list || [];
                this._inv = data.inventory || {};
            }
        }

        if (fs.existsSync('users.json')) {
            const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
            this._users = Array.isArray(data) ? data : (data.users || []);
        }
    }

    saveBooks() {
        fs.writeFileSync(
            'books.json',
            JSON.stringify({ list: this._books, inventory: this._inv }, null, 2)
        );
    }

    saveUsers() {
        fs.writeFileSync(
            'users.json',
            JSON.stringify(this._users, null, 2)
        );
    }

    addBook(title, author, isbn, count = 1) {
        if (!title || !author || !isbn) return { error: 'Не все поля заполнены' };
        if (!Book.validateISBN(isbn)) return { error: 'Неверный ISBN (минимум 5 символов)' };

        if (!this._books.find(b => b.isbn === isbn)) {
            this._books.push(new Book(Date.now(), title, author, isbn).toJSON());
        }

        this._inv[isbn] = (this._inv[isbn] || 0) + Number(count);
        this.saveBooks();

        return { message: 'Книга добавлена', inventory: this._inv[isbn] };
    }

    deleteBook(isbn) {
        const index = this._books.findIndex(b => b.isbn === isbn);
        if (index === -1) return { error: 'Книга не найдена' };

        this._books.splice(index, 1);
        delete this._inv[isbn];
        this.saveBooks();

        return { message: 'Книга удалена' };
    }

    getBooks() {
        return { list: this._books, inventory: this._inv };
    }

    getBookByISBN(isbn) {
        const book = this._books.find(b => b.isbn === isbn);
        if (!book) return { error: 'Книга не найдена' };

        return { book, inventory: this._inv[isbn] || 0 };
    }

    addUser(firstName, lastName, cardNumber) {
        if (!firstName || !lastName || !cardNumber) return { error: 'Не все поля заполнены' };

        this._users.push(new User(firstName, lastName, cardNumber).toJSON());
        this.saveUsers();

        return { message: 'Пользователь добавлен' };
    }

    getUsers() {
        return { users: this._users };
    }

    issueBook(isbn, cardNumber) {
        const user = this._users.find(u => u.cardNumber === cardNumber);
        if (!user) return { error: 'Пользователь не найден' };
        if (!this._inv[isbn] || this._inv[isbn] <= 0) return { error: 'Нет доступных экземпляров' };

        user.books.push(isbn);
        this._inv[isbn]--;
        this.saveBooks();
        this.saveUsers();

        return { message: 'Книга выдана', remain: this._inv[isbn] };
    }

    returnBook(isbn, cardNumber) {
        const user = this._users.find(u => u.cardNumber === cardNumber);
        if (!user) return { error: 'Пользователь не найден' };

        const idx = user.books.indexOf(isbn);
        if (idx === -1) return { error: 'У пользователя нет этой книги' };

        user.books.splice(idx, 1);
        this._inv[isbn] = (this._inv[isbn] || 0) + 1;
        this.saveBooks();
        this.saveUsers();

        return { message: 'Книга возвращена', remain: this._inv[isbn] };
    }
}

const lib = new Library();

// Методы с Books 
app.get('/books', (req, res) => {
    res.json(lib.getBooks());
});

app.get('/books/:isbn', (req, res) => {
    res.json(lib.getBookByISBN(req.params.isbn));
});

app.post('/books', (req, res) => {
    const { title, author, isbn, count } = req.body;
    res.json(lib.addBook(title, author, isbn, count));
});

app.delete('/books/:isbn', (req, res) => {
    res.json(lib.deleteBook(req.params.isbn));
});

// Методы с Users 

app.get('/users', (req, res) => {
    res.json(lib.getUsers());
});

app.post('/users', (req, res) => {
    const { firstName, lastName, cardNumber } = req.body;
    res.json(lib.addUser(firstName, lastName, cardNumber));
});

// Методы с выдачей и возвратом книг Issue / Return 

app.post('/issue', (req, res) => {
    const { isbn, cardNumber } = req.body;
    res.json(lib.issueBook(isbn, cardNumber));
});

app.post('/return', (req, res) => {
    const { isbn, cardNumber } = req.body;
    res.json(lib.returnBook(isbn, cardNumber));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});