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

async function get_bowling_stats(db_client, request, response) {
   
  }
  
  module.exports = get_bowling_stats;
  