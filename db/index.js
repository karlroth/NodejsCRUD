const { Client } = require('pg');

const client = new Client({
    host:'localhost',
    user:'postgres',
    database:'EMP_MASTER',
    password:'root',
    port:5432
});

client.connect();

module.exports = client;
