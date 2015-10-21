//nerp stack - node express react postgress
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

app.set('view engine', 'jade');
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
	res.render('register', { 
		title: 'Register', 
		message: 'Sign up!'
	});	
})

app.post('/register', function (req, res) {
	var user = {
		username: req.body.username, 
		password: req.body.password
	};

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        user.password = hash;
	        knex
	        	.insert(user)
	        	.returning('id')
	        	.into('users')
	        	.then(function () {
	        		if (id) {
	        			res.render('success', { 
		        			title: 'Successful Registration', 
		        			message: 'Successful Registration'
	        			});
	        		} else {
	        			res.render('fail', { 
		        			title: 'Failed', 
		        			message: 'Registration failed'
	        			});
	        		}	        		
	        	})
	        	.catch(function (err) {
	        		res.render('fail', { 
	        			title: 'Failed', 
	        			message: 'Registration failed'
	        		});
	        	});
	    });
	    
	});	
})

app.get('/login', function (req, res) {
  res.render('login', { 
  	title: 'Hey', 
  	message: 'Hello there!'
  });
});

app.post('/login', function (req, res) {
	knex
		.select()
		.from('users')
		.where({username : req.body.username})
		.then(function (rows) {
			if (rows && rows.length) {
				var user = rows[0].username;
				var pass = rows[0].password;

				bcrypt.compare(req.body.password, pass, function(err, matches) {
					if(matches) {
						res.render('success', { 
							title: 'Successful login', 
							message: 'Successful login'
						});
					} else {
						res.render('fail', { 
							title: 'Failed', 
							message: 'sorry :('
						});			
					}				    
				});


			} else {
				res.render('fail', { 
					title: 'Failed', 
					message: 'sorry :('
				});			
			}
		})
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
