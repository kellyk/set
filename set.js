var Game = {
	cards: [],
	selected: [],
	score: 0,
	$board: $('[data-display="game-board"]'),
	$score: $('[data-display="score"]'),
	submitButton: $('[data-action="submit"]'),
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
			$(cardNode).data('id', card.id);
			$(cardNode).data('shape', card.shape);
			$(cardNode).data('color', card.color);
			$(cardNode).data('number', card.number);

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

		// trigger submit when enter button key is pressed
		$(document).keypress(function(e) {
			if (e.which == 13 && !self.submitButton.prop('disabled')) {
				self.submitButton.click();
			}
		});

		// what happens when a card is clicked:
		this.$board.on('click', '.card', function(e) {
			e.stopImmediatePropagation();

			// if card is new, add it, otherwise remove it
			var ids = $.map(self.selected, function(el) { return $(el).data("id");});
			if (ids.indexOf($(e.currentTarget).data('id')) >= 0) {
				self.deselectCard(e.currentTarget);
			} else {
				self.selectCard(e.currentTarget);
			}

			// when a card is selected or deselected, toggle the submit button
			self.toggleSubmitButton();
		});
	},

	setPageListeners: function() {
		var self = this;

		this.submitButton.on('click', function() {
			self.attemptSubmission.call(self);
		});

		// if the user clicks on the page outside the game board, clear selected
		$(document).on('click', function() {
			self.clearSelections.call(self);
		});
	},

	toggleSubmitButton: function() {
		this.submitButton.prop('disabled', (this.selected.length !== 3));
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
		$.each(this.selected, function(index, el) {
			$(el).removeClass('selected');
		});
		this.selected = [];
		this.submitButton.prop('disabled', true);
	},

	validateSet: function() {
		var self = this;

		var colors = $.map(self.selected, function(el) { return $(el).data("color");});
		var shapes = $.map(self.selected, function(el) { return $(el).data("shape"); });
		var numbers = $.map(self.selected, function(el) { return $(el).data("number"); });

		if (self.isSet(colors) && self.isSet(shapes) && self.isSet(numbers)) {
			return { validated: true, message: 'success'};
		} else {
			return { validated: false, message: 'Oops! That is not a set!' };
		}
	},

	isSet: function(arr) {
		// a set means the attributes are either all the same or all different
		var reduced = $.unique(arr);
		return (reduced.length === 1 || reduced.length === 3);
	},

	displayError: function(error) {
		alert(error);
	},

	attemptSubmission: function() {
		var response = this.validateSet();
		if (response.validated) {
			this.submitSet();
		} else {
			this.displayError(response.message);
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
				if (!data.gameComplete) {
					self.updateCards(data);
					self.increaseScore();
				} else {
					self.gameWon();
				}
			},
			error: function() {
				console.log(arguments);
				self.clearCards(ids);
				self.displayCards();
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