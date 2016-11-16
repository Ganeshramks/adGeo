var mysql = require('mysql');

module.exports = {};

module.exports.createDBConnection = function()
{
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'adgeo',
		password : 'adgeouser1234',
		database : 'adgeo'
	});

	connection.connect();

	return connection;
};