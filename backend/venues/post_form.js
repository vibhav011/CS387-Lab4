function post_form(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    var capacity = parseInt(request.body.capacity);
    if (!capacity) {
      response.status(400).json({ error: 'capacity must be an integer' })
      return
    }

    const query = 'INSERT INTO venue \
    (venue_id, venue_name, city_name, country_name, capacity) \
    VALUES \
    (nextval(\'venues_seq\'), $1, $2, $3, $4);'

    const qlist = [request.body.venue_name, request.body.city_name, request.body.country_name, capacity]
    if (qlist.includes(undefined)) {
      response.status(400).json({ error: 'venue_name, city_name, country_name, and capacity are required' })
      return
    }
    db_client.query(query, qlist, (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}
  
module.exports = post_form;


