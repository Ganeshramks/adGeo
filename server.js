var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var AdminAPI = require('./js/API.js');
var MediaAPI = require('./js/mediaAPI.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

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

app.get('/getRegions', AdminAPI.getRegions);

app.post('/saveLocation', AdminAPI.saveRegion);

app.post('/getAdForRegionId', MediaAPI.getAdForRegionId);

server = app.listen(2000, function()
{
	console.log('http server running on port 2000');
});