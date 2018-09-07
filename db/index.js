const { Client } = require('pg');
//console.log("DB_HOST: ", process.env.DB_HOST);
const client = new Client({
    host: 'localhost',
    user: 'postgres',
    database: 'EMP_MASTER',
    password: 'root',
    port: 5432
});

client.connect();

module.exports = client;
