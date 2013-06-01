// game.js 
/*
//first, checks if it isn't implemented yet
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'? args[number]: match;
			});
		};
	}

var cardDetails = {
	suits: { 
		'H': ['heart', '&#9829;'],
		'C': ['club', '&#9827;'],
		'D': ['diamond', '&#9830;'],
		'S': ['spade', '&#9824;']
	},
	cards: ['two','three','four','five','six','seven','eight','nine','ten','jack','queen','king','ace'],
	faceLayout: [
		['top_center','bottom_center'],
		['top_center','middle_center','bottom_center'],
		['top_left','top_right','bottom_left','bottom_right'],
        ['top_left', 'top_right', 'middle_center','bottom_left','bottom_right'],
        ['top_left', 'top_right', 'middle_left','middle_right','bottom_left','bottom_right'],
        ['top_left', 'top_right', 'middle_left','middle_top','middle_right','bottom_left','bottom_right'],
        ['top_left', 'top_right', 'middle_top_left', 'middle_top_right', 'bottom_left', 'bottom_right', 'middle_bottom_left', 'middle_bottom_right'],
        ['top_left', 'top_right', 'middle_top_left', 'middle_center', 'middle_top_right', 'bottom_left', 'bottom_right', 'middle_bottom_left', 'middle_bottom_right'],
		['top_left','top_right','middle_top_left', 'middle_top_center', 'middle_top_right', 'bottom_left', 'bottom_right', 'middle_bottom_center', 'middle_bottom_left', 'middle_bottom_right'],
		['middle_center']
	]
}

function drawCard(card) { 
	if (card === '--') { 
		return '<div class="card"><div class="back"> </div></div>';
	}

	var rx = /^([0-9]{1,2}|[AJQK-])([CDHS-])$/i;
	var match = rx.exec(card), faceLayout, faceNumber;
	switch (match[1]) { 
		case "J":
		case "Q":
		case "K":
		case "A":
			faceNumber = 9;
			break;
		default:
			faceNumber = parseInt(match[1]) - 2;
	}
	var html = '<div class="card ' + cardDetails.suits[match[2]][0] + '">\
		<div class="corner top">\
			<span class="number">' + match[1] + '</span>\
			<span>' + cardDetails.suits[match[2]][1] + '</span>\
		</div>';
	
	faceLayout = cardDetails.faceLayout[faceNumber];
	for (var i = 0; i < faceLayout.length; i++) {  
		html +=	'<span class="suit ' + faceLayout[i] + '">' + cardDetails.suits[match[2]][1] + '</span>'
	}

	html +='	<div class="corner bottom">\
			<span class="number">' + match[1] + '</span>\
			<span>' + cardDetails.suits[match[2]][1] + '</span>\
		</div>\
	</div>';
	return html;
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
*/

var hand = [
	['10S','JS','QS','KS','AS'],
	["2H","3H","4H"],
	["--","--","--"]
];

//drawPlayersHand(hand, "#board");

var App = Ember.Application.create({});

App.IndexRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('content', {firstName: 'oliver', lastName: 'jenkins',colors: ['red', 'yellow', 'blue']} );
  }
});