//nerp stack - node express react postgress
var bcrypt = require('bcrypt');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded());

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

app.get('/login', function (req, res) {
  res.render('login', { title: 'Hey', message: 'Hello there!'});
});

app.post('/login', function (req, res) {

	knex.select('*').from('users').where({username : req.body.username})
		.then(function (rows) {
			console.log(rows);
			if (rows && rows.length) {
				var user = rows[0].username;
				var pass = rows[0].password;

				bcrypt.compare(req.body.password, pass, function(err, matches) {
					if(matches) {
						res.render('success', { title: 'Successful login', message: 'Congrats'});
					} else {
						res.render('fail', { title: 'Failed', message: 'sorry :('});			
					}				    
				});


			} else {
				res.render('fail', { title: 'Failed', message: 'sorry :('});			
			}
		})
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
