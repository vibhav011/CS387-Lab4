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

async function updateArrayJSON(db_client, query, params, ret_json, error, key1, key2) {
  try {
    res = await db_client.query(query, params)
    if (!(key1 in ret_json)) ret_json[key1] = {}
    ret_json[key1][key2] = []
    for (let i = 0; i < res.rows.length; i++) {
      ret_json[key1][key2][i] = res.rows[i][key2]
    }
  }
  catch (err) {
    error.status = 500;
    error.message = err.message;
  }
}

async function get_batting(db_client, match_id, innings_no, ret_json, error) {
  const query = '	select player_name as batter, runs, fours, sixes, balls_faced from player, \
  (select striker, sum(runs_scored) as runs, count(sixes) as sixes, \
  count(fours) as fours, count(*) as balls_faced from \
  (select striker, match_id, runs_scored, case when runs_scored = 6 then 1 end sixes, \
      case when runs_scored = 4 then 1 end fours \
      from ball_by_ball where match_id = $1 and innings_no = $2) aggs group by striker)\
       ball_info where striker = player_id'

  await updateRetJSON(db_client, query, [match_id, innings_no], ret_json, error, 'batting')
}

async function get_bowling(db_client, match_id, innings_no, ret_json, error) {
  const query = 'select player_name as bowler, balls_bowled, runs_given, wickets \
  from player, (select bowler, count(*) as balls_bowled, sum(runs_scored) as runs_given, count(wickets) as wickets \
   from (select bowler, match_id, runs_scored, case when out_type != \'run out\' and out_type != \'retired hurt\' and out_type is not NULL then 1 end wickets\
      from ball_by_ball where match_id = $1 and innings_no = $2) aggs group by bowler) ball_info where bowler = player_id'

  await updateRetJSON(db_client, query, [match_id, innings_no], ret_json, error, 'bowling')
}

async function get_players(db_client, match_id, ret_json, error) {
  const query1 = 'select player_name as team1_players from player, player_match, team, match \
  where player_match.match_id = match.match_id and player.player_id = player_match.player_id \
  and team.team_id = player_match.team_id and team1 = team.team_id and match.match_id = $1'
  await updateArrayJSON(db_client, query1, [match_id], ret_json, error, 'players', 'team1_players')

  const query2 = 'select player_name as team2_players from player, player_match, team, match \
  where player_match.match_id = match.match_id and player.player_id = player_match.player_id \
  and team.team_id = player_match.team_id and team2 = team.team_id and match.match_id = $1'
  await updateArrayJSON(db_client, query2, [match_id], ret_json, error, 'players', 'team2_players')
}

async function get_umpires(db_client, match_id, ret_json, error) {
  const query = 'select umpire_name as umpire_names from umpire, umpire_match where \
  umpire.umpire_id = umpire_match.umpire_id and match_id = $1'
  await updateArrayJSON(db_client, query, [match_id], ret_json, error, 'umpires', 'umpire_names')
}

async function get_match_info(db_client, match_id, ret_json, error) {
  const query = 'select match_id, (SELECT team_name from team where team_id = team1) as team1_name, \
  (SELECT team_name from team where team_id = team2) as team2_name, season_year as year_of_playing, \
  toss_name, (SELECT team_name from team where team_id = toss_winner) as toss_winner_name, \
  (SELECT venue_name from venue where venue.venue_id = match.venue_id) as venue from match where match_id = $1'

  await updateRetJSON(db_client, query, [match_id], ret_json, error, 'info')
}

async function get_extras(db_client, match_id, innings_no, ret_json, error) {
  const query = 'select sum(extra_runs) from ball_by_ball where match_id = $1 and innings_no = $2'
  await updateRetJSON(db_client, query, [match_id, innings_no], ret_json, error, 'extras')
}

async function get_score(db_client, match_id, innings_no, ret_json, error) {
  const query = 'select sum(runs_scored)+sum(extra_runs) as runs, count(wickets) as wickets from (select runs_scored, extra_runs, \
  case when out_type != \'run out\' and out_type != \'retired hurt\' and out_type is not NULL then 1 end wickets \
  from ball_by_ball where match_id = $1 and innings_no = $2) ball_info'
  await updateRetJSON(db_client, query, [match_id, innings_no], ret_json, error, 'score')
}

async function get_match_id_json(db_client, match_id, ret_json, err) {
  for (let i = 1; i < 3; i++) {
    await get_batting(db_client, match_id, i, ret_json['innings' + i], err)
    if (err.status !== 200) return;

    await get_bowling(db_client, match_id, i, ret_json['innings' + i], err)
    if (err.status !== 200) return;

    await get_extras(db_client, match_id, i, ret_json['innings' + i], err)
    if (err.status !== 200) return;

    await get_score(db_client, match_id, i, ret_json['innings' + i], err)
    if (err.status !== 200) return;
  }

  await get_match_info(db_client, match_id, ret_json['match_info'], err)
  if (err.status !== 200) return;

  await get_players(db_client, match_id, ret_json['match_info'], err)
  if (err.status !== 200) return;

  await get_umpires(db_client, match_id, ret_json['match_info'], err)
}

<<<<<<< HEAD:backend/matches_match_id/get_scorecard.js
async function get_scorecard(db_client, request, response) { 
=======
async function get_matches_match_id(db_client, request, response) {
>>>>>>> e86aa2d67b6a5fb2fa03b06d201e17c84f39529c:backend/get_matches_match_id.js
  var match_id = parseInt(request.params.match_id);
  if (!match_id) {
    response.status(400).json({ error: 'match_id must be an integer' })
    return
  }
  var ret_json = { 'innings1': {}, 'innings2': {}, 'match_info': {} }
  var err = { status: 200, message: 'success' }
  await get_match_id_json(db_client, match_id, ret_json, err)

  if (err.status === 200) {
    response.status(200).json(ret_json)
  }
  else {
    response.status(err.status).json({ error: err.message })
  }
}

module.exports = get_scorecard;
