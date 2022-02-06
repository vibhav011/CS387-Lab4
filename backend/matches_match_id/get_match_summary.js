async function updateRetJSON(db_client, query, params, ret_json, error, key, zeroAllowed = false) {
  try {
    res = await db_client.query(query, params)
    if(res.rows.length === 0 && !zeroAllowed) {
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

async function get_team_names_json(db_client, match_id, ret_json, error) {
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

async function get_match_summary_json(db_client, match_id, innings_no, ret_json, error) {
  const query1 = 'SELECT player_name as batsman_name, runs, balls_faced from player, (SELECT batsman, runs, balls_faced, dense_rank() over (order by runs desc, balls_faced asc, batsman asc) batsman_rank \
    from (SELECT striker as batsman, sum(runs_scored) as runs, count(*) as balls_faced from match, ball_by_ball where \
    ball_by_ball.match_id = match.match_id and match.match_id = $1 and innings_no = $2 group by striker) sq ) sq2 where batsman_rank < 4 and balls_faced > 0 \
    and player.player_id = batsman order by batsman_rank'

  await updateRetJSON(db_client, query1, [match_id, innings_no], ret_json, error, 'batsmen')

  const query2 = 'SELECT player_name as bowler_name,  wickets, runs_given, overs_bowled from player, (SELECT bowler, wickets, runs_given, overs_bowled, dense_rank() \
    over (order by wickets desc, runs_given asc, bowler asc) bowler_rank from \
    (SELECT bowler, sum(case when out_type is NULL or out_type in (\'run out\', \'retired hurt\') then 0 else 1 end) as wickets, sum(runs_scored) as runs_given, \
    count(distinct over_id) as overs_bowled from match, ball_by_ball where ball_by_ball.match_id = match.match_id and match.match_id = $1 and innings_no = $2\
    group by bowler) sq) sq2 where bowler_rank < 4 and wickets > 0 and player.player_id = bowler order by bowler_rank'

  await updateRetJSON(db_client, query2, [match_id, innings_no], ret_json, error, 'bowlers', zeroAllowed = true)
}

const query3 = 'SELECT match_id, (SELECT team_name from team where team_id = team1) team1_name,\
                     (SELECT team_name from team where team_id = team2) team2_name, \
                     (SELECT team_name from team where team_id = match_winner) winner, \
                     win_type, win_margin, season_year FROM \
                     match where match_id = $1'

async function get_match_summary(db_client, request, response) {
  var match_id = parseInt(request.params.match_id);
  if (!match_id) {
    response.status(400).json({ error: 'match_id must be an integer' })
    return
  }
  var ret_json = { 'team1': { 'batsmen': {}, 'bowlers': {} }, 'team2': { 'batsmen': {}, 'bowlers': {} }, 'match_info': {}, 'team_names': {} }
  var err = { status: 200, message: 'success' }
  await get_match_summary_json(db_client, match_id, 1, ret_json['team1'], err)
  await get_match_summary_json(db_client, match_id, 2, ret_json['team2'], err)
  await get_team_names_json(db_client, match_id, ret_json['team_names'], err)
  await updateRetJSON(db_client, query3, [match_id], ret_json, err, 'match_info')

  if (err.status === 200) {
    response.status(200).json(ret_json)
  } 
  else {
    response.status(err.status).json({ error: err.message })
  }
}

module.exports = get_match_summary;