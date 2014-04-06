<?php

include "deck.php";
include "game.php";

$deck = new Deck();
$game = new Game($deck);
$game->start();