var mysqlConnection = require('./mysqlConnection.js');

module.exports = {};

module.exports.getAdForRegionId = function(req, res)
{
	var regionId = req.body.regionId;

	if (regionId) 
	{
		var mediaQuery = "SELECT * FROM ads WHERE ads.regionId = ?";
		
		var connection = mysqlConnection.createDBConnection();
		
		connection.query(mediaQuery, regionId, function(err, rows)
		{
			if (err) 
			{
				throw err;
			}
			else
			{
				var response = {};
				response.status_code = 200;
				response.filename = rows[0].filename;

				res.status(200);
				res.json(response);
			}
		});
	}
};