import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
  const books = await getDb().collection("books").find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const book = await getDb().collection("books").findOne({ id: bookId });
  return book;
};

const createBook = async (book) => {
  const newBook = await getDb().collection("books").insertOne(book);
  return newBook;
};

const updateBook = async (bookId, book) => {
  const updatedBook = await getDb()
    .collection("books")
    .updateOne({ id: bookId }, { $set: book });
  return updatedBook;
};

const deleteBook = async (bookId) => {
  const deletedBook = await getDb()
    .collection("books")
    .deleteOne({ id: bookId });
  return deletedBook;
};

const authorExists = async (authorId) => {
  const author = await getDb().collection("authors").findOne({ id: authorId });
  return author !== null;
};

const bookExists = async (bookId) => {
  const book = await getDb().collection("books").findOne({ id: bookId });
  return book !== null;
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
  bookExists,
};
