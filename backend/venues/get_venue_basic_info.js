function get_venue_basic_info(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var venue_id = parseInt(request.params.venue_id);
    if (!venue_id) {
      response.status(400).json({ error: 'venue_id must be an integer' })
      return
    }

    const query = 'select t1.venue_name, t1.city_name, t1.country_name, t1.capacity,  highest_total_recorded, lowest_total_recorded, highest_score_chased, chased from \
    (select venue_name, city_name, country_name, capacity, count(distinct match_id) as total_matches_played, max(innings_runs) as highest_total_recorded, \
   min(innings_runs) as lowest_total_recorded from (select match.match_id, innings_no, sum(runs_scored+extra_runs) as innings_runs from match, \
   ball_by_ball where ball_by_ball.match_id = match.match_id and match.venue_id = $1 group by match.match_id, innings_no) sq, venue where venue.venue_id = $1 \
   group by venue_id) t1, \
   (select venue_name, city_name, country_name, capacity, max(innings1_runs) as highest_score_chased from (select match.match_id, sum(runs_scored+extra_runs) as innings1_runs from match, \
   ball_by_ball where ball_by_ball.match_id = match.match_id and match.venue_id = $1 and innings_no = 1 group by match.match_id) sq, venue where venue.venue_id = $1 \
   group by venue_id) t2,\
   (select exists(select match_id from match where ((match_winner = toss_winner and toss_name = \'field\') \
   or (match_winner != toss_winner and toss_name = \'bat\')) and venue_id = $1) as chased) t3'

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