async function updateRetJSON(db_client, query, params, ret_json, error, key) {
    try {
      res = await db_client.query(query, params)
      ret_json[key] = res.rows
    }
    catch (err) {
      error.status = 500;
      error.message = err.message;
    }
}

async function get_innings_info(db_client, match_id, ret_json, error) {
  const query1 = 'select over_id, sum(runs_scored)+sum(extra_runs) as runs, count(out_type)>0 as wicket \
  from ball_by_ball where match_id = $1 and innings_no = 1 group by over_id order by over_id'

  await updateRetJSON(db_client, query1, [match_id], ret_json, error, 'innings1')

  const query2 = 'select over_id, sum(runs_scored)+sum(extra_runs) as runs, count(out_type)>0 as wicket \
  from ball_by_ball where match_id = $1 and innings_no = 2 group by over_id order by over_id'

  await updateRetJSON(db_client, query2, [match_id], ret_json, error, 'innings2')
}

async function get_team_names(db_client, match_id, ret_json, error) {
  const query1 = '(select team_name from team, match where match.team1=team.team_id and match_id = $1 \
  and ((team1 = toss_winner and toss_name = \'bat\') or (team2 = toss_winner and toss_name = \'field\'))) union \
  (select team_name from team, match where match.team2=team.team_id and match_id = $1 \
  and ((team2 = toss_winner and toss_name = \'bat\') or (team1 = toss_winner and toss_name = \'field\')))'

  await updateRetJSON(db_client, query1, [match_id], ret_json, error, 'team1_name')  

  const query2 = '(select team_name from team, match where match.team2=team.team_id and match_id = $1 \
  and ((team1 = toss_winner and toss_name = \'bat\') or (team2 = toss_winner and toss_name = \'field\'))) union \
  (select team_name from team, match where match.team1=team.team_id and match_id = $1 \
  and ((team1 = toss_winner and toss_name = \'field\') or (team2 = toss_winner and toss_name = \'bat\')))'


  await updateRetJSON(db_client, query2, [match_id], ret_json, error, 'team2_name')  
}

async function get_score_comparison(db_client, request, response) { 
  var match_id = parseInt(request.params.match_id);
  if (!match_id) {
    response.status(400).json({ error: 'match_id must be an integer' })
    return
  }
  var ret_json = {'innings1':{}, 'innings2':{}, 'team1_name':'dummy1', 'team2_name':'dummy2'}
  var err = {status: 200, message: 'success'}
  await get_innings_info(db_client, match_id, ret_json, err)
  await get_team_names(db_client, match_id, ret_json, err)

  if (err.status === 200) {
    response.status(200).json(ret_json)
  }
  else {
    response.status(err.status).json({ error: err.message })
  }
}

module.exports = get_score_comparison;