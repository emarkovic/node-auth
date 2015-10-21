
var knex = require('knex')({
	client: 'pg',
	connection: {
		host     : '127.0.0.1',
		user     : 'Ena',
		password : '',
		database : 'node_auth'
	}
});
var bcrypt = require('bcrypt');

var user = {username: 'hary', password: 'imhary'};

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        knex.insert(user).into('users')
        	.then(function () {
        		console.log('success');
        		process.exit();
        	});
    });
    
});


