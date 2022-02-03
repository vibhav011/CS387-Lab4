function get_venue_first_innings(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var venue_id = parseInt(request.params.venue_id);
    if (!venue_id) {
      response.status(400).json({ error: 'venue_id must be an integer' })
      return
    }

    const query = 'select season_year, round(avg(match_runs), 2) as avg_innings_runs from \
    (select match.match_id, sum(runs_scored+extra_runs) as match_runs, season_year from ball_by_ball, match where match.match_id = ball_by_ball.match_id and venue_id = $1 and innings_no = 1 group by match.match_id) mr \
    where season_year <= 2018 and season_year >= 2011 and mod(season_year, 2) = 1 group by season_year order by season_year'

    db_client.query(query, [venue_id], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else if (res.rows.length === 0) {
        response.status(404).json({ error: 'No matching venue found' })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}
  
module.exports = get_venue_first_innings;
