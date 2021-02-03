<?php
// $opts = [
//     "http" => [
//         "method" => "GET",
//         "header" => "Accept-language: en\r\n" .
//             "Cookie: foo=bar\r\n"
//     ]
// ];
// phpinfo();
$file = file_get_contents('https://api.scryfall.com/sets/akr', false, $context);
var_dump(json_decode($file, true));
