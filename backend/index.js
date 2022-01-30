var express = require('express');
var cors = require('cors');
const path = require('path')
var app = express();
app.use(express.static('public'));

// allowing cors

var corsOptions = function (req, res, next) {
	var whitelist = [
		process.env.FRONTEND_URL,
	];
	var origin = req.headers.origin;

	if (whitelist.indexOf(origin) > -1) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
}
app.use(corsOptions);

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

const get_matches = require('./matches/get_matches');
app.get('/matches', function (request, response) {
  get_matches(db_client, request, response);
})

const get_scorecard = require('./matches_match_id/get_scorecard');
app.get('/matches/scorecard/:match_id', function (request, response) {
  get_scorecard(db_client, request, response);
})

const get_score_comparison = require('./matches_match_id/get_score_comparison');
app.get('/matches/score_comparison/:match_id', function (request, response) {
  get_score_comparison(db_client, request, response);
})

const get_match_summary = require('./matches_match_id/get_match_summary.js');
app.get('/matches/match_summary/:match_id', function (request, response) {
  get_match_summary(db_client, request, response);
})

const get_pie_chart = require('./matches_match_id/get_pie_chart.js');
app.get('/matches/pie_chart/:match_id', function (request, response) {
  get_pie_chart(db_client, request, response);
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
