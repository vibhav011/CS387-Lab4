function get_bowling_graph(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null
    var player_id = parseInt(request.params.player_id);
    if (!player_id) {
      response.status(400).json({ error: 'player_id must be an integer' })
      return
    }
    const query = 'select match_id, sum(runs_scored+extra_runs) as runs_conceded, count(out_type) as wickets \
    from ball_by_ball where bowler = $1 group by match_id'

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
  
module.exports = get_bowling_graph;

