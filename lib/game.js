// game.js

exports.newPack = function() { 
  var deck = [], suits = ["C","D","H","S"], card;
  for (var suit in suits) {
    for (var i = 2; i <= 14; i++) { 
      switch (i) {         
        case 11:
          card = 'J';          
          break;
        case 12:
          card = 'Q';
          break;
        case 13: 
          card = 'K';
          break;
        case 14: 
          card = 'A';
          break;          
        default:
          card = String(i);
      }
      deck.push(card + suits[suit]);
    }
  }
  return deck;
};

exports.newShuffledPack = function() { 
  return this.newPack().sort(function() { return 0.5 - Math.random();});
};

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

exports.cardSuit = function(card) { 
  var rx = /^([0-9]{1,2}|[AJQK])([CDHS])$/i;
  var match = rx.exec(card);
  if (match) { 
    return match[2].toUpperCase();
  } 
  return "";
};

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
    drawPile: [],
    players: [],
    currentPlayer: 0,
    playDirection: 1,
    wildCards: wildCards
  };

  for (var i = 0; i < players.length; i++) { 
    newGame.players[i] = { 'name': players[i], 'hand': [[],[],[]] };
  }
  return newGame;

};


exports.dealCards = function(game,pack) {   
  var numberPlayers= game.players.length;   
  for (var hand = 0; hand < 3; hand++) { 
    for (var card = 0; card < 3; card++) { 
      for (var player = 0; player < numberPlayers; player++) {
        game.players[player].hand[hand].push( pack.shift());
      }
    }
  }
  game.drawPile = pack;

  return game;
};

exports.handToPlayFrom = function(playersHand) { 
  // Determin the hand to play from
  if (playersHand[0].length === 0 && playersHand[1].length === 0 && playersHand[2].length === 0) { 
    return -1; // Player has won the game
  } else if (playersHand[0].length === 0 && playersHand[1].length === 0 ) { 
    return 2;
  } else if (playersHand[0].length === 0 ) { 
    return 1;
  }

  return 0;
} ;


exports.playCard = function(player, cardIndex, game)  { 
  // Move the card being played from the appropriate hand, to the stack
  var handBeingPlayed = this.handToPlayFrom(game.players[player].hand);

  var card = game.players[player].hand[handBeingPlayed].splice(cardIndex,1)[0];
  
  this.playCardOnStack(card, game);

  return game;
};