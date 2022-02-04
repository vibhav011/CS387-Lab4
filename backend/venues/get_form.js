function get_form(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var capacity = parseInt(request.body.capacity);
    if (!capacity) {
      response.status(400).json({ error: 'capacity must be an integer' })
      return
    }

    const query = 'CREATE SEQUENCE IF NOT EXISTS venues_seq INCREMENT BY 1; \
    SELECT setval(\'venues_seq\', SELECT max(venue_id) FROM venue) FROM venue;'

    db_client.query(query, [request.body.venue_name, request.body.city_name, request.body.country_name, capacity], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}
  
module.exports = get_form;