<?php
ini_set("display_errors", true);
$files = scandir(dirname(__FILE__) . "/Botches");
echo "<ul>";
foreach($files as $file){
var_dump($file);
  //If not a hidden file (starting with '.')
  if(strpos($file, "."!== 0) && $file !== "tools") {
    echo "<li><a href='/Botches/" . $file . "/'>" . $file . "</a></li>";
  }
}
