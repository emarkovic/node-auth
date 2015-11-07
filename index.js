//nerp stack - node express react postgres
var bcrypt = require('bcrypt');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var knex = require('knex')({
	client: 'pg',
	connection: {
		host     : '127.0.0.1',
		user     : 'Ena',
		password : '',
		database : 'node_auth'
	}
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());


app.get('/data', function (req, res) {
	knex
		.select('*')
		.from('users')
		.then(function (rows) {
			res.send(rows);			
		})
		.catch(function (err) {
			res.send(err.message);
		})
});

app.get('/register', function (req, res) {
	res.render('register');	
})
app.post('/register', function (req, res) {
	//get the entered user name and pass
	//hash the password
	//try to put into the db
	//	if okay, render the messages page with a success message
	//	if bad, render page with error on it, render the register page with error
	
	var user = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	}
	
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, function (err, hash) {
			user.password = hash;
			knex.insert(user)
				.into('users')
				.then(function () {
					res.render('message', {
						title: 'Successful Registration',
						message: 'Congrats ' + user.name + '!! You have been registered.'
					});
				})
				.catch(function (err) {					
					res.render('register', {
						error: err.message
					})					
				})
		});
	})

})


app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function (req, res) {
	//get email from req
	//pull the row row with that matching email out
	//compair the passwords  of each
	//	if okay, show the message page saying nice login
	//	if not, show login page with error
	//if there was an issue with the query itself, show login error 

	knex.select()
		.from('users')
		.where({email : req.body.email})
		.then(function (rows) {
			if (rows && rows.length) {
				var name = rows[0].name;
				var password = rows[0].password;
				bcrypt.compare(req.body.password, password, function (err, matches) {
					if (matches) {
						res.render('message', {
							title: 'Login Successful!',
							message: 'Welcome ' + name 
						});
					} else {
						res.render('login', {
							error: 'Login failed, try again.'
						});
					}
				})
			} else {
				res.render('login', {
					error: 'Login failed, try again.'
				});
			}
		})
		.catch(function (err) {
			res.render('login', {
				error: 'Login failed, try again.'
			})
		});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
