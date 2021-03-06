var Game = {
	cards: [],
	selected: [],
	score: 0,
	$board: $('[data-display="game-board"]'),
	$score: $('[data-display="score"]'),
	
	deal: function() {
		var self = this;

		// ajax request to get initial set of cards
		var dealRequest = $.ajax({
			url: 'set.php?action=deal',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				self.cards = data;
				self.displayCards.call(self);
				self.setCardListeners();
				self.setPageListeners();
			}
		});
	},

	displayCards: function() {
		var self = this;

		$.each(this.cards, function(index, card){
			var cardNode = $('<div>');
			cardNode.addClass('card');
			$(cardNode).data({
				'id': card.id,
				'shape': card.shape,
				'color': card.color,
				'number': card.number
			});

			var shapeNode = $('<span>');
			shapeNode.addClass('shape ' + card.color + ' ' + card.shape + ' ' + card.fill);

			for (var i = 0; i < card.number; i++) {
				cardNode.append(shapeNode.clone());
			}
			self.$board.append(cardNode);

			// display 4 cards per row
			if ((index+1) % 4 === 0) {
				self.$board.append($('<div>'));
			}
		});
	},

	setCardListeners: function() {
		var self = this;

		// what happens when a card is clicked:
		this.$board.on('click', '.card', function(e) {
			e.stopImmediatePropagation();
			var card = e.currentTarget;

			// if card is new, add it, otherwise remove it
			var ids = $.map(self.selected, function(el) { return $(el).data("id");});
			if (ids.indexOf($(card).data('id')) >= 0) {
				self.deselectCard(card);
			} else {
				self.selectCard(card);
			}

			if (self.selected.length === 3) {
				self.silentSubmission();
			}
		});
	},

	setPageListeners: function() {
		var self = this;

		// if the user clicks on the page outside the game board, clear selected
		$(document).on('click', function() {
			self.clearSelections.call(self);
		});
	},

	selectCard: function(card) {
		$(card).addClass('selected');
		this.selected.push(card);

		if (this.selected.length > 3) {
			var removed = this.selected.shift();
			$(removed).removeClass('selected');
		}

	},

	deselectCard: function(card) {
		var self = this;
		var index = self.selected.indexOf(card);
		if (index > -1) {
			self.selected.splice(index, 1);
		}
		$(card).removeClass('selected');
	},

	clearSelections: function() {
		$.each(this.selected, function(index, card) {
			$(card).removeClass('selected');
		});
		this.selected = [];
	},

	validateSet: function() {
		var self = this;

		var colors = $.map(self.selected, function(el) { return $(el).data("color");});
		var shapes = $.map(self.selected, function(el) { return $(el).data("shape"); });
		var numbers = $.map(self.selected, function(el) { return $(el).data("number"); });

		return (self.isSet(colors) && self.isSet(shapes) && self.isSet(numbers));
	},

	isSet: function(arr) {
		// a set means the attributes are either all the same or all different
		var reduced = $.unique(arr);
		return (reduced.length === 1 || reduced.length === 3);
	},

	silentSubmission: function() {
		var valid = this.validateSet();
		if (valid) {
			this.submitSet();
		}
	},

	submitSet: function() {
		var self = this;
		var ids = $.map(self.selected, function(el) { return $(el).data("id");});

		// ajax request to get initial set of cards
		var newCardRequest = $.ajax({
			url: 'set.php?action=submit',
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				self.clearCards(ids);
				// to do - implement game complete check on server
				if (!data.gameComplete) {
					self.updateCards(data);
					self.increaseScore();
				} else {
					self.gameWon();
				}
			},
			error: function() {
				console.log(arguments);
			}
		});

		this.clearSelections();
	},

	clearCards: function(ids) {
		// remove submitted cards game's card array and clear the board
		var self = this;
		this.selected = [];
		this.$board.empty();
		var cardIds = $.map(self.cards, function(card) { return card.id; });
		$.each(ids, function(idx, id) {
			var location = cardIds.indexOf(id);
			if (location > -1) {
				cardIds.splice(location, 1);
				self.cards.splice(location, 1);
			}
		});
	},

	updateCards: function(newCards) {
		this.cards = this.cards.concat(newCards);
		this.displayCards();
	},

	increaseScore: function() {
		this.$score.html(++this.score);
	},

	startRound: function() {
		// todo
		// reset timer to 30 seconds
	},

	gameWon: function() {
		alert("you won!");
	},

	gameLost: function() {
		alert("you lost :(");
	}

};

$(document).ready(Game.deal());