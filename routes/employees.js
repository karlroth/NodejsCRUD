"use strict";
var express = require('express');
var router = express.Router();
var client = require('../db/index');
var logger = require('../util/log');
var crypto = require('crypto');


function deliver(res, message, data) {
    res.status(200).json({
        "status": "success",
        "message": message,
        "data": data
    })
}

// taken from https://ciphertrick.com/ 
var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

var genHash = function (password, salt) {
   
    var hash = crypto.createHmac('sha512', salt);

    hash.update(password);
    var value = hash.digest('hex');
    return {
        password: value,
        salt: salt
    };
}

/* POST Register user */
router.post('/register', (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    
    var hashed = genHash(password, genRandomString(10));

    client.query("INSERT INTO EMP_DTL (email, password, salt) values ($1,$2,$3)", [email, hashed.password, hashed.salt])
        .then((result, error) => {
            deliver(res, "created employee", result.rows[0]);
        }).catch(function (error) {
            if (error.message.toString() === "duplicate key value violates unique constraint \"emp_dtl_email_key\"") {
                var error = new Error("User already exists");
                error.status = 807;
                next(error);
            } else {
                logger.log({
                    level: 'info',
                    message: error.message
                });
            }
        });

});

/* GET login user */
router.post('/login', (req,res,next) =>{
    var email = req.body.email;
    var password = req.body.password;

    client.query("SELECT * FROM EMP_DTL WHERE email=$1",[email])
        .then((result) => {
            var givenHash = genHash(password, result.rows[0].salt);
            logger.log({
                level:'info',
                message:"Actual: "+result.rows[0].password+"\n Given: "+givenHash.password 
            })
            if(givenHash.password === result.rows[0].password) {
                deliver(res,"Logged in user");
            } else {
                var error = new Error("Email and password do not match");
                error.status = 809;
                next(error);
            }
        })
        .catch(function(error) {
            logger.log({
                level:'info',
                message: error.message
            })
        })
})

/* GET all users */
router.get('/list', (req, res, next) => {
    client.query("SELECT * FROM EMP_DTL")
        .then((result) => {
            logger.log({
                level: 'info',
                message: 'Get List'
            })

            deliver(res, "recieved employees", result.rows);
        }).catch(function (error) {
            logger.log({
                level: 'info',
                message: error.message
            });
        });
});

/* GET one user */
router.get('/find/:email', (req, res, next) => {
    client.query("SELECT * FROM EMP_DTL WHERE email=$1", [req.params.email])
        .then((result) => {
            if (result.rows.length == 0) {
                var error = new Error("User not found");
                error.status = 804;
                next(error);
            } else {
                deliver(res, "recieved employee", result.rows);
            }
        }).catch(function (error) {
            logger.log({
                level: 'info',
                message: error.message
            });
        });
});

/* POST create a user */
router.post('/create', (req, res, next) => {

    var name = req.body.name;
    var email = req.body.email;

    client.query("INSERT INTO EMP_DTL (name,email) VALUES ($1,$2)", [name, email])
        .then((result, error) => {
            deliver(res, "created employee", result.rows[0]);
        }).catch(function (error) {
            if (error.message.toString() === "duplicate key value violates unique constraint \"emp_dtl_email_key\"") {
                var error = new Error("User already exists");
                error.status = 807;
                next(error);
            } else {
                logger.log({
                    level: 'info',
                    message: error.message
                });
            }
        });
})

/* PUT update a user */
router.put('/update', (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;

    client.query("UPDATE EMP_DTL SET name=$1 WHERE email=$2", [name, email])
        .then(() => {
            deliver(res, "updated employee");
        }).catch(function (error) {
            logger.log({
                level: 'info',
                message: error.message
            });
        });
})

/* DELETE a user  */
router.delete('/delete', (req, res, next) => {
    var email = req.body.email;
    client.query("DELETE FROM EMP_DTL WHERE email=$1", [email])
        .then(() => {
            deliver(res, "deleted employee");
        }).catch(function (error) {
            logger.log({
                level: 'info',
                message: error.message
            });
        });
})

module.exports = router;
