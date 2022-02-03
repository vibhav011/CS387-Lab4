function get_venue_pie_chart(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var venue_id = parseInt(request.params.venue_id);
    if (!venue_id) {
      response.status(400).json({ error: 'venue_id must be an integer' })
      return
    }

    const query = 'select *, 0 as num_drawn from (select coalesce((select count(match_id) from match where ((match_winner = toss_winner and toss_name = \'bat\') \
    or (match_winner != toss_winner and toss_name = \'field\')) and venue_id = $1 group by venue_id), 0) as num_batting_first_won) bat, \
    (select coalesce((select count(match_id) from match where ((match_winner = toss_winner and toss_name = \'field\') \
    or (match_winner != toss_winner and toss_name = \'bat\')) and venue_id = $1 group by venue_id), 0) as num_bowling_first_won) bowl '    

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
  
module.exports = get_venue_pie_chart;
