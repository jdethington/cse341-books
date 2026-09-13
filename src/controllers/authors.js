import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorFromDb,
  updateAuthor as updateAuthorFromDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks as authorHasBooksFromDb,
} from "../models/authors.js";
// GET /authors
const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ error: "Unable to retrieve authors" });
  }
};
// GET /authors/:id
const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ error: "Unable to retrieve author" });
  }
};
// POST /authors
const createAuthor = async (req, res) => {
  try {
    const { id, firstName, lastName, birthYear } = req.body;
    // Check if required fields are missing
    if (!id || !firstName || !lastName || !birthYear) {
      return res.status(400).json({
        error:
          "Missing required fields. id, firstName, lastName, and birthYear are required.",
      });
    }
    // Check if author with the same ID already exists
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res
        .status(400)
        .json({ error: "Author with this ID already exists" });
    }
    const newAuthor = {
      id,
      firstName,
      lastName,
      birthYear,
    };

    await createAuthorFromDb(newAuthor);

    return res.status(201).json(newAuthor);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create author" });
  }
};
// PUT /authors/:id
const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, birthYear } = req.body;
    // Check if required fields are missing
    if (!firstName || !lastName || !birthYear) {
      return res.status(400).json({
        error:
          "Missing required fields. firstName, lastName, and birthYear are required.",
      });
    }
    //   Check if the author exists
    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }
    const updatedAuthor = {
      id,
      firstName,
      lastName,
      birthYear,
    };

    await updateAuthorFromDb(id, updatedAuthor);

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return res.status(500).json({ error: "Unable to update author" });
  }
};
// DELETE /authors/:id
const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    //   Check if the author exists
    const existingAuthor = await getAuthorByIdFromDb(id);

    if (!existingAuthor) {
      return res.status(404).json({ error: "Author not found" });
    }
    // check if the author has any associated books
    const hasBooks = await authorHasBooksFromDb(id);
    if (hasBooks) {
      return res.status(409).json({
        error: "Author cannot be deleted because the author still has books.",
      });
    }

    await deleteAuthorFromDb(id);
    //   204 must not include a response body
    return res.status(204).send();
    // const result = {
    //   message: "Author deleted successfully",
    // };
    // return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Unable to delete author" });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
