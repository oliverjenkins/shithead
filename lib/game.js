// game.js
var _ = require('underscore');

exports.newPack = function() { 
  return ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"];
};
/** 
 * Generates a new shuffled pack of cards
 */
exports.newShuffledPack = function() { 
  return _.shuffle(this.newPack());
};

exports.defaultWildCards = function() { 
  return [
    { cardValue: 2, canBePlayedOn: [2,3,4,5,5,7,8,9,10,11,12,13,14]},
    { cardValue: 10, action: "burnStack"},
    { cardValue: 7, canBePlayedOn: [2,3,4,5,6,7], action: "isTransparent"},
    { cardValue: 4, canBePlayedOn: [2,3,4], action: "changeDirection"}
  ];
}

/**
 * Gets a numeric value for a card with JQKA being 11,12,13,14
 */
exports.cardValue = function(card) {  
  var rx = /^([0-9]{1,2}|[AJQK])[CDHS-]$/i;
  var match = rx.exec(card);

  switch (match[1]) { 
    case "J": return 11; 
    case "Q": return 12;
    case "K": return 13;
    case "A": return 14;
    default: return parseInt(match[1],10);
  }
};

/**
 * Gets the suit of a particular card
 */
exports.cardSuit = function(card) { 
  var rx = /^([0-9]{1,2}|[AJQK])([CDHS])$/i;
  var match = rx.exec(card);
  if (match) { 
    return match[2].toUpperCase();
  } 
  return "";
};
/**
 * Checks to see if the particular card matches a particular wildcard
 */
exports.doesCardMatchWildCard = function(card, wildCard) { 
  var cardValue = this.cardValue(card),
    cardSuit = this.cardSuit(card);

  // Determin what this wildcardevaluates on e.g. Number, Suit, NumberAndSuit
  if (wildCard.cardValue && wildCard.cardSuit) { 
    // Both value and suit
    return (cardValue == wildCard.cardValue && cardSuit == wildCard.cardSuit);
  } else if (wildCard.cardValue) { 
    // Card Value only
    return (cardValue == wildCard.cardValue);
  } else if (wildCard.cardSuit) { 
    // Suit only
    return (cardSuit == wildCard.cardSuit);
  }
  return false;
};

exports.isWildCard = function(card, wildCards ) { 
  var cardValue = this.cardValue(card), cardSuit = this.cardSuit(card);
  if (wildCards === undefined || wildCards.length === 0) { return false; }

  for (var i =0; i < wildCards.length; i++) { 
    // If the card does not match the wild card, keep going through the rest of the wildcards
    if (this.doesCardMatchWildCard(card, wildCards[i])) { 
      return true; 
    }    
  }
  return false;
};

exports.getWildCard = function(card, wildCards) {
  if (wildCards !== undefined && wildCards.length > 0) { 
    for (var i = 0; i < wildCards.length; i++) { 
       if (this.doesCardMatchWildCard(card,wildCards[i])) { 
        return wildCards[i];
       } 
    }
  } 
};

exports.getLastEffectiveCard = function(stack, wildCards) { 
  var wildCard; 

  // Since certain wildcards are transparent, we need this to get the last card
  for (var i = stack.length - 1; i > -1; i--) { 
    if (this.isWildCard(stack[i],wildCards)) {       
      wildCard = this.getWildCard(stack[i], wildCards);
      if (wildCard.action == "isTransparent") {         
        continue;
      }
    }
    return stack[i];    
  }  

  return "0-"; // Refers to an empty stack
};

exports.canWildCardBePlayed = function(wildCard, lastCard) { 
  var lastCardValue = this.cardValue(lastCard);

  if (wildCard.canBePlayedOn) { 
    for (var i = 0; i < wildCard.canBePlayedOn.length; i++) { 
      if (wildCard.canBePlayedOn[i] == lastCardValue) { 
        return true;
      }
    }
  } else { 
    // No canBePlayedOn filter, which implies it can be played on anything
    return true;
  }
  return false;
};

exports.canPlayOnWildCard = function(wildCard, card) {
  var cardValue = this.cardValue(card);

  if (wildCard.canAccept) { 
    for (var i= 0; i < wildCard.canAccept.length; i++) { 
      if (wildCard.canAccept[i] == cardValue) { 
        return true; 
      }
    }
  } else { 
    return true;
  }
  return false;
};

exports.canPlayCardOnStack = function(card, stack, wildCards) { 
  // Checks to see if the card can be played on a the stack 
  var cardValue = this.cardValue(card), cardSuit = this.cardSuit(card),
    isWildCard = this.isWildCard(card,wildCards), wildCard = this.getWildCard(card,wildCards),
    lastCard, lastCardValue, lastCardSuit,isLastCardWild;

  if (stack === undefined || stack.length === 0) { 
    // The stack is empty, so of course this card can be played.
    return true;
  } 

  // Get the details of the card being played and the last card  
  lastCard = this.getLastEffectiveCard(stack, wildCards);
  lastCardValue = this.cardValue(lastCard);
  lastCardSuit = this.cardSuit(lastCard);    
  lastWildCard = this.getWildCard(lastCard, wildCards);  
  lastCardIsWild = this.isWildCard(lastCard,wildCards);

  if (isWildCard && isLastCardWild) {     
    return (this.canWildCardBePlayed(wildCard, lastCard) && this.canPlayOnWildCard(lastWildCard, card));
  } else if (lastCardIsWild) { 
    return this.canPlayOnWildCard(lastWildCard, card);
  } else if (wildCard) { 
    return this.canWildCardBePlayed(wildCard,lastCard);
  } else {     
    return cardValue >= lastCardValue;
  }
} ;

exports.playCardOnStack = function(card, game) { 
  // adds and processes the card to the stack.  Will assume the card can be played
  if (game.stack === undefined) { 
    game.stack = [];
  }
  if (this.isWildCard(card,game.wildCards)) { 
    var wildCard = this.getWildCard(card, game.wildCards); 
    if (wildCard.action == "burnStack") { 
      game.stack = [];
      return;
    } else if (wildCard.action == "changeDirection") {
      game.playDirection *= -1;
    }
  }
  // Otherwise push the card on to the stack
  game.stack.push(card);

  if (game.stack.length >= 4) { 
    var cardValue = this.cardValue(card);

    // Check to see if there is 4 cards of the same value at the end of the stack 
    for (var i = game.stack.length - 4; i < game.stack.length-2; i++) { 
      if (this.cardValue(game.stack[i]) != cardValue) { 
        return;
      }
    }
    // Last 4 are all the same so return an empty stack;
    game.stack = [];
  }
};

exports.newGame = function(players,wildCards)  { 
  var newGame = {
    stack: [],
    deck: [],
    players: players,
    currentPlayer: 0,
    playDirection: 1,
    wildCards: wildCards,
    hands: []
  };

  for (var i = 0; i < players.length; i++) { 
    newGame.hands[i] =  [[],[],[]]
  }
  return newGame;

};


exports.dealCards = function(game) { 

  var numberPlayers= game.players.length;   
  for (var i = 0; i < numberPlayers; i++) { 
    game.hands[i] =  [[],[],[]];
  }

  for (var hand = 0; hand < 3; hand++) { 
    for (var card = 0; card < 3; card++) { 
      for (var player = 0; player < numberPlayers; player++) {
        game.hands[player][hand].push( game.deck.shift());
      }
    }
  }

  return game;
};

exports.handToPlayFrom = function(playersHand) { 
  // Determin the hand to play from
  if (playersHand[0].length === 0 && playersHand[1].length === 0 && playersHand[2].length === 0) { 
    return -1; // Player has won the game
  } else if (playersHand[0].length === 0 && playersHand[1].length === 0 ) { 
    return 2;   // Refers to those cards face down
  } else if (playersHand[0].length === 0 ) { 
    return 1;   // The three face up cards
  }

  return 0; // Players hand
} ;

exports.isCardInPlayersHand = function(card, playersHand) { 
  // Is this card in the playersHand
  var handBeingPlayed = this.handToPlayFrom(playersHand);

  return _.indexOf(playersHand[handBeingPlayed], card) !== -1;
}


exports.playCard = function(player, card, game)  { 
  // Move the card being played from the appropriate hand, to the stack
  var handBeingPlayed = this.handToPlayFrom(game.hands[player]);
  var cardIndex = _.indexOf(game.hands[player][handBeingPlayed],card);
  console.log
  if (cardIndex > -1) { 
    card = game.hands[player][handBeingPlayed].splice(cardIndex,1)[0];
    
    this.playCardOnStack(card, game);
    // Are there cards in the deck - if so then player must pick up one
    if (game.deck.length > 0 ) { 
      game.hands[player][0].push(game.deck.shift());
    }
  }

  return game;
};