<!doctype html>
<html>
  <head>
    <title>
      Ugluk's Botches
    </title>
  </head>
  <body>
    <input id="searchBar" type="search" autofocus />
    <table id="datatable">
      <thead>
        <tr>
          <td>
            Naam
          </td>
          <td>
            Description
          </td>
        </tr>
      </thead>
      <tbody>
      <?php
        require_once dirname(__FILE__) . "/constants.php";
        $files = scandir(BOTHCHESPATH);
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
            echo "<tr><td><a href='/Botches/" . $file . "/'>" . $name . "</a></td><td>" . $description . "</td></tr>";
          }
        }
      ?>
    </tbody>
  </table>
  <link rel="stylesheet" type="text/css" href="<?=TOOLSWEBPATH?>datatables/datatables.min.css"/>
  <script type="text/javascript" src="<?=TOOLSWEBPATH?>datatables/datatables.min.js"></script>
  <script>
    $(document).ready(function() {
      let table = $('#datatable').DataTable({
        paging: false,
        sDom: "lrtip"
      });
      $('#searchBar').on( 'keyup', function () {
        table.search($('#searchBar').val()).draw();
      } );
    } );
    document.querySelector("#searchBar").addEventListener("keydown", event => {
      console.log(event.key);
      if(event.key  === "Enter"){
        document.querySelector("#datatable tbody tr:first-child a").click();
      }
    })

  </script>
  <link rel="stylesheet" type="text/css" href="<?=TOOLSCSSWEBPATH?>basicStyle.css"/>
  <link rel="stylesheet" type="text/css" href="style.css" />

  </body>
</html>
