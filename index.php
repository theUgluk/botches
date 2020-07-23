<?php
$files = scandir(dirname(__FILE__) . "/Botches");
echo "<ul>";
foreach($files as $file){
  //If not a hidden file (starting with '.')
  if(strpos($file, ".") !== 0 && $file !== "tools") {
    echo "<li><a href='/Botches/" . $file . "/'>" . $file . "</a></li>";
  }
}
