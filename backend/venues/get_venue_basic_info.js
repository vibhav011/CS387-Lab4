function get_venue_basic_info(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var venue_id = parseInt(request.params.venue_id);
    if (!venue_id) {
      response.status(400).json({ error: 'venue_id must be an integer' })
      return
    }

    const query = 'select venue_name, city_name, country_name, capacity, count(match_id) as total_matches_played, max(total_runs) as highest_total_recorded, min(total_runs) as lowest_total_recorded, max(runs_chased) as highest_score_chased from venue, \
    (select team_1.match_id, team1_runs+1 as runs_chased, team1_runs+team2_runs as total_runs from (select match.match_id, team1, runs as team1_runs from (select player_match.match_id, team_id, sum(runs_scored+extra_runs) as runs from \
    ball_by_ball, player_match where player_match.player_id = striker and \
    ball_by_ball.match_id = player_match.match_id group by player_match.match_id, team_id order by match_id) sq, match where team1 = team_id and match.match_id = sq.match_id and venue_id = $1) team_1, \
    (select match.match_id, team2, runs as team2_runs from (select player_match.match_id, team_id, sum(runs_scored+extra_runs) as runs from ball_by_ball, player_match where player_match.player_id = striker and \
    ball_by_ball.match_id = player_match.match_id group by player_match.match_id, team_id order by match_id) sq2, match where team2 = team_id and match.match_id = sq2.match_id and venue_id = $1 ) team_2 where \
    team_1.match_id = team_2.match_id) \
    subquery where venue.venue_id  = $1 group by venue_id'

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
  
module.exports = get_venue_basic_info;