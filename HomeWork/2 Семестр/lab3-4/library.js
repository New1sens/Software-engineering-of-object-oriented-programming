const fs = require("fs");

class Book {
    #id;
    #title;
    #author;
    #isbn;

    constructor(id, title, author, isbn) {
        if (!Book.validateISBN(isbn)) throw new Error("Неверный ISBN");
        this.#id = id;
        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
    }

    get id() { return this.#id; }
    get title() { return this.#title; }
    get author() { return this.#author; }
    get isbn() { return this.#isbn; }

    static validateISBN(isbn) {
        return typeof isbn === "string" && isbn.length >= 5;
    }
}

class User {
    constructor(firstName, lastName, cardNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.cardNumber = cardNumber;
        this.books = [];
    }

    getBook(isbn) {
        this.books.push(isbn);
    }

    returnBook(isbn) {
        this.books = this.books.filter(b => b !== isbn);
    }
}

class Admin extends User {
    constructor(firstName, lastName, cardNumber) {
        super(firstName, lastName, cardNumber);
        this.isAdmin = true;
    }
}

class Library {
    constructor() {
        this.books = this.loadData("books.json");
        this.users = this.loadData("users.json");
    }

    loadData(file) {
        try {
            return JSON.parse(fs.readFileSync(file));
        } catch {
            return [];
        }
    }

    saveData(file, data) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    }

    addBook(title, author, isbn, amount) {
        try {
            let book = this.books.find(b => b.isbn === isbn);

            if (book) {
                book.total += amount;
                book.available += amount;
            } else {
                const newBook = {
                    id: this.books.length + 1,
                    title,
                    author,
                    isbn,
                    total: amount,
                    available: amount
                };
                this.books.push(newBook);
            }

            this.saveData("books.json", this.books);
            console.log("Книга добавлена");
        } catch (e) {
            console.log("Ошибка:", e.message);
        }
    }

    findBook(isbn) {
        const book = this.books.find(b => b.isbn === isbn);
        if (!book) return console.log("Книга не найдена");
        console.log(book);
    }

    delBook(isbn) {
        this.books = this.books.filter(b => b.isbn !== isbn);
        this.saveData("books.json", this.books);
        console.log("Книга удалена");
    }

    addUser(firstName, lastName, cardNumber) {
        this.users.push(new User(firstName, lastName, cardNumber));
        this.saveData("users.json", this.users);
        console.log("Пользователь добавлен");
    }

    issueBook(isbn, cardNumber) {
        try {
            const book = this.books.find(b => b.isbn === isbn);
            const user = this.users.find(u => u.cardNumber === cardNumber);

            if (!book) throw new Error("Книга не найдена");
            if (!user) throw new Error("Пользователь не найден");
            if (book.available <= 0) throw new Error("Нет доступных экземпляров");

            book.available--;
            user.books.push(isbn);

            this.saveData("books.json", this.books);
            this.saveData("users.json", this.users);

            console.log("Книга выдана");
        } catch (e) {
            console.log("Ошибка:", e.message);
        }
    }

    returnBook(isbn, cardNumber) {
        try {
            const book = this.books.find(b => b.isbn === isbn);
            const user = this.users.find(u => u.cardNumber === cardNumber);

            if (!book || !user) throw new Error("Ошибка данных");

            book.available++;
            user.books = user.books.filter(b => b !== isbn);

            this.saveData("books.json", this.books);
            this.saveData("users.json", this.users);

            console.log("Книга возвращена");
        } catch (e) {
            console.log("Ошибка:", e.message);
        }
    }

    getBooks() {
        console.log(this.books);
    }

    getUsers() {
        console.log(this.users);
    }
}

const lib = new Library();

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case "addBook":
        lib.addBook(args[1], args[2], args[3], Number(args[4]));
        break;
    case "findBook":
        lib.findBook(args[1]);
        break;
    case "delBook":
        lib.delBook(args[1]);
        break;
    case "addUser":
        lib.addUser(args[1], args[2], args[3]);
        break;
    case "issueBook":
        lib.issueBook(args[1], args[2]);
        break;
    case "returnBook":
        lib.returnBook(args[1], args[2]);
        break;
    case "listBooks":
        lib.getBooks();
        break;
    case "listUsers":
        lib.getUsers();
        break;
    default:
        console.log("Неизвестная команда");
}

/*команды:
Найти книгу node library.js findBook ISBN 
Добавить книгу node library.js addBook "Название" Автор ISBN Количество
удалить node library.js delBook ISBN
показать все книги node library.js listBooks
Добавить пользователя node library.js addUser Имя Фамилия НомерКарты
Показать всех пользователей node library.js listUsers
Выдать книгу node library.js issueBook ISBN НомерКарты
Вернуть книгу node library.js returnBook ISBN НомерКарты


Пример полного сценраия работы программы(тестирование)
node library.js addBook "1984" Оруэлл 11111 5
node library.js addUser Плотников Егор U1
node library.js issueBook 11111 U1
node library.js listBooks
node library.js listUsers
node library.js returnBook 11111 U1
node library.js findBook 11111
*/ 