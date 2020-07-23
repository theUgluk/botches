<?php
ini_set("display_errors", true);
$files = scandir(dirname(__FILE__) . "/Botches");
  //If not a hidden file (starting with '.')
  echo "<ul>";
foreach($files as $file){
  if(strpos($file, "."!== 0) && $file !== "tools") {
    echo "<li><a href='/Botches/" . $file . "/'>" . $file . "</a></li>";
  }
}
