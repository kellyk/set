<?php

class Game {

	private $players;
	private $deck;

	public function __construct(Deck $deck) {
		$this->deck = $deck;
	}

	public function start() {

		// call the deck's deal function and return the cards dealt
		return $this->deck->deal();

	}
}