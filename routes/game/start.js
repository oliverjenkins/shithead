var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);
	
	// Set locals
	locals.section = 'game';
	locals.data = {
		game: false
	}

	view.on('init',function(next) { 
		if (req.params.action =='new') {
			// TODO: Create the game based on the two test users
			keystone.list('Game').model.createGame('First Game','5326094602e3599b203dd2fb', function(err,game) {
				game.addPlayer('532db4f504ad986c2405afd3',function(err,game) { 
					game.save();
					locals.data.game = game;
					next();
					
				});
			})
		} else { 
			next();
		}

	});

	// Render the view
	view.render('game/start');
	
}
