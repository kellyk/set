<?php

class Card {
	public $shape;
	public $color;
	public $fill;
	public $number;
	public $id;

	public function __construct(CardAttributes $attributes, Deck $deck) {
		
		foreach ($attributes as $attribute => $value) {
			$this->{$attribute} = $value;
		}

		$deck->cards[] = $this;
	}
}