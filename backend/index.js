var express = require('express');
const path = require('path')
var app = express();
app.use(express.static('public'));

// creating a client
require('dotenv').config({path: path.resolve(__dirname+"/.env")});
const { Client } = require('pg')

const db_client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PSWD,
  port: process.env.DB_PORT,
});

(async () => {
  await db_client.connect()
})()

const get_matches = require('./get_matches');
app.get('/matches', function (request, response) {
  get_matches(db_client, request, response);
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
