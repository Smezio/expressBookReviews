const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  console.log(req.body);
  console.log(username + "  " + password);
  if(username == null || password == null)
    return res.status(300).json({message: "Invalid credentials"});
  
  if(users.find(value=>value.username === username))
    return res.status(300).json({message: "User already exists"});

  users.push({username: username, password: password});
  return res.status(200).json({message: `User ${username} registered`}); 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book)
    return res.status(200).json(book);
  else
    return res.status(404).json({message: "Book doesn't exists"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  if(author)
    author = author.replaceAll('+', ' ');
  
  const authBooks = [];

  for(const isbn in books) {
    if(books[isbn].author === author)
      authBooks.push(books[isbn]);
  }
  return res.status(200).json(authBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  if(title)
    title = title.replaceAll('+', ' ');

  let book = {}
  console.log(title);
  for(const isbn in books) {
    if(books[isbn].title === title)
      book = books[isbn];
  }

  return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
