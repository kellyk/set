<?php

include_once "cardAttributes.php";
include_once "card.php";

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

		foreach ($colors as $color) {
			foreach ($shapes as $shape) {
				foreach ($fills as $fill) {
					foreach ($numbers as $number) {
						$cardAttributes = new CardAttributes($color, $shape, $fill, $number);
						$card = new Card($cardAttributes, $this);
					}
				}
			}

		}

	}

	public function removeSet($cards) {

	}

	public function shuffle() {
		shuffle($this->cards);
	}

	public function deal() {
		echo "Dealing...";
	}

	public function threeMore() {

	}

}