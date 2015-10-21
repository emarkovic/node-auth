//nerp stack - node express react postgress

var express = require('express');
var app = express();

var knex = require('knex')({
	client: 'pg',
	connection: {
		host     : '127.0.0.1',
		user     : 'Ena',
		password : '',
		database : 'node_auth'
	}
});

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.get('/data', function (req, res) {
	knex.select('*').from('users')
		.then(function (rows) {
			res.send(rows);			
		})
		.catch(function (err) {
			res.send(err.message);
		})

});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
