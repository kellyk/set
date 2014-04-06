<?php

class Game {

	private $players;
	private $deck;

	public function __construct(Deck $deck) {
		$this->deck = $deck;
	}

	public function start() {

		$this->deck->deal();

	}
}