function get_pie_chart(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null
    var match_id = parseInt(request.params.match_id);
    if (!match_id) {
      response.status(400).json({ error: 'match_id must be an integer' })
      return
    }
    const query = 'select innings_no, sum(runs_scored)+sum(extra_runs) as total_runs, coalesce(sum(ones),0) as ones, coalesce(sum(twos),0) as twos, \
    coalesce(sum(threes),0) as threes,coalesce(sum(fours),0) as fours, coalesce(sum(sixes),0) as sixes, coalesce(sum(extra_runs),0) as extra_runs \
    from (select innings_no, extra_runs, runs_scored, case when runs_scored = 1 then 1 end ones, case when runs_scored = 2 then 1 end twos, \
    case when runs_scored = 3 then 1 end threes, case when runs_scored = 4 then 1 end fours, case when runs_scored = 6 then 1 end sixes \
    from ball_by_ball where match_id = $1) sq group by innings_no'

    db_client.query(query, [match_id], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
  }
  
  module.exports = get_pie_chart;

