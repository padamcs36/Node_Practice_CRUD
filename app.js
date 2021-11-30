const express = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')

const app = express();
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'akd'
});

//Get Record from Login Table
app.get('/api', (req, res) => {
    const query = 'select * from login;'
    conn.query(query, (err, result) => {
        res.send(result)
    });
});

//verifyToken
app.post("/api/post", verifyToken, (req, res) => {
    jwt.verify(req.token, 'padam@123', (err, authData) => {
        console.log(authData);
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: "Post Created..",
                authData
            });
        }
    });
});

// This Post Request gives the Token Address or Just Like a Password For authentication of token.
app.post('/api/login', (req, res) => {
    //Mock User other takes user data from database
    const query = 'select id, username, email from login;'
    conn.query(query, (err, result) => {
        // const user = JSON.parse(result)
        console.log(result);
        jwt.sign({ user: result }, 'padam@123', (err, token) => {
            // if (token) {
            //     const query = `insert into login(token) values (?)`;
            //     conn.query(query, [token], (err, result) => {
            //         console.log(result);
            //     })
            // }
            res.json({
                token: token
            });
        });

    });
});


// const query = `insert into login(token) values ?`;
// conn.query(query, [token], (err, result) => {
//     console.log(result);
// })
//Format of Token
// Authorization: Bearer <access-token>

//verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}


app.listen(9000, () => {
    console.log("Server Running on 9000 Port...");
});

//Hello World.