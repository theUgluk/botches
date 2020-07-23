<?php
ini_set("display_errors", true);
$files = scandir(dirname(__FILE__) . "/Botches");
echo "<ul>";
  var_dump($files)
foreach($files as $file){
  //If not a hidden file (starting with '.')
  if(strpos($file, "."!== 0) && $file !== "tools") {
    echo "<li><a href='/Botches/" . $file . "/'>" . $file . "</a></li>";
  }
}
