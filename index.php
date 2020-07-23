<?php
$homedir = dirname(__FILE__);
$files = scandir($homedir . "/Botches");
echo "<ul>";
foreach($files as $file){
  //If not a hidden file (starting with '.')
  if(strpos($file, ".") !== 0 && $file !== "tools") {
    $name = $file;
    $description = "";
    //Check for info.json
    $infoFile = $homedir . "/Botches/" . $file . "/info.json";
    if(file_exists($infoFile)){
      $settings = json_decode(file_get_contents($homedir . "/Botches/" . $file . "/info.json"), true);
      if(is_array($settings)){
        if(array_key_exists("name", $settings)){
          $name = $settings['name'];
        }
          if(array_key_exists("description", $settings)){
            $description = $settings['description'];
          }
      }
    }
    echo "<li><a href='/Botches/" . $file . "/'>" . $name . "</a>";
    if($description !== ""){
      echo " (" . $description . ")";
    }
    echo "</li>";
  }
}
