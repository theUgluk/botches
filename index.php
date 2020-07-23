<?php
$files = scandir(dirname(__FILE__) . "/Botches");
echo "<ul>";
foreach($files as $file){
  //If not a hidden file (starting with '.')
  if(strpos($file, ".") !== 0 && $file !== "tools") {
    $name = $file;
    $description = "";
    //Check for info.json
    if(file_exists("Botches/" . $file . "/info.json")){
      $settings = json_decode($file . "/info.json", true);
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
      echo "(" . $description . ")";
    }
    echo "</li>";
  }
}
