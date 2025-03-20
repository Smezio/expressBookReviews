const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if(!users.find(value=>value.username === username))
    return false;
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(value=>value.username === username);
  if(user.username !== username || user.password !== password)
    return false;
  return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!isValid(username) || !authenticatedUser(username, password))
    return res.status(401).json({message: "Authentication failed"});

  const token = jwt.sign({username}, "access", {expiresIn: '5m'});
  req.session.authentization = {
    token, username
  }
  return res.status(200).json(token);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.user;

  books[isbn]['reviews'][username.username] = review;

  return res.status(200).json(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  
  delete books[isbn]['reviews'][username];
  return res.status(200).json(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
