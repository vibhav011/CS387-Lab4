function get_bowling_stats(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null
    var player_id = parseInt(request.params.player_id);
    if (!player_id) {
      response.status(400).json({ error: 'player_id must be an integer' })
      return
    }
    const query = 'select * from (select count(distinct match_id) as matches, coalesce(sum(runs_scored), 0) as runs, \
    coalesce(sum(case when out_type is null or out_type in (\'run out\', \'retired hurt\') then 0 else 1 end), 0) as wickets, \
    coalesce(count(distinct (over_id, match_id)),0) as overs, coalesce(count(*),0) as balls, \
    round(coalesce(sum(runs_scored), 0)*1.0/coalesce(nullif(count(distinct (over_id, match_id)),0),1), 2) as economy \
    from ball_by_ball where bowler = $1) t1, \
    (select sum(five_wickets) as five_wickets from (select case when coalesce(sum(case when out_type is null or \
    out_type in (\'run out\', \'retired hurt\') then 0 else 1 end), 0) >= 5 then 1 else 0 end five_wickets from \
    ball_by_ball where bowler = $1 group by match_id) sq) t2'
        
    db_client.query(query, [player_id], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else if (res.rows.length === 0) {
        response.status(404).json({ error: 'No matching player id found' })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}

  
module.exports = get_bowling_stats;
  