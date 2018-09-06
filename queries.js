var pg = require('pg');
var connectionString = "postgres://postgres:root@localhost:5432/EMP_MASTER";

function query(sql, values, cb) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            throw err;
        }
        client.query(sql,values, function(err, result) {
            done();
            cb(err, result);
        })
    })
}

exports.getAllEmployees = function(req,res,next) {
    query("SELECT * FROM EMP_DTL",{},)
}