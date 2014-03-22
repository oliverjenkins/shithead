var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);
	
	// Set locals
	locals.section = 'game';


	view.on('init',function(next) { 
		keystone.list('Game').model.createGame('First Game','5326094602e3599b203dd2fb', function(err,game) {
			
			game.addPlayer('532db4f504ad986c2405afd3',function(err) { 
				console.log(game)
				console.log('Add Player Error',err);
				game.deal(function(err) { 
					console.log('Deal error',err);
					console.log(game);
				})

			});

		})


		next();
	});

	// Render the view
	view.render('index');
	
}
