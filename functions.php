<?php

function array_chop(&$arr, $num)
{
    $ret = array_slice($arr, 0, $num);
    $arr = array_slice($arr, $num);
    return $ret;
}