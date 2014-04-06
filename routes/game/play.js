var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);
	
	// Set locals
	locals.section = 'game';
	locals.data = {
		game: false 
	}

	// Get the details of the game based on the slug
	view.on('init',function(next){ 
		keystone.list('Game').model.getBySlug(req.params.gameSlug,function(err,game) { 
			locals.data.game = game;
			next();
		});
	});

	// Method to start the game
	view.on('post',function(next) { 
		if (req.params.action == 'start') { 
			if (locals.data.game.state == 'draft') {
				// So deal the cards and start the game
				locals.data.game.deal(function(err,game) { 
					game.state = 'started';
					game.save(function(err) { 
						locals.data.game = game;

						console.log('Game has been saved',game.hands[0]);
						next();
					})
				})
			} else { 
				next();
			}
		} else { 
			next();
		}
	});


	// Render the view
	view.render('game/play');
	
}
