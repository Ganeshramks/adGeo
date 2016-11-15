var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use('/res', express.static(path.join(__dirname, '/js')));
app.use('/libs', express.static(path.join(__dirname, '/node_modules')));
app.use('/icon', express.static(path.join(__dirname,'/icon')));
app.use('/media', express.static(path.join(__dirname,'/media')));

app.get('/', function(req, res)
{
	res.status(200);
	res.setHeader('Content-Type','text/html');
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/admin', function(req, res)
{
	res.status(200);
	res.setHeader('Content-Type', 'text/html');
	res.sendFile(path.join(__dirname, '/admin.html'));
});

app.get('/getMedia', function(req, res)
{
 	res.status(200);
 	res.send("OK");
});

server = app.listen(2000, function()
{
	console.log('http server running on port 2000');
});