var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var geolib = require('geolib');
var isOnline = require('is-online');

var y = {latitude:12.9472408, longitude:77.5758543};

var app = express();

server = app.listen(2000, function()
{
	console.log('http server running on port 2000');
});

var socketio = require('socket.io');
var io = socketio(server);


var mysqlConnection = require('./js/mysqlConnection.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

app.use('/res', express.static(path.join(__dirname, '/js')));
app.use('/libs', express.static(path.join(__dirname, '/node_modules')));
app.use('/icon', express.static(path.join(__dirname,'/icon')));
app.use('/media', express.static(path.join(__dirname,'/media')));

DISTANCE = 1500; //meters

app.get('/', function(req, res)
{
	res.status(200);
	res.setHeader('Content-Type','text/html');
	res.sendFile(path.join(__dirname, '/index1.html'));
});

app.get('/admin', function(req, res)
{
	res.status(200);
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname, '/admin.html'));
});

function getData (socket)
{
	var query = "SELECT advertisements.* FROM advertisements INNER JOIN clients ON clients.id=advertisements.clientId";
	var connection = mysqlConnection.createDBConnection();
	connection.query(query, function(err, rows)
	{
		adloop(rows, socket);
	});
}

inCircleAdQue = [];
function adloop (ads, socket) {

	var adsLength = ads.length;
	var i = 0;

	while (i < adsLength){

		var clientCoordinates = {};
		clientCoordinates.latitude = ads[i].latitude;
		clientCoordinates.longitude= ads[i].longitude;
		var distance = geolib.getDistance(y, clientCoordinates);
		var indexInQue = inCircleAdQue.indexOf(ads[i].id);

		if (distance < DISTANCE) 
		{
			if (indexInQue == -1) {
				inCircleAdQue.push(ads[i].id);
				ads[i].remove = 0; //1 for dequeing
				var response = {};
				response.noData = 0;
				response.ad = ads[i];
				socket.emit('mediaUpdate', response);
			}
		}
		else
		{
			if (indexInQue != -1) {
				inCircleAdQue.splice(indexInQue, 1);
				ads[i].remove = 1;
				var response = {};
				response.noData = 0;
				response.ad = ads[i];
				socket.emit('mediaUpdate', response);
			}
			console.log(ads[i].filename + 'is out at '+ distance + ' meters ');
		}
		i++;
		if (i==adsLength) 
		{
			//i=0; //code for general ads
			console.log("Stop");
		}
	}
	if (adsLength == 0) 
	{
		var response = {};
		response.noData = 1;
		response.ad = null;
		socket.emit('mediaUpdate', response);
	}
};

socket = null;
startEventHandler = function()
{
	console.log('starting');
	isOnline(isOnlineHandler);
};

isOnlineHandler = function(err, isonline)
{
	console.log("checking internet status");
	if (err) {
		console.log(err);
		return;
	}
	if (isonline) 
	{
		getData(socket);
	}
	else
	{
		console.log('offline');
	}
};

connectionHandler = function(sock)
{
	socket = sock;
	inCircleAdQue = [];
	socket.on("start", startEventHandler);
};

io.on('connection', connectionHandler);