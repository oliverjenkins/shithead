
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Shit Head' , body: '<h1>Hello World</h1><div id="board"></div>'});
};