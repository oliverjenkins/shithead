var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);
	
	// Set locals
	locals.section = 'home';
	
	locals.data = {
		
	};

	view.on('init', function(next) { 
		keystone.list('Test').model.find().exec(function(err, results) {
			

			//results[0].items.push({code: '1233', quantity: 7});
			//results[0].save();

			locals.data.tests = results;
			next();
		});

	});


	// Render the view
	view.render('index');
	
}
