<?php
  $dir = dirname(__FILE__);
  require_once($dir . "../../constants.php");

?>
<script>
//xp holder
var xp = 0;

//Aantal start ingediants
let numIngots = 30;

//Aantal xp wat je voor 1 volle conversie gaint
let xpPerCycle = 20;

numIngots = Math.ceil(numIngots / 2);
while(numIngots > 1){
	xp += xpPerCycle * numIngots;
  numIngots = Math.ceil(numIngots / 2);
}
console.log(xp);
</script>
