# CSE341 Week 02 Books API

## Specification — Version 2

ChatGPT helped with this spec sheet

---

# Feature 1: Book CRUD Operations and Author References

## Goal

Update the existing Week 01 Books API so that book documents include a reference to an author and the API supports all CRUD operations for books.

Every book route must be documented and testable in Swagger.

The completed API must work both locally and on the deployed Render application. The deployed Swagger page at `/api-docs` must allow users to test every book route from the browser.

---

## Data Model

Book documents will be stored in the `books` collection.

Each book must contain the following fields:

| Field             | Type   | Required | Description                               |
| ----------------- | ------ | -------- | ----------------------------------------- |
| `id`              | string | Yes      | Custom unique ID such as `b1`             |
| `authorId`        | string | Yes      | References the `id` of an existing author |
| `title`           | string | Yes      | Title of the book                         |
| `publicationDate` | string | Yes      | Publication date in `YYYY-MM-DD` format   |

Books will continue to use custom string IDs instead of MongoDB `_id` values for route parameters.

The custom `id` must be unique within the `books` collection.

### Example Book

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Example Book",
  "publicationDate": "2026-01-15"
}
```

---

## Book and Author Relationship

Each book must identify its author using the `authorId` field.

The value of `authorId` must match the custom `id` field of an existing author document in the `authors` collection.

When creating or updating a book, the API must verify that the submitted `authorId` exists in the `authors` collection.

If the author does not exist, the request must be rejected with a `400` status code.

A book cannot be created or updated with an invalid `authorId`.

---

## Book Validation

The API must validate book data before performing the database operation.

The API must reject a request when:

- A required field is missing.
- A required string field is empty.
- A field has an incorrect data type.
- The book `id` already exists.
- The specified `authorId` does not match an existing author.
- The `publicationDate` is not in `YYYY-MM-DD` format.

The custom book `id` is immutable. A PUT request must not change the book's `id`.

---

# GET /books

## Purpose

Return all books.

### Success

**Status Code:** `200`

### Response

The response body will be an array of book objects.

```json
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Example Book",
    "publicationDate": "2026-01-15"
  },
  {
    "id": "b2",
    "authorId": "a2",
    "title": "Another Book",
    "publicationDate": "2025-05-10"
  }
]
```

### Error

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# GET /books/:id

## Purpose

Return one book using its custom `id`.

### Success

**Status Code:** `200`

### Response

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Example Book",
  "publicationDate": "2026-01-15"
}
```

### Errors

**Status Code:** `404`

Returned when no book exists with the specified ID.

```json
{
  "error": "Book with id 'b99' not found."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# POST /books

## Purpose

Create a new book.

### Request Body

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

### Validation

Before creating the book, the API must:

1. Verify all required fields are present.
2. Verify required fields contain valid string values.
3. Verify the publication date uses `YYYY-MM-DD` format.
4. Verify the custom book ID does not already exist.
5. Verify that the submitted `authorId` matches an existing author.

### Success

**Status Code:** `201`

### Response

The response body will contain the newly created book.

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

### Errors

**Status Code:** `400`

Returned if a required field is missing or invalid.

```json
{
  "error": "Required field 'title' is missing."
}
```

**Status Code:** `400`

Returned if the book ID already exists.

```json
{
  "error": "Book with id 'b4' already exists."
}
```

**Status Code:** `400`

Returned if the specified author does not exist.

```json
{
  "error": "Author with id 'a99' does not exist."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# PUT /books/:id

## Purpose

Update an existing book.

The book's custom `id` is supplied through the route parameter and cannot be changed through a PUT request.

### Request Body

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

### Validation

Before updating the book, the API must:

1. Verify that the book exists.
2. Verify all required update fields are present.
3. Verify required fields contain valid values.
4. Verify the publication date uses `YYYY-MM-DD` format.
5. Verify that the submitted `authorId` matches an existing author.

### Success

**Status Code:** `200`

### Response

The response body will contain the updated book.

```json
{
  "id": "b1",
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

### Errors

**Status Code:** `400`

Returned when a required field is missing or invalid.

```json
{
  "error": "Required field 'title' is missing."
}
```

**Status Code:** `400`

Returned when the specified author does not exist.

```json
{
  "error": "Author with id 'a99' does not exist."
}
```

**Status Code:** `404`

Returned when no book exists with the specified ID.

```json
{
  "error": "Book with id 'b99' not found."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# DELETE /books/:id

## Purpose

Delete an existing book using its custom `id`.

### Success

**Status Code:** `204`

No response body will be returned.

### Errors

**Status Code:** `404`

Returned when no book exists with the specified ID.

```json
{
  "error": "Book with id 'b99' not found."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# Swagger Documentation for Books

Swagger must document every book route:

- `GET /books`
- `GET /books/:id`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`

Swagger documentation must include:

- Route parameters.
- Request bodies where applicable.
- Successful response status codes.
- Error response status codes.
- Response examples or schemas.

Every book route must be testable using Swagger's **Try it out** functionality.

---

# Feature 2: Author CRUD Operations

## Goal

Create an Authors API that supports all CRUD operations for authors.

Every author route must be documented and testable in Swagger.

The completed API must work both locally and on the deployed Render application.

---

## Data Model

Author documents will be stored in the `authors` collection.

Each author must contain the following fields:

| Field        | Type   | Required | Description                         |
| ------------ | ------ | -------- | ----------------------------------- |
| `id`         | string | Yes      | Custom unique ID such as `a1`       |
| `firstName`  | string | Yes      | Author's first name                 |
| `middleName` | string | No       | Author's middle name; may be `null` |
| `lastName`   | string | Yes      | Author's last name                  |
| `birthYear`  | string | Yes      | Four-digit birth year               |

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

The custom `id` must be unique within the `authors` collection.

### Example Author

```json
{
  "id": "a1",
  "firstName": "Robert",
  "middleName": null,
  "lastName": "Jordan",
  "birthYear": "1948"
}
```

---

## Author Validation

The API must validate author data before performing database operations.

The API must reject a request when:

- A required field is missing.
- A required string field is empty.
- A field has an incorrect data type.
- The author `id` already exists.
- `birthYear` is not a four-digit year.

The `middleName` field is optional and may contain a string or `null`.

The custom author `id` is immutable. A PUT request must not change the author's `id`.

---

## Author and Book Relationship

Books reference authors through the book's `authorId` field.

For example:

```text
Author
  id: "a1"
      ↑
      │
      │ authorId: "a1"
      │
Book
  id: "b1"
```

An author cannot be deleted if one or more books reference that author's `id`.

The API must check the `books` collection before deleting an author.

If books reference the author:

- The author must not be deleted.
- The related books must remain unchanged.
- The API must return a `400` status code.

---

# GET /authors

## Purpose

Return all authors.

### Success

**Status Code:** `200`

### Response

The response body will be an array of author objects.

```json
[
  {
    "id": "a1",
    "firstName": "Robert",
    "middleName": null,
    "lastName": "Jordan",
    "birthYear": "1948"
  },
  {
    "id": "a2",
    "firstName": "Jane",
    "middleName": "Marie",
    "lastName": "Smith",
    "birthYear": "1975"
  }
]
```

### Error

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# GET /authors/:id

## Purpose

Return one author using the author's custom `id`.

### Success

**Status Code:** `200`

### Response

```json
{
  "id": "a1",
  "firstName": "Robert",
  "middleName": null,
  "lastName": "Jordan",
  "birthYear": "1948"
}
```

### Errors

**Status Code:** `404`

Returned when no author exists with the specified ID.

```json
{
  "error": "Author with id 'a99' not found."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# POST /authors

## Purpose

Create a new author.

### Request Body

```json
{
  "id": "a3",
  "firstName": "Robert",
  "middleName": null,
  "lastName": "Jordan",
  "birthYear": "1948"
}
```

### Validation

Before creating the author, the API must:

1. Verify all required fields are present.
2. Verify required fields contain valid string values.
3. Verify `birthYear` contains a four-digit year.
4. Verify the custom author ID does not already exist.

### Success

**Status Code:** `201`

### Response

The response body will contain the newly created author.

```json
{
  "id": "a3",
  "firstName": "Robert",
  "middleName": null,
  "lastName": "Jordan",
  "birthYear": "1948"
}
```

### Errors

**Status Code:** `400`

Returned if a required field is missing or invalid.

```json
{
  "error": "Required field 'firstName' is missing."
}
```

**Status Code:** `400`

Returned if the author ID already exists.

```json
{
  "error": "Author with id 'a3' already exists."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# PUT /authors/:id

## Purpose

Update an existing author.

The author's custom `id` is supplied through the route parameter and cannot be changed through a PUT request.

### Request Body

```json
{
  "firstName": "Robert",
  "middleName": null,
  "lastName": "Jordan",
  "birthYear": "1948"
}
```

### Validation

Before updating the author, the API must:

1. Verify that the author exists.
2. Verify all required fields are present.
3. Verify required fields contain valid values.
4. Verify `birthYear` contains a four-digit year.
5. Preserve the existing author `id`.

### Success

**Status Code:** `200`

### Response

```json
{
  "id": "a3",
  "firstName": "Robert",
  "middleName": null,
  "lastName": "Jordan",
  "birthYear": "1948"
}
```

### Errors

**Status Code:** `400`

Returned when a required field is missing or invalid.

```json
{
  "error": "Required field 'lastName' is missing."
}
```

**Status Code:** `404`

Returned when no author exists with the specified ID.

```json
{
  "error": "Author with id 'a99' not found."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# DELETE /authors/:id

## Purpose

Delete an existing author.

An author may only be deleted if no books reference that author.

### Relationship Check

Before deleting an author, the API must check whether any book contains the author's ID in its `authorId` field.

For example:

```json
{
  "id": "b1",
  "authorId": "a3",
  "title": "Example Book",
  "publicationDate": "2026-01-15"
}
```

If a book references author `a3`, the author must not be deleted.

The related books must remain unchanged.

### Successful Deletion

**Status Code:** `204`

No response body will be returned.

### Errors

**Status Code:** `400`

Returned when one or more books reference the author.

```json
{
  "error": "Author with id 'a3' cannot be deleted because books reference this author."
}
```

The author and all related books must remain unchanged.

**Status Code:** `404`

Returned when no author exists with the specified ID.

```json
{
  "error": "Author with id 'a99' not found."
}
```

**Status Code:** `500`

Returned when an unexpected server or database error occurs.

```json
{
  "error": "Internal server error."
}
```

---

# Swagger Documentation for Authors

Swagger must document every author route:

- `GET /authors`
- `GET /authors/:id`
- `POST /authors`
- `PUT /authors/:id`
- `DELETE /authors/:id`

Swagger documentation must include:

- Route parameters.
- Request bodies where applicable.
- Successful response status codes.
- Error response status codes.
- Response examples or schemas.

Every author route must be testable using Swagger's **Try it out** functionality.

---

# Security and Data Integrity Considerations

The API implementation should follow these requirements:

1. Validate request-body data before performing database operations.
2. Ensure IDs are treated as strings.
3. Prevent duplicate custom IDs.
4. Verify that an `authorId` exists before creating or updating a book.
5. Prevent deletion of an author who is referenced by a book.
6. Do not automatically delete books when an author is deleted.
7. Do not expose MongoDB errors, database connection information, or server stack traces to API clients.
8. Return a consistent JSON error format.
9. Do not allow clients to modify custom IDs through PUT requests.
10. Use efficient database queries when checking whether related documents exist.

The API should return detailed error information to the client when appropriate without exposing sensitive server or database information.

---

# Standard Error Response

Unless otherwise specified, API errors should use the following structure:

```json
{
  "error": "Description of the problem."
}
```

This provides a consistent format for clients and makes the API easier to test through Swagger.

---

# Database Efficiency

The API should avoid retrieving unnecessary documents when checking relationships.

For example, when determining whether an author can be deleted, the API only needs to determine whether at least one book references the author.

The implementation should perform an existence check rather than retrieving every related book.

If appropriate, an index may be created on `books.authorId` to improve relationship lookups as the collection grows.

---

# Deployment Requirements

After implementation, all API routes must work:

1. On the local development server.
2. On the deployed Render application.
3. Through the deployed Swagger page at `/api-docs`.

The deployed Swagger page must allow a user to test every book and author route using **Try it out**.

---

# Version 2 Implementation Checklist

## Books

- [ ] Books are stored in the `books` collection.
- [ ] Books contain `id`.
- [ ] Books contain `authorId`.
- [ ] Books contain `title`.
- [ ] Books contain `publicationDate`.
- [ ] Book IDs are custom strings.
- [ ] Book IDs are unique.
- [ ] `GET /books` works.
- [ ] `GET /books/:id` works.
- [ ] `POST /books` works.
- [ ] `PUT /books/:id` works.
- [ ] `DELETE /books/:id` works.
- [ ] Required book fields are validated.
- [ ] Empty required fields are rejected.
- [ ] Invalid data types are rejected.
- [ ] Invalid publication dates are rejected.
- [ ] Duplicate book IDs are rejected.
- [ ] Invalid `authorId` values are rejected.
- [ ] Book IDs cannot be changed with PUT.
- [ ] Correct success status codes are returned.
- [ ] Correct error status codes are returned.
- [ ] Error responses use the standard JSON format.
- [ ] All book routes are documented in Swagger.
- [ ] All book routes can be tested in Swagger.
- [ ] Book routes work locally.
- [ ] Book routes work on Render.
- [ ] Book routes can be tested through deployed Swagger.

## Authors

- [ ] Authors are stored in the `authors` collection.
- [ ] Authors contain `id`.
- [ ] Authors contain `firstName`.
- [ ] Authors may contain `middleName`.
- [ ] Authors contain `lastName`.
- [ ] Authors contain `birthYear`.
- [ ] Author IDs are custom strings.
- [ ] Author IDs are unique.
- [ ] `GET /authors` works.
- [ ] `GET /authors/:id` works.
- [ ] `POST /authors` works.
- [ ] `PUT /authors/:id` works.
- [ ] `DELETE /authors/:id` works.
- [ ] Required author fields are validated.
- [ ] Empty required fields are rejected.
- [ ] Invalid data types are rejected.
- [ ] Invalid birth years are rejected.
- [ ] Duplicate author IDs are rejected.
- [ ] Author IDs cannot be changed with PUT.
- [ ] Authors referenced by books cannot be deleted.
- [ ] Related books remain unchanged when an author deletion is rejected.
- [ ] Correct success status codes are returned.
- [ ] Correct error status codes are returned.
- [ ] Error responses use the standard JSON format.
- [ ] All author routes are documented in Swagger.
- [ ] All author routes can be tested in Swagger.
- [ ] Author routes work locally.
- [ ] Author routes work on Render.
- [ ] Author routes can be tested through deployed Swagger.
