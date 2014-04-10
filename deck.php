<?php

include_once "cardAttributes.php";
include_once "card.php";
include_once "functions.php";

class Deck {

	public $cards = array();

	public function __construct() {
		$this->createDeck();
	}

	private function createDeck() {
		// need one card of each combo of color/shape/fill/number
		$colors = array('green', 'red', 'purple');
		$shapes = array('oval', 'diamond', 'wave');
		$fills = array('filled', 'shaded', 'empty');
		$numbers = array(1, 2, 3);

		$index = 1;

		foreach ($colors as $color) {
			foreach ($shapes as $shape) {
				foreach ($fills as $fill) {
					foreach ($numbers as $number) {
						$cardAttributes = new CardAttributes($color, $shape, $fill, $number, $index);
						$card = new Card($cardAttributes, $this);
						$index++;
					}
				}
			}

		}

	}

	public function removeSet($cards) {
		
	}

	private function shuffle() {
		shuffle($this->cards);
	}

	public function deal() {
		// shuffle the deck
		$this->shuffle();

		// remove 12 cards from the top and return them
		$dealtCards = array_chop($this->cards, 12);
		return $dealtCards;
	}

	public function threeMore() {
		return array_chop($this->cards, 3);
	}

}