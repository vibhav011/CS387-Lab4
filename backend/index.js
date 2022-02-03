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

const get_player_basic_info = require('./players/get_player_basic_info.js');
app.get('/players/basic_info/:player_id', function (request, response) {
  get_player_basic_info(db_client, request, response);
})

const get_batting_stats = require('./players/get_batting_stats.js');
app.get('/players/batting_stats/:player_id', function (request, response) {
  get_batting_stats(db_client, request, response);
})

const get_batting_graph = require('./players/get_batting_graph.js');
app.get('/players/batting_graph/:player_id', function (request, response) {
  get_batting_graph(db_client, request, response);
})

const get_bowling_stats = require('./players/get_bowling_stats.js');
app.get('/players/bowling_stats/:player_id', function (request, response) {
  get_bowling_stats(db_client, request, response);
})

const get_bowling_graph = require('./players/get_bowling_graph.js');
app.get('/players/bowling_graph/:player_id', function (request, response) {
  get_bowling_graph(db_client, request, response);
})

const get_pointstable = require('./pointstable/get_pointstable.js');
app.get('/pointstable/:year', function (request, response) {
  get_pointstable(db_client, request, response);
})

const get_venues = require('./venues/get_venues.js');
app.get('/venues', function (request, response) {
  get_venues(db_client, request, response);
})

const get_venue_basic_info = require('./venues/get_venue_basic_info.js');
app.get('/venues/:venue_id', function (request, response) {
  get_venue_basic_info(db_client, request, response);
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
