const mysql = require('mysql');
const co = require('co-mysql');
const {DB_HOST,DB_PORT,DB_USER,DB_PASS,DB_NAME} = require('../config');
const config = {
    host:DB_HOST,
    port:DB_PORT,
    user:DB_USER,
    password:DB_PASS,
    database:DB_NAME
}
let pool = mysql.createPool(config);
module.exports = co(pool);