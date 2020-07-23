<?php
$files = scandir(dirname(__FILE__) . "/Botches");
foreach($files as $file){
  //If not a hidden file (starting with '.')
  echo "<ul>";
  if(strpos($file, ".") !== 0){
    echo "<li><a href='/Botches/" . $file . "/'>" . $file . "</a></li>";
  }
}
