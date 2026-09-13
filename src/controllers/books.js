import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
  bookExists,
} from "../models/books.js";

// GET /books
const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error("GET /books failed:", error.message);
    return res.status(500).json({ error: "Unable to retrieve books" });
  }
};

// GET /books/:id
const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error("GET /books/:id failed:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /books
const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body;
    // Check if required fields are missing
    if (!id || !authorId || !title || !publicationDate) {
      return res.status(400).json({
        error:
          "Missing required fields. id, authorId, title, and publicationDate are required.",
      });
    }
    // Check if book with the same ID already exists
    const existingBook = await bookExists(id);
    if (existingBook) {
      return res
        .status(400)
        .json({ error: "Book with the same ID already exists." });
    }
    // Check if the author exists
    const author = await authorExists(authorId);
    if (!author) {
      return res.status(400).json({ error: "Author not found" });
    }
    const newBook = {
      id,
      authorId,
      title,
      publicationDate,
    };
    await createBook(newBook);
    return res.status(201).json(newBook);
  } catch (error) {
    console.error("POST /books failed:", error.message);
    return res.status(500).json({ error: "Unable to create book" });
  }
};

// PUT /books/:id
const updateBookHandler = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { authorId, title, publicationDate } = req.body;
    // Check if required fields are missing
    if (!authorId || !title || !publicationDate) {
      return res.status(400).json({
        error:
          "Missing required fields. authorId, title, and publicationDate are required.",
      });
    }
    // Check if the book exists
    const existingBook = await bookExists(bookId);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    // check if the author exists
    const author = await authorExists(authorId);
    if (!author) {
      return res.status(400).json({ error: "Author not found" });
    }

    const updatedBook = {
      id: bookId,
      authorId,
      title,
      publicationDate,
    };

    await updateBook(bookId, updatedBook);

    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error("PUT /books/:id failed:", error.message);
    return res.status(500).json({ error: "Unable to update book" });
  }
};

// DELETE /books/:id
const deleteBookHandler = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    // check if the book exists
    const existingBook = await bookExists(bookId);
    if (!existingBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    await deleteBook(bookId);
    return res.status(204).send(); // No content
  } catch (error) {
    console.error("DELETE /books/:id failed:", error.message);
    return res.status(500).json({ error: "Unable to delete book" });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
