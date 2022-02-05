function get_batting_graph(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null
    var player_id = parseInt(request.params.player_id);
    if (!player_id) {
      response.status(400).json({ error: 'player_id must be an integer' })
      return
    }
    const query = 'select t1.match_id, coalesce(match_runs, 0) as match_runs from (select distinct match_id from player_match where player_id = $1) t1 \
    left outer join (select match_id, sum(runs_scored) as match_runs from ball_by_ball where striker = $1 group by match_id) \
    t2 on t1.match_id = t2.match_id'

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
  
module.exports = get_batting_graph;

