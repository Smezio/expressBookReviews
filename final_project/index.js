const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const users = require('./router/auth_users.js').users

const requests = require('./router/general.js').requests;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(req.headers) {
        let token = req.headers['accesstoken'];
        jwt.verify(token, "access", (err, user) => {
            if(err) {
                return res.status(403).json({message: 'User not authenticated'});                
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    else {
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));


requests.getAllBooks('http://localhost:5000/');
requests.getBookByISBN('http://localhost:5000/1');
requests.getBooksOfAuthor('http://localhost:5000/Unknown');
requests.getBookByTitle('http://localhost:5000/Fairy+tales');