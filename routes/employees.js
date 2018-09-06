var express = require('express');
var router = express.Router();
var client = require('../db/index');
var logger = require('../util/log');

function deliver(res, message, data) {
    res.status(200).json({
        "status": "success",
        "message": message,
        "data": data
    })
}

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
                level: 'error',
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
                level: 'error',
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
                    level: 'error',
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
                level: 'error',
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
                level: 'error',
                message: error.message
            });
        });
})

module.exports = router;
