function get_matches(db_client, request, response) { // request and response are parts of the http get method
var ret_json = null
const matches_query = 'SELECT match_id, (SELECT team_name from team where team_id = team1) team1_name,\
                     (SELECT team_name from team where team_id = team2) team2_name, venue_name, \
                     city_name, (SELECT team_name from team where team_id = match_winner) winner FROM \
                     venue, match where venue.venue_id = match.venue_id order by season_year desc \
                   offset $1 rows fetch next $2 rows only'
db_client.query(matches_query, [request.query.skip, request.query.limit], (err, res) => {
    console.log(err)
    ret_json = JSON.stringify(res['rows'])
  })
return ret_json
}
