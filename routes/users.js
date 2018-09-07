var express = require('express');
var router = express.Router();
var client = require('../db/index');
var logger = require('../util/log');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* POST register user to the database */ 
router.post('/register', function(req, res, next) {

})

module.exports = router;
