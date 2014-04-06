<?php

include_once "cardAttributes.php";

class Card {
	private $shape;
	private $color;
	private $fill;
	private $number;

	public function __construct(CardAttributes $attributes, Deck $deck) {
		
		foreach ($attributes as $attribute => $value) {
			$this->{$attribute} = $value;
		}

		$deck->cards[] = $this;
	}
}