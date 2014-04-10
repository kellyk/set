<?php

include "deck.php";
include "game.php";

session_start();

$deck;

if (isset($_GET['action']) && $_GET['action'] == 'deal') {
	$_SESSION['deck'] = new Deck();
	$_SESSION['game'] = new Game($_SESSION['deck']);
	$game = $_SESSION['game'];
	echo json_encode($game->start());
} else if (isset($_GET['action']) && $_GET['action'] == 'submit'){
	$deck = $_SESSION['deck'];
	echo json_encode($deck->threeMore());
}