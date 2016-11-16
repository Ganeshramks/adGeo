var mysqlConnection = require('./mysqlConnection.js');

module.exports = {};

module.exports.getRegions = function(req, res)
{
	var connection = mysqlConnection.createDBConnection();

	var query = "SELECT * FROM locations";
	connection.query(query, function(err, rows){
		if (err) 
		{
			throw err;
		}
		else
		{
			var response = {};
			response.status_code = 200;
			response.regions = rows;

			res.status(200);
			res.json(response);
		}
	});
};

module.exports.saveRegion = function(req, res)
{
	var connection = mysqlConnection.createDBConnection();
	var coordinateSet = req.body.coordinateSet;
	var insertQuery = "INSERT INTO locations(coordinates) VALUES (?)";

	connection.query(insertQuery, coordinateSet, function(err, result){
		if (err) {
			throw err
		}
		else
		{
			res.status(200);
			res.send(JSON.stringify(result.insertId));	
		}
	});
};