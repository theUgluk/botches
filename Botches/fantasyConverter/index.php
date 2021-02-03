<?php
  $dir = dirname(__FILE__);
  require_once($dir . "/../../constants.php");
  
?>

From:  <input type='number' id='fromNumber' />
<select id='fromUnit'></select>
To:<select id='toUnit'></select>
<button id="calc">Calculate</button>

<div id="result"></div>
<script src="script.js"></script>
