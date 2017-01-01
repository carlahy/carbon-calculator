var express = require('express');
var app = express();

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("App listing at http://%s:%s", host, port);
})

app.get('/', function(req,res) {
	res.send('Hello world');
})

app.post('/', function(req,res) {
	console.log('Received POST request to homepage');
	res.send('Hello POST');
})


