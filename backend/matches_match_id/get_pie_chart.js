async function updateRetJSON(db_client, query, params, ret_json, error, key) {
  try {
    res = await db_client.query(query, params)
    if(res.rows.length === 0) {
      error.status = 404
      error.message = "No matching match id found"
    }
    ret_json[key] = res.rows
  }
  catch (err) {
    error.status = 500;
    error.message = err.message;
  }
}

async function get_pie_chart(db_client, request, response) { // request and response are parts of the http get method
    var match_id = parseInt(request.params.match_id);
    if (!match_id) {
      response.status(400).json({ error: 'match_id must be an integer' })
      return
    }

    var ret_json = { 'data': [], 'team_names': [] }
    var err = { status: 200, message: 'success' }

    const query = 'select innings_no, sum(runs_scored)+sum(extra_runs) as total_runs, coalesce(sum(ones),0) as ones, coalesce(sum(twos),0) as twos, \
    coalesce(sum(threes),0) as threes,coalesce(sum(fours),0) as fours, coalesce(sum(sixes),0) as sixes, coalesce(sum(extra_runs),0) as extra_runs \
    from (select innings_no, extra_runs, runs_scored, case when runs_scored = 1 then 1 end ones, case when runs_scored = 2 then 1 end twos, \
    case when runs_scored = 3 then 1 end threes, case when runs_scored = 4 then 1 end fours, case when runs_scored = 6 then 1 end sixes \
    from ball_by_ball where match_id = $1) sq group by innings_no'
    await updateRetJSON(db_client, query, [match_id], ret_json, err, 'data')
    
    const query2 = `select t1.team_name team1, t2.team_name team2, t3.team_name winner
    from (select team1, team2, match_winner from match where match_id = $1) m, team t1, team t2, team t3
    where m.team1 = t1.team_id and m.team2 = t2.team_id and m.match_winner = t3.team_id`
    await updateRetJSON(db_client, query2, [match_id], ret_json, err, 'team_names')
    
    if (err.status === 200) {
      response.status(200).json(ret_json)
    } 
    else {
      response.status(err.status).json({ error: err.message })
    }
  }
  
  module.exports = get_pie_chart;

