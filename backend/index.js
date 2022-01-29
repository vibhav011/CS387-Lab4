var express = require('express');
var app = express();

app.use(express.static('public'));

// creating a pool
const { Pool} = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'lab2db',
  password: 'common_password',
  port: 5432,
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// url'matches'- B1
const matches_query = 'SELECT match_id, (SELECT team_name from team where team_id = team1) team1_name,\
                     (SELECT team_name from team where team_id = team2) team2_name, venue_name, \
                     city_name, (SELECT team_name from team where team_id = match_winner) winner FROM \
                     venue, match where venue.venue_id = match.venue_id order by season_year desc \
                    ' //  offset $1 rows fetch next 10 rows only

var matches_response = null
;(async () => {
  matches_client = await pool.connect()
  try {
    const result = await matches_client.query(matches_query)
    matches_response = result.rows
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    matches_client.release()
  }
})().catch(err => console.log(err.stack))

app.get('/matches', function (req, res) {
  var start = parseInt(req.query.skip ? req.query.skip : 0)
  var end = start + parseInt(req.query.limit ? req.query.limit : 10)
  console.log(start)
  console.log(end)
  res.end(JSON.stringify(matches_response.slice(start, end)));
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})

;(async () => {
  await pool.end()
  console.log('pool has drained')
})()
