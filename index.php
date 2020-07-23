<!doctype html>
<html>
  <head>
    <title>
      Ugluk's Botches
    </title>
  </head>
  <body>
    <ul>
      <?php
        require_once dirname(__FILE__) . "/constants.php";
        $files = scandir(BOTHCHESPATH);

        //Todo: Create file with constants for stuff like homedir, botchdir, tooldir, etc

        foreach($files as $file){
          //If not a hidden file (starting with '.')
          if(strpos($file, ".") !== 0 && $file !== "tools") {
            $name = $file;
            $description = "";
            //Check for info.json
            $infoFile = BOTHCHESPATH . $file . "/info.json";
            if(file_exists($infoFile)){
              $settings = json_decode(file_get_contents(BOTHCHESPATH . $file . "/info.json"), true);
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
      ?>
    </ul>
  </body>
</html>
