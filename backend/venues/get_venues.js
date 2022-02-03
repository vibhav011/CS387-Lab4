function get_venues(db_client, request, response) { // request and response are parts of the http get method
    var ret_json = null

    const query = 'select venue_name from venue'

    db_client.query(query, (err, res) => {
      if (err) {
        console.log(err)
        response.status(500).json({ error: err.message })
      } else {
        ret_json = res.rows
        response.status(200).json({ data: ret_json })
      }
    })
}
  
module.exports = get_venues;

