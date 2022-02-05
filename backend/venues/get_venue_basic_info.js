function get_venue_basic_info(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var venue_id = parseInt(request.params.venue_id);
    if (!venue_id) {
      response.status(400).json({ error: 'venue_id must be an integer' })
      return
    }

    const query = `with mr as (select match.match_id, innings_no, sum(runs_scored+extra_runs) runs,
    case when (toss_winner=match_winner and toss_name='bat') or (toss_winner!=match_winner and toss_name='field') then 1 else 2 end win
    from ball_by_ball as bb, match where bb.match_id=match.match_id and venue_id=$1 group by match.match_id, innings_no),
    mrr as (select mr1.match_id, mr1.runs as inn1_runs, mr2.runs as inn2_runs, mr1.win
    from mr as mr1, mr as mr2 where mr1.match_id=mr2.match_id and mr1.innings_no=1 and mr2.innings_no=2),
    match_runs(total, highest_rec, lowest_rec, highest_ch) as
    (select count(distinct match_id), max(case when inn1_runs>inn2_runs then inn1_runs else inn2_runs end),
    min(case when inn1_runs>inn2_runs then inn2_runs else inn1_runs end), max(case when win=2 then inn1_runs else 0 end) from mrr)
    select venue_name, city_name, country_name, capacity, coalesce(total, 0) total_matches_played,
    coalesce(highest_rec, 0) highest_total_recorded, coalesce(lowest_rec, 0) lowest_total_recorded,
    coalesce(highest_ch, 0) highest_score_chased from venue left outer join match_runs on true where venue_id=$1;`

    db_client.query(query, [venue_id], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else if (res.rows.length === 0) {
        response.status(404).json({ error: 'No matching venue found' })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}
  
module.exports = get_venue_basic_info;