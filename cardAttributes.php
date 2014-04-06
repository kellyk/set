<?php

class CardAttributes {
	public $color;
	public $shape;
	public $fill;
	public $number;

	function __construct($color, $shape, $fill, $number) {
		$this->color = $color;
		$this->shape = $shape;
		$this->fill = $fill;
		$this->number = $number;
	}
}