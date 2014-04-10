<?php

class CardAttributes {
	public $color;
	public $shape;
	public $fill;
	public $number;
	public $id;

	function __construct($color, $shape, $fill, $number, $id) {
		$this->color = $color;
		$this->shape = $shape;
		$this->fill = $fill;
		$this->number = $number;
		$this->id = $id;
	}
}