var keystone = require('keystone'),
	Types = keystone.Field.Types,
	_ = require('underscore'),
	shithead = require('./../lib/game.js');

var Game = new keystone.List('Game',{
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Game.add({
	title: { type: String, required: true },
	slug: { type: String, index: true },
	players: { type: Types.Relationship, ref: 'User', many: true },
	currentPlayer: {type: Types.Number, default: 0, required: true },
	playDirection: {type: Types.Number, default: 1, required: true },
	state: { type: Types.Select, options: 'draft, started, finished', default: 'draft' }
});

Game.schema.add({
	wildCards: { type: keystone.mongoose.Schema.Types.Mixed },
	hands: { type: [Object]},
    stack: [String],
    deck: [String]
});


/*** 
  * Static Methods
  */

/** Create a new game for a player and set up the initial conditions */  
Game.schema.statics.createGame = function(title, player,callback) { 
	var game = this({
		title: title,
		players: [player],
		wildCards: shithead.defaultWildCards(),
		deck: shithead.newShuffledPack()
	});

	game.save(function(err,result) { 
		callback(err,result);
	});
}

/** Attempts to get a game based on the current slug */
Game.schema.statics.getBySlug = function(slug, callback) { 
	this.findOne({slug: slug}).exec(function(err,game) {
		callback(err,game);
	});
}

/*** 
  * Methods
  */
/** Adds a player to the game */
Game.schema.methods.addPlayer = function(newPlayer,callback) { 
	// Check to see if the game has started and that this player is not in the game
	if (this.state !== 'draft') { 
		callback({message: 'Game must be in draft to add a player'});
	} else if (_.indexOf(this.playes,newPlayer) !== -1) { 
		callback({message: 'Player is already in the game'});
	} else { 
		this.players.push(newPlayer);
		callback(false,this);
	}
} 

/** Deal the cards to each of the players at the start of the game.  
Will also move the game state */
Game.schema.methods.deal = function (callback) {
	if (this.state === 'draft') { 
		var game = shithead.dealCards(this);
		callback(false,game);
	} else { 
		callback({message: 'Game must be in draft to deal cards'},this);
	}	
}



Game.register();
