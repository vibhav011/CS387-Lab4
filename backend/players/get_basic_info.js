function get_basic_info(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null
    var player_id = parseInt(request.params.player_id);
    if (!player_id) {
      response.status(400).json({ error: 'match_id must be an integer' })
      return
    }
    const query = 'select player_name, batting_hand, bowling_skill, country_name from player where player_id = $1'

    db_client.query(query, [player_id], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
  }
  
  module.exports = get_basic_info;

