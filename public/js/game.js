// game.js 
//first, checks if it isn't implemented yet
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'? args[number]: match;
			});
		};
	}


function drawCard(card) { 
	var rx = /^([0-9]{1,2}|[AJQK-])([CDHS-])$/i;
	var match = rx.exec(card);
	var rank = match[1], suit = "", symbol;
	switch (match[2]) {
		case "H":
			suit = "hearts";
			symbol = "♠";
			break;
		case "D":
			suit = "diams";
			symbol = "♦";
			break;
		case "C":
			suit = "clubs";
			symbol = "♣";
			break;
		case "S":
			suit = "spades";
			symbol = "♠";
			break;
		default:
			suit = "";
			symbol = "";
			rank = "";
			break;
	}

	if (suit.length === 0) { 
		return '<li><a href="#" class="card back"></a></li>';
	} else { 
		return '<li><a href="#" class="card rank-{0} {1}"><span class="rank">{3}</span><span class="suit">{2}</span></a></li>'.format(rank.toLowerCase(), suit, symbol,rank.toUpperCase());
	}
}

function drawPlayersHand(hand, location) { 
var html = '';
for (var i = 0; i < hand.length; i++) { 
html += '<ul class="playingCards inline simpleCards">';
for (j =0; j < hand[i].length; j++) {
html += drawCard(hand[i][j]);
}	
html +='</ul>';
}
$(location).html(html);
}


var hand = [
["2S","3S","4S","5S","6S",'7S','8S','9S','10S','JS','QS','KS','AS'],
["2H","3H","4H","5H","6H",'7H','8H','9H','10H','JH','QH','KH','AH'],
["2D","3D","4D","5D","6D",'7D','8D','9D','10D','JD','QD','KD','AD'],
["2C","3C","4C","5C","6C",'7C','8C','9C','10C','JC','QC','KC','AC'],
["--"]
];

drawPlayersHand(hand, "#board");