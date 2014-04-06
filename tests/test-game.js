var game = require('../lib/game.js');

var wildCards = [
  { cardValue: 2, canBePlayedOn: [2,3,4,5,5,7,8,9,10,11,12,13,14]},
  { cardValue: 10, action: "burnStack"},
  { cardValue: 7, canBePlayedOn: [2,3,4,5,6,7], action: "isTransparent"},
  { cardValue: 5, canBePlayedOn: [2,3,4,11], canAccept: [2,3,4,5]},
  { cardValue: 4, canBePlayedOn: [2,3,4], action: "changeDirection"}
];


exports.checkValidDeck = function(test ) { 
  // Checks to see if a card is valid
  var deck = game.newPack();
  test.equal(deck.length,52,"Pack does not contain 52 cards");
  test.deepEqual(deck, ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"],"Pack is not valid");
  
  var shuffledDeck = game.newShuffledPack().sort();
  test.deepEqual(shuffledDeck , [ '10C',  '10D',  '10H',  '10S',  '2C',  '2D',  '2H',  '2S',  '3C',  '3D',  '3H',  '3S',  '4C',  '4D',  '4H',  '4S',  '5C',  '5D',  '5H',  '5S',  '6C',  '6D',  '6H',  '6S',  '7C',  '7D',  '7H',  '7S',  '8C',  '8D',  '8H',  '8S',  '9C',  '9D',  '9H',  '9S',  'AC',  'AD',  'AH',  'AS',  'JC',  'JD',  'JH',  'JS',  'KC',  'KD',  'KH',  'KS',  'QC',  'QD',  'QH',  'QS' ],"Shuffled pack is not valid");

  test.done();
}

exports.cardValue = function(test) { 
  
  // we check to see if all card in the pack are valid, 
  test.equal(game.cardValue("2H"),2,"2H did not match 2");
  test.equal(game.cardValue("6D"),6,"6D did not match 6");
  test.equal(game.cardValue("10H"),10,"10H did not match 10");
  test.equal(game.cardValue("JS"),11,"JS did not match 11");
  test.equal(game.cardValue("QH"),12,"QH did not match 12");
  test.equal(game.cardValue("KC"),13,"KC did not match 13");
  test.equal(game.cardValue("AH"),14,"AH did not match 14");

  test.equal(game.cardSuit("2H"),"H","2H did not match H");
  test.equal(game.cardSuit("6D"),"D","6D did not match D");
  test.equal(game.cardSuit("10H"),"H","10H did not match H");
  test.equal(game.cardSuit("Js"),"S","JS did not match S");
  test.equal(game.cardSuit("QH"),"H","QH did not match H");
  test.equal(game.cardSuit("Kc"),"C","KC did not match C");
  test.equal(game.cardSuit("AH"),"H","AH did not match H");
  test.done();
}

exports.isWildCard = function(test) { 
  var wildCards = [
    { cardValue: 2, canBePlayedOn: [2,3,4,5,5,7,8,9,10,11,12,13,14]},
    { cardValue: 10, cardSuit: "H", canBePlayedOn: [2,3,4,5,5,7,8,9,10,11,12,13,14]},
    { cardSuit: "S" }
  ];

  //exports.isWildCard = function(card, wildCards )
  test.equal(game.isWildCard("2H", wildCards), true, "2H should be a wild card");
  test.equal(game.isWildCard("6H", wildCards), false, "6H should NOT be a wild card");
  test.equal(game.isWildCard("10D", wildCards), false, "10D should NOT be a wild card");
  test.equal(game.isWildCard("10H", wildCards), true, "10H should be a wild card");
  test.equal(game.isWildCard("9S", wildCards), true, "All spades should be a wild card")
  test.done();
}

exports.canPlayCardOnStack = function(test) { 
  var wildCards = [
    { cardValue: 2, canBePlayedOn: [2,3,4,5,5,7,8,9,10,11,12,13,14]},
    { cardValue: 10, action: "burnStack"},
    { cardValue: 7, canBePlayedOn: [2,3,4,5,5,7], action: "isTransparent"},
    { cardValue: 5, canBePlayedOn: [2,3,4,11], canAccept: [2,3,4,5]}
  ];

  test.equal(game.canPlayCardOnStack("3H"), true, "Card cannot be played on an empty stack");
  test.equal(game.canPlayCardOnStack("4D", ["5H","3D"]), true, "4 card should be able to played on a 3 card");
  test.equal(game.canPlayCardOnStack("4D", ["5H","3D","6H"]), false, "4 card should not be able to played on a 6 card");
  test.equal(game.canPlayCardOnStack("AD", ["5H","3D","6H"]), true, "A card should be able to played on a 6 card");
  test.equal(game.canPlayCardOnStack("KH", ["5H","3D","6H","KD"]), true, "K should be able to be played on a K");
  test.equal(game.canPlayCardOnStack("JH", ["5H","3D","6H","KD"]), false, "J should not be able to be played on a K");
  test.equal(game.canPlayCardOnStack("AH", ["5H","3D","6H","KD"]), true, "A should be able to be played on a K");
  test.equal(game.canPlayCardOnStack("AH", ["5H","3D","6H","KD"]), true, "A should be able to be played on a K");
  test.equal(game.canPlayCardOnStack("2D", ["5H","3D","6H","KD"], wildCards ), true, "2 as wild should be able to be played on a K");
  test.equal(game.canPlayCardOnStack("10D", ["5H","3D","6H","KD"], wildCards ), true, "10 as wild should be able to be played on a K");
  test.equal(game.canPlayCardOnStack("10D", ["5H","3D","6H","JD"], wildCards ), true, "You Can play 5 on a Jack");
  test.equal(game.canPlayCardOnStack("8S", ["5H","3D","6H","KD","5H"], wildCards ), false, "5 is lower than, so can't play an 8 on it");  
  test.equal(game.canPlayCardOnStack("5S", ["5H","3D","6H","KD","5H"], wildCards ), true, "You should be able to play a 5 on a 5");  
  
  // Transparency wild cards
  test.equal(game.canPlayCardOnStack("8S", ["5H","3D","6H","9D","7H"], wildCards ), false, "Transparent 7 gives a 9, so can't play the 8");    
  test.equal(game.canPlayCardOnStack("JS", ["5H","3D","6H","QD","7H"], wildCards ), false, "Transparent 7 gives a Q, so can't play the J");    
  test.equal(game.canPlayCardOnStack("6S", ["5H","3D","6H","7D","7H"], wildCards ), true, "Transparent 7 gives a 3, so can play the 6." );    
  test.equal(game.canPlayCardOnStack("8S", ["5H","3D","6H","5D","7H"], wildCards ), false, "Transparent 7 gives a 'lower than' 5, so can't play the 6." );    
  test.equal(game.canPlayCardOnStack("6S", ["5H","3D","6H","3D","7H"], wildCards ), true, "Transparent 7 gives a 3, so can play the 6.");    
  test.equal(game.canPlayCardOnStack("6S", ["7H"], wildCards ), true, "Transparent 7 gives a 0, so can play the 6");  
  
  test.done();
}

exports.dealCards = function(test) { 
  var newGame = game.newGame(3,[]);
  newGame.players = ['Player1', 'Player2','Player3'];
  newGame.deck = ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"];
  newGame = game.dealCards(newGame);
  test.deepEqual(newGame.hands[0], [ [ '2C', '5C', '8C' ], [ 'JC', 'AC', '4D' ], [ '7D', '10D', 'KD' ] ], 'Player 1 hand is not corret');
  test.deepEqual(newGame.hands[1], [ [ '3C', '6C', '9C' ], [ 'QC', '2D', '5D' ], [ '8D', 'JD', 'AD' ] ], 'Player 2 hand is not correct');
  test.deepEqual(newGame.hands[2], [ [ '4C', '7C', '10C' ], [ 'KC', '3D', '6D' ], [ '9D', 'QD', '2H' ] ], 'Player 3 hand is not correct');
  test.deepEqual(newGame.deck,["3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"],'Deck is not correct' )

  test.done();
}


exports.playCardOnStack = function(test) { 
  var newGame = {
    stack: ["2H","3D"],
    drawPile: [],
    players: [
      {
        'name': 'Player 1',
        'hand': [[],[],[]]
      },
            {
        'name': 'Player 2',
        'hand': [[],[],[]]
      }
    ],
    currentPlayer: 0,
    playDirection: 1,
    wildCards: wildCards
  }
  game.playCardOnStack("8S", newGame);
  test.deepEqual(newGame.stack, ["2H","3D","8S"], "Could not add simple card to the stack: " + newGame.stack );
  
  newGame.stack = ["2H","3D","8H","8D","8C"];
  game.playCardOnStack("8S",newGame);
  test.deepEqual(newGame.stack, [], "With 4 x 8 the stack should have burnt: " + newGame.stack );

  newGame.stack = ["2H","3D","8H","8D","9D", "8C"];
  game.playCardOnStack("8S",newGame);
  test.deepEqual(newGame.stack,["2H","3D","8H","8D","9D", "8C", "8S"], "Should have added to the stack " );

  newGame.stack = ["2H","3D","8H","9D","8D","8C"];
  game.playCardOnStack("8S", newGame);
  test.deepEqual(newGame.stack, ["2H","3D","8H","9D","8D","8C","8S"], "SHould have added to stack, not burnt it" );

  newGame.stack = ["8H","8D","8C"];
  game.playCardOnStack("8S",newGame);
  test.deepEqual(newGame.stack, [], "Should have burnt the stack" );

  game.playCardOnStack("10S",newGame);
  test.deepEqual(newGame.stack, [], "Should have burnt the stack: " + newGame.stack);

  test.done();
}

exports.handToPlayFrom = function(test) { 


  test.deepEqual(0,game.handToPlayFrom([["2S","3S","3S"],["2S","3S","3S"],["2S","3S","3S"]]),"Card should have played from hand 0");
  test.deepEqual(0,game.handToPlayFrom([["3S","3S"],["2S","3S","3S"],["2S","3S","3S"]]),"Card should have played from hand 0");
  test.deepEqual(0,game.handToPlayFrom([["3S"],["2S","3S","3S"],["2S","3S","3S"]]),"Card should have played from hand 0");


  test.deepEqual(1,game.handToPlayFrom([[],["2S","3S","3S"],["2S","3S","3S"]]),"Card should have played from hand 1");
  test.deepEqual(1,game.handToPlayFrom([[],["2S","3S"],["2S","3S","3S"]]),"Card should have played from hand 1");
  test.deepEqual(1,game.handToPlayFrom([[],["2S"],["2S","3S","3S"]]),"Card should have played from hand 1");
  test.deepEqual(1,game.handToPlayFrom([[],["8C","10C","QC"],["AC","3D","5D"]]), "Should have played from hand 1")

  test.deepEqual(2,game.handToPlayFrom([[],[],["2S","3S","3S"]]),"Card should have played from hand 2");
  test.deepEqual(2,game.handToPlayFrom([[],[],["3S","3S"]]),"Card should have played from hand 2");
  test.deepEqual(2,game.handToPlayFrom([[],[],["3S"]]),"Card should have played from hand 2");
  

  test.deepEqual(0,game.handToPlayFrom([["3S"],[],["3S","3S"]]),"Card should have played from hand 0");
  test.deepEqual(0,game.handToPlayFrom([["3S"],[],[]]),"Card should have played from hand 0, end game scenaro");

  test.deepEqual(-1,game.handToPlayFrom([[],[],[]]),"Should have won the game");
  test.done();
}

exports.isCardInPlayersHand = function(test) { 
  test.equal(game.isCardInPlayersHand( "2S",[["2S","3S","3S"],["8C","10C","QC"],["AC","3D","5D"]]),true,"Card is in players hand");
  test.equal(game.isCardInPlayersHand( "8C",[["2S","3S","3S"],["8C","10C","QC"],["AC","3D","5D"]]),false,"Card is not in players hand");

  test.equal(game.isCardInPlayersHand( "8C",[[],["8C","10C","QC"],["AC","3D","5D"]]),true,"Card is in players hand");
  test.equal(game.isCardInPlayersHand( "2SS",[[],["8C","10C","QC"],["AC","3D","5D"]]),false,"Card is not in players hand");
  test.equal(game.isCardInPlayersHand( "AC",[[],["8C","10C","QC"],["AC","3D","5D"]]),false,"Card is not in players hand");

  test.equal(game.isCardInPlayersHand( "AC",[[],[],["AC","3D","5D"]]),true,"Card is in players hand");
  test.equal(game.isCardInPlayersHand( "2S",[[],[],["AC","3D","5D"]]),false,"Card is not in players hand");
  test.equal(game.isCardInPlayersHand( "AC",[[],[],[]]),false,"Hands are empty Card is not in players hand");

  test.done();
}

exports.playCard = function(test) { 
  
  var newGame = game.newGame(['Player 1','Player 2'],wildCards);

  test.deepEqual(newGame, {
    stack: [],
    deck: [],
    players: ['Player 1','Player 2'],
    currentPlayer: 0,
    playDirection: 1,
    wildCards: wildCards,
    hands: [[ [], [], [] ],[ [], [], [] ]]
  }, "New game is not re-set correctly");


  test.deepEqual(game.newPack(), ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"],"Pack is not valid");  
  newGame.deck = ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"];

  newGame = game.dealCards(newGame);

  test.deepEqual(newGame.hands[0], [["2C","4C","6C"],["8C","10C","QC"],["AC","3D","5D"]],"Hand for player 1 is not correct");
  test.deepEqual(newGame.hands[1], [["3C","5C","7C"],["9C","JC","KC"],["2D","4D","6D"]],"Hand for player 2 is not correct");
  test.deepEqual(newGame.deck, ["7D","8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"], "Deck is not correct");
  test.deepEqual(newGame.stack, [],"Stack does not start empty");

  // Players playing cards
  game.playCard(0,'4C', newGame);  // Playing card 4C - also should pick up from the deck
  test.deepEqual(newGame.hands[0], [["2C","6C","7D"],["8C","10C","QC"],["AC","3D","5D"]],"Playing card, Hand for player 1 is not correct");
  test.deepEqual(newGame.deck, ["8D","9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"], "Deck is not correct after card played");
  test.deepEqual(newGame.stack, ["4C"], "Stack is not valid following players move 1: " + newGame.stack);
  
  // // //  Player playing a card
  game.playCard(0,'2C', newGame);
  test.deepEqual(newGame.hands[0], [["6C",'7D','8D'],["8C","10C","QC"],["AC","3D","5D"]],"Playing card, Hand for player 1 is not correct after move 2");
  test.deepEqual(newGame.stack, ["4C","2C"], "Stack is not valid following players move number 2");
  test.deepEqual(newGame.deck, ["9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"], "Deck is not correct after card played");
  test.equal(newGame.playDirection, -1, "Play direction should have changed following a 4");

  // Try a card not in the hand
  game.playCard(0,'KH', newGame);
  test.deepEqual(newGame.hands[0], [["6C",'7D','8D'],["8C","10C","QC"],["AC","3D","5D"]],"Playing card, Hand for player 1 after incorrect more");
  test.deepEqual(newGame.deck,["9D","10D","JD","QD","KD","AD","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS"],'Deck is not valid after incorrect more')
  test.deepEqual(newGame.stack, ["4C","2C"], "Stack is not valid following incorrect more");

  // // //  Player playing a card
  game.playCard(0,'8D', newGame);
  test.deepEqual(newGame.hands[0], [["6C",'7D','9D'],["8C","10C","QC"],["AC","3D","5D"]],"Playing card, Hand for player 1 is not correct after move 3");
  test.deepEqual(newGame.stack, ["4C","2C","8D"], "Stack is not valid following players move number 3");

  // // Skip ahead until the stack is cleared
  newGame.deck = [];
  game.playCard(0,'9D', newGame);
  test.deepEqual(newGame.hands[0], [["6C",'7D'],["8C","10C","QC"],["AC","3D","5D"]],"Playing card, Hand for player 1 is not correct after move 4");
  test.deepEqual(newGame.deck,[],'Deck is not valid')
  test.deepEqual(newGame.stack, ["4C","2C","8D","9D"], "Stack is not valid following players move number 4");

  
  newGame.hands[0][0] = [];
  game.playCard(0,'QC', newGame);
  test.deepEqual(newGame.hands[0], [[],["8C","10C"],["AC","3D","5D"]],"Playing card, Hand for player 1 is not correct after move 5");
  test.deepEqual(newGame.stack, ["4C","2C","8D","9D","QC"], "Stack is not valid following players move number 5");
  test.deepEqual(game.isWildCard("10C",newGame.wildCards),true, "10c should be wild");
  
  game.playCard(0,'10C', newGame);
  test.deepEqual(newGame.hands[0], [[],["8C"],["AC","3D","5D"]],"Playing card, Hand for player 1 is not correct after move 6");
  test.deepEqual(newGame.stack, [], "Stack should have been cleared: " +  newGame.stack);

  test.done();
}

