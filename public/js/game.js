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
	var html = '<div class="playingCards simpleCards playersHand">';
	for (var i = 0; i < hand.length; i++) { 
		html += '<ul class="inline hand' +  i + '">';
		for (j =0; j < hand[i].length; j++) {
			html += drawCard(hand[i][j]);
		}	
		html +='</ul>';
	}
	$(location).html(html + '</div>');
}


var hand = [
	['10S','JS','QS','KS','AS'],
	["2H","3H","4H"],
	["--","--","--"]
];

drawPlayersHand(hand, "#board");