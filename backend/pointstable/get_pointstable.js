function get_pointstable(db_client, request, response) { // request and response are parts of the http get method
    var year = parseInt(request.params.year);
    if (!year) {
        response.status(400).json({ error: 'Year must be an integer' })
        return
    }

    var ret_json = null
    const query = 'select team_id, team_name, mat, won, mat-won as lost, \'0\' as tied, nr, 2*won as pts \
    from (select team_id, team_name, count(distinct match_id) mat, sum(case when match_winner=team_id then 1 else 0 end)/2 won, \
    round(sum(sign*(2*innings_no-3)*nr), 2) nr from(select team_id, team_name, match.match_id, match_winner, innings_no, \
    case when (toss_winner=team_id and toss_name=\'bat\') or (toss_winner!=team_id and toss_name=\'field\') then -1 else 1 end sign, \
    sum(runs_scored+extra_runs)*1.0/count(distinct over_id) nr from team, match, ball_by_ball as bb where bb.match_id=match.match_id \
    and (team1=team_id or team2=team_id) and season_year=$1 group by team_id, team_name, match.match_id, match_winner, innings_no, \
    toss_winner, toss_name) t group by team_id, team_name) t2 order by won desc;'

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