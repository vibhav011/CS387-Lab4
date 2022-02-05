function get_pointstable(db_client, request, response) { // request and response are parts of the http get method
    var year = parseInt(request.params.year);
    if (!year) {
        response.status(400).json({ error: 'Year must be an integer' })
        return
    }

    var ret_json = null
    const query = `with mr as (select match_id, innings_no, sum(runs_scored+extra_runs) runs, count(distinct over_id) overs
                from ball_by_ball where match_id in (select match_id from match where season_year=$1) group by match_id, innings_no),
                match_runs as (select mr1.match_id, mr1.runs as inn1_runs, mr2.runs as inn2_runs, mr1.overs as overs1, mr2.overs as overs2
                from mr as mr1, mr as mr2 where mr1.match_id=mr2.match_id and mr1.innings_no=1 and mr2.innings_no=2),
                team_runs as (select mr.match_id, team1, team2, inn1_runs, inn2_runs, overs1, overs2,
                case when (toss_winner=team1 and toss_name='bat') or (toss_winner=team2 and toss_name='field') then 1 else 2 end turn,
                case when match_winner=team1 then 1 else 0 end win from match_runs as mr, match where match.match_id = mr.match_id),
    
                team_info as ((select team1 as team_id, match_id, case when turn=1 then inn1_runs else inn2_runs end runs,
                case when turn=1 then overs1 else overs2 end overs, inn1_runs+inn2_runs as both_runs, overs1+overs2 as both_overs, win from team_runs)
                union (select team2 as team_id, match_id, case when turn=2 then inn1_runs else inn2_runs end runs,
                case when turn=2 then overs1 else overs2 end overs, inn1_runs+inn2_runs as both_runs, overs1+overs2 as both_overs, 1-win as win from team_runs)),
    
                team_nr as (select team_id, round(sum(runs)/sum(overs)-sum(both_runs-runs)/sum(both_overs-overs), 2) nr, sum(win) as won,
                count(match_id) as mat from team_info group by team_id)
                select team.team_id, team_name, mat, won, mat-won as lost, 0 as tied, nr, 2*won as pts 
                from team_nr, team where team.team_id = team_nr.team_id and mat > 0 order by won desc, nr desc;`

    db_client.query(query, [year], (err, res) => {
        if (err) {
            console.log(err)
            response.status(500).json({ error: err.message })
        } else if (res.rows.length === 0) {
            response.status(404).json({ error: 'No matches found' })
        } else {
            ret_json = res.rows
            response.status(200).json({ data: ret_json })
        }
    })
}

module.exports = get_pointstable;