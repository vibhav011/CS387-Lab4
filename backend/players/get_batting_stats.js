function get_batting_stats(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null
    var player_id = parseInt(request.params.player_id);
    if (!player_id) {
      response.status(400).json({ error: 'player_id must be an integer' })
      return
    }
    const query = 'select matches, runs, runs_in_fours, runs_in_sixes, fifties, highest_score, strike_rate, average from \
    (select (select count(distinct match_id) as matches from player_match where player_id = $1), coalesce(sum(runs_scored), 0) as runs, \
    count(fours)*4 as runs_in_fours, count(sixes)*6 as runs_in_sixes, coalesce(round(sum(runs_scored)*1.0/coalesce(nullif(count(out_type), 1), 0), 2),0) as average, \
    round(coalesce(sum(runs_scored),0)*100.0/coalesce(nullif(count(*),0),1), 2) as strike_rate from (select match_id, runs_scored, out_type, case when runs_scored = 4 then 1 end fours,\
    case when runs_scored = 6 then 1 end sixes from ball_by_ball where striker = $1) sq1) t1, \
    (select coalesce(count(fifties),0) as fifties, coalesce(max(match_runs),0) as highest_score from (select sum(runs_scored) as match_runs, case when sum(runs_scored)>=50 then 1 end fifties \
    from ball_by_ball where striker = $1 group by match_id) sq2) t2'
    
    db_client.query(query, [player_id], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}
  
module.exports = get_batting_stats;

