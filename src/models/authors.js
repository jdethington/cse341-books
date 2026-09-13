import { getDb } from "../db/connect.js";

const getAllAuthors = async () => {
  const authors = await getDb().collection("authors").find({}).toArray();
  return authors;
};

const getAuthorById = async (id) => {
  const author = await getDb().collection("authors").findOne({ id: id });
  return author;
};

const createAuthor = async (author) => {
  const newAuthor = await getDb().collection("authors").insertOne(author);
  return newAuthor;
};

const updateAuthor = async (id, author) => {
  const updatedAuthor = await getDb()
    .collection("authors")
    .updateOne({ id: id }, { $set: author });
  return updatedAuthor;
};

const deleteAuthor = async (id) => {
  const deletedAuthor = await getDb().collection("authors").deleteOne({ id: id });
  return deletedAuthor;
};

const authorHasBooks = async (authorId) => {
  const book = await getDb().collection("books").findOne({ authorId: authorId });

  return book !== null;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
};
