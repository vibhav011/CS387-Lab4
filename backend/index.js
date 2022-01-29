var express = require('express');
var app = express();

app.use(express.static('public'));

// creating a pool
const { Client} = require('pg')
const db_client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'lab2db',
  password: '',
  port: 5432,
})

;(async () => {
await db_client.connect()
})()
