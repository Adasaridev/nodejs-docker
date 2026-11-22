/**var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  res.write('** Hey my app was deployed :) **'); //write a response to the client
  res.end(); //end the response
}).listen(80); //the server object listens on port 80**/



const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory book database
let books = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", available: true },
    { id: 2, title: "Atomic Habits", author: "James Clear", available: true },
    { id: 3, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", available: false }
];

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Node.js Library Management App!");
});

// Get all books
app.get("/books", (req, res) => {
    res.json(books);
});

// Get book by ID
app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
});

// Add new book
app.post("/books", (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            message: "Title and author are required"
        });
    }

    const newBook = {
        id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title,
        author,
        available: true
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// Update book
app.put("/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, available } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (available !== undefined) book.available = available;

    res.json({
        message: "Book updated successfully",
        book
    });
});

// Delete book
app.delete("/books/:id", (req, res) => {
    const index = books.findIndex(b => b.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Search books
app.get("/search", (req, res) => {
    const query = (req.query.title || "").toLowerCase();

    const results = books.filter(book =>
        book.title.toLowerCase().includes(query)
    );

    res.json(results);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Library app running on port ${PORT}`);
});

