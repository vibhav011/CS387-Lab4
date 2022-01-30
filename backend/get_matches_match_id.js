function json_concat(o1, o2) {
  for (var key in o2) {
   o1[key] = o2[key];
  }
  return o1;
 }

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

async function get_batting(db_client, match_id, innings_no, ret_json, error) { // request and response are parts of the http get method
  const query = '	select player_name as batter, runs, fours, sixes, balls_faced from player, \
  (select striker, sum(runs_scored) as runs, count(sixes) as sixes, \
  count(fours) as fours, count(*) as balls_faced from \
  (select striker, match_id, runs_scored, case when runs_scored = 6 then 1 end sixes, \
      case when runs_scored = 4 then 1 end fours \
      from ball_by_ball where match_id = $1 and innings_no = $2) aggs group by striker)\
       ball_info where striker = player_id'
  
  await updateRetJSON(db_client, query, [match_id, innings_no], ret_json, error, 'batting')
}

function get_bowling(db_client, match_id, innings_no) {
  const query = 'select player_name as bowler, balls_bowled, runs_given, wickets \
  from player, (select bowler, count(*) as balls_bowled, sum(runs_scored) as runs_given, count(wickets) as wickets \
   from (select bowler, match_id, runs_scored, case when out_type != \'run out\' and out_type != \'retired hurt\' and out_type is not NULL then 1 end wickets\
      from ball_by_ball where match_id = $1 and innings_no = $2) aggs group by bowler) ball_info where bowler = player_id'
  db_client.query(query, [match_id, innings_no], (err, res) => {
    if (err) {
      return err, null
    } else {
      return null, res.rows
    }
  })
}

function get_match_info(db_client, match_id, innings_no) {
  var ret_json = {}
  const query = 'select match_id, (SELECT team_name from team where team_id = team1) as team1_name, \
  (SELECT team_name from team where team_id = team2) as team2_name, season_year as year_of_playing, \
  toss_name, (SELECT team_name from team where team_id = toss_winner) as toss_winner_name, \
  (SELECT venue_name from venue where venue.venue_id = match.venue_id) as venue from match where match_id = $1'
  db_client.query(query, [match_id], (err, res) => {
    if (err) {
      return err, null
    } else {
      json_concat(ret_json, res.rows)
    }
  })

  const players1_query = 'select player_name as team1_players from player, player_match, team, match \
  where player_match.match_id = match.match_id and player.player_id = player_match.player_id \
  and team.team_id = player_match.team_id and team1 = team.team_id and match.match_id = $1'
  db_client.query(players1_query, [match_id], (err, res) => {
    if (err) {
      return err, null
    } else {
      json_concat(ret_json, res.rows)
    }
  })

  const players2_query = 'select player_name as team2_players from player, player_match, team, match \
  where player_match.match_id = match.match_id and player.player_id = player_match.player_id \
  and team.team_id = player_match.team_id and team2 = team.team_id and match.match_id = $1'
  db_client.query(players2_query, [match_id], (err, res) => {
    if (err) {
      return err, null
    } else {
      json_concat(ret_json, res.rows)
    }
  })

  const umpires_query = 'select umpire_name as umpires from umpire, umpire_match where \
  umpire.umpire_id = umpire_match.umpire_id and match_id = $1'
  db_client.query(umpires_query, [match_id], (err, res) => {
    if (err) {
      return err, null
    } else {
      json_concat(ret_json, res.rows)
    }
  })

  return null, ret_json
}

function get_extras(db_client, match_id, innings_no) {
  const query = 'select sum(extra_runs) from ball_by_ball where match_id = $1 and innings_no = $2'
  db_client.query(query, [match_id, innings_no], (err, res) => {
    if (err) {
      return err, null
    } else {
      return null, res.rows
    }
  })
}

function get_score(db_client, match_id, innings_no) {
  const query = 'select sum(runs_scored)+sum(extra_runs) as runs, count(wickets) as wickets from (select runs_scored, extra_runs, \
  case when out_type != \'run out\' and out_type != \'retired hurt\' and out_type is not NULL then 1 end wickets \
  from ball_by_ball where match_id = $1 and innings_no = $2) ball_info'
  db_client.query(query, [match_id, innings_no], (err, res) => {
    if (err) {
      return err, null
    } else {
      return null, res.rows
    }
  })
}

async function get_match_id_json(db_client, match_id, ret_json, err) {
  for (let i = 1; i < 3; i++) {
    await get_batting(db_client, match_id, i, ret_json['innings'+i], err)
    if (err.status !== 200) return;

  //   get_bowling(db_client, match_id, i, (err, res) => {
  //     if(err) {
  //       console.log('innings '+ i +'bowling', err)
  //       response.status(500).json({ error: err.message })
  //       is_err = true
  //     } else {
  //       ret_json['innings'+i]['bowling'] = res
  //     }
  //   })

  //   get_extras(db_client, match_id, 1, (err, res) => {
  //     if(err) {
  //       console.log('innings '+ i +'bowling', err)
  //       response.status(500).json({ error: err.message })
  //       is_err = true
  //     } else {
  //       ret_json['innings'+i]['extras'] = res
  //     }
  //   })

  //   get_score(db_client, match_id, 1, (err, res) => {
  //     if(err) {
  //       console.log('innings '+ i +'bowling', err)
  //       response.status(500).json({ error: err.message })
  //       is_err = true
  //     } else {
  //       ret_json['innings'+i]['score'] = res
  //     }
  //   })
  // }

  // get_match_info(db_client, match_id, (err, res) => {
  //   if(err) {
  //     console.log('match info', err)
  //     response.status(500).json({ error: err.message })
  //     is_err = true
  //   } else {
  //     ret_json['match info'] = res
  //   }
  // })
  }
}

async function get_matches_match_id(db_client, request, response) { 
  var match_id = parseInt(request.params.match_id);
  if (!match_id) {
    response.status(400).json({ error: 'match_id must be an integer' })
    return
  }
  var ret_json = {'innings1':{}, 'innings2':{}, 'match_info':{}}
  var err = {status: 200, message: 'success'}
  await get_match_id_json(db_client, match_id, ret_json, err)

  if (err.status === 200) {
    response.status(200).json(ret_json)
  }
  else {
    response.status(err.status).json({ error: err.message })
  }
}

module.exports = get_matches_match_id;