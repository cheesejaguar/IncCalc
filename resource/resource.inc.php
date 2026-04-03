<?php
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."resource/resparse.class.php");
include_once($SCRIPT_HOME_DIR."infra/infra.class.php");
include_once($SCRIPT_HOME_DIR."upkeep/upkeep.class.php");
include_once($SCRIPT_HOME_DIR."tech/tech.class.php");

?>
<div id="infocontentsub">
    <h2>Resource Optimization</h2>
    <span>From preloaded data, the resource manager will be able to propose several resource sets that best fit your needs.<br /><strong>Please be advised, this feature is currently still being developed, and you may experience real-time "breakage" of functionality.</strong></span>
    <hr  />

<?
if (isset($_SESSION['nationinfo'])) {
    $USER_STORE = 1;
?>
<script type="text/javascript" src="<? echo $baseURL; ?>/common/jsvars.php"></script>
<script type="text/javascript" src="<? echo $baseURL; ?>/common/funcdefs.js"></script>

<script>
// -store base values in hidden fields for optimizer POST


// form POST function: submitOptimize(buttonID)
// -optimizer button type
// -base values
// -selected improvement mods
// -mandatory resources


//-->
</script>

<!-- HTML GUI YAY  -->
<table width="100%" align=center border=0 cellspacing=0 cellpadding=1> <!-- UBERTABLE -->
<tr>
 <!-- START CELL1 -->
 <td align=center><b>Your Resources:</b><br> <? // Box1=has Box2=include in optimize ?>
 <table border=1 cellspacing=0 cellpadding=3>
<?
    $a = new ResParseText($_SESSION['nationinfo']);
    $b = implode("+",$a->getResources());
    // echo "|". $b . "|<br />";
    $c = implode("+",$a->getBonuses());
    $res = explode("+", $b."+".$c);
    $baseres = implode(",", $a->_baseres);
?>

 <form name="leftResForm">
  <script>
    var ihave = '<? echo implode(",",$res); ?>'

  var ihave2 = '<? echo $baseres; ?>'

  document.writeln("<tr>")
  for(i=1;i<resourceMods.length;++i){    //i=1 because resourceMods[0] is the labels
   if (ihave2.indexOf(resourceMods[i][0].substr(0,3)) != -1) {
    document.writeln('<td class="resTD">' + resourceMods[i][0].substr(0,4) + '<input checked disabled type=checkbox onChange="updateFields(0,this)" name="' + resourceMods[i][0].substr(0,3) + '"/><input type=hidden></td>')
   }
   else if (ihave.indexOf(resourceMods[i][0].substr(0,3)) != -1) {
    document.writeln('<td class="resTD">' + resourceMods[i][0].substr(0,4) + '<input checked type=checkbox onChange="updateFields(0,this)" name="' + resourceMods[i][0].substr(0,3) + '"/><input type=hidden></td>')
    // document.writeln('<td><input checked type=checkbox onChange="updateFields(0,this)" class="' + resourceMods[i][0].substr(0,4) + '" name="' + resourceMods[i][0].substr(0,3) + '"/><input type=hidden></td>')
   }
   else
   {
    document.writeln('<td class="resTD">' + resourceMods[i][0].substr(0,4) + '<input type=checkbox onChange="updateFields(0,this)" name="' + resourceMods[i][0].substr(0,3) + '"/><input type=hidden></td>')
    //document.writeln('<td><input type=checkbox onChange="updateFields(0,this)" class="' + resourceMods[i][0].substr(0,4) + '" name="' + resourceMods[i][0].substr(0,3) + '"/><input type=hidden></td>')
   }
   if (i%4==0){
    document.writeln("</tr><tr>")        //new row every 4 cells
   }
  }
  document.writeln("</tr>")
  </script>

 </form>
 </table>

 </td><!-- END C1 -->

 <!-- START CELL2 --><td align=center>

 <table>
 <form name="nationMods">
  <tr><td colspan=3 align=center><b>Your Current Modifiers:<b></td></tr>
  <tr>
   <td>Stat: </td><td>Mod:</td><td>Value:</td>
  </tr>
  <script>
   // write the mod/value table
   for(i=1;i<(legend.length-1);++i){
    document.writeln('<tr><td>' + legend[i] + ':</td><td><input type=text class="restext" size=2></td><td><input type=text class="restext" size=5></td></tr>')
   }
  </script>

 </form>
 </table>
 </td><!-- END C2 -->
 <? /*
 <!-- START CELL3 --><td>
<table align=center>
 <form name="submitButtons">
 <tr><td align=center>Does Nothing:</td>
 <tr><td align=center><input type=button value="PopGrowth"></td></tr>
 <tr><td align=center><input type=button value="Population"></td></tr>

 <tr><td align=center><input type=button value="Income"></td></tr>
 <tr><td align=center><input type=button value="Tech Cost"></td></tr>
 <tr><td align=center><input type=button value="Military"></td></tr>
 </form>
</table>
 </td><!-- END C3 -->
 */ ?>
 <!-- START CELL3 --><td>
 <table align=center>
  <form name="submitButtons">
  <tr><td align=center>Premade Combos:</td>
  <tr><td align=center><input type=button class="resbuttons" value="Money" onclick="setCombo(0)"></td></tr>
  <tr><td align=center><input type=button class="resbuttons" value="Infra" onclick="setCombo(1)"></td></tr>
  <tr><td align=center><input type=button class="resbuttons" value="Hybrid" onclick="setCombo(2)"></td></tr>
  </form>
 </table>
 </td><!-- END C3 -->

 <!-- START CELL4 --><td align=center>
 <table>
 <form name="newMods">

  <tr><td colspan=3 align=center><b>New Data:</b></td></tr>
  <tr>
   <td>Stat: </td><td>Mod:</td><td>Value:</td>
  </tr>
  <script>
   // write the mod/value table
   for(i=1;i<(legend.length-1);++i){
    document.writeln('<tr><td>' + legend[i] + ':</td><td><input type=text class="restext" size=2></td><td><input type=text class="restext" size=5></td></tr>')
   }
  </script>
 </form>

 </table>
 </td><!-- END C4 -->

 <!-- START CELL5 -->
 <td align=center><b>New Resources:</b>
 <table border=1 cellspacing=0 cellpadding=3 >
 <form name="rightResForm">
  <script>
  var ihave = '<? echo $baseres; ?>'
  document.writeln("<tr>")
  for(i=1;i<resourceMods.length;++i){    //i=1 because resourceMods[0] is the labels
    if (ihave.indexOf(resourceMods[i][0].substr(0,3)) != -1) {
        document.writeln('<td class="resTD">' + resourceMods[i][0].substr(0,4) + '<input type=checkbox onChange="updateFields(4,this)" checked disabled name="' + resourceMods[i][0].substr(0,3) + '"></td>')
    }
    else
    {
        document.writeln('<td class="resTD">' + resourceMods[i][0].substr(0,4) + '<input type=checkbox onChange="updateFields(4,this)" name="' + resourceMods[i][0].substr(0,3) + '"></td>')
    }
   if (i%4==0){
    document.writeln("</tr><tr>")        //new row every 4 cells
   }
  }
  document.writeln("</tr>")
  </script>
  <tr><input type=reset class="resbuttons"></tr>

 </form>
 </table>
</td><!-- END C5 -->
</tr>
<tr><td> <!--emptyspace--></td></tr>
<tr>
<td colspan=5>
<span>Improvements</span>
<!-- START IMPROVEMENT TABLE -->
<table align=center width="100%" border=0 spacing=0 padding=1>
<form name="impForm">
<tr align=center>
<?
if (! function_exists("array_fill_keys")) {
    function array_fill_keys($array, $values) {
            if(is_array($array)) {
                    foreach($array as $key => $value) {
                            $arraydisplay[$array[$key]] = $values;
                    }
            }
            return $arraydisplay;
    }
}

    $temp = "Bank,Barr,Bord,Chur,Clin,Fact,Fore,Guer,Harb,Hosp,Inte,Labo,Miss,Poli,Sate,Scho,Stad,Univ";
    $temp = explode(",", $temp);
    $temp = array_fill_keys($temp, 0);


    $imp = $a->getImprovements();
    $i = 0;
    foreach ($imp as $iname => $ival)
    {
        $iname = substr($iname,0,4);
        $temp[$iname] = $ival;
    }

    foreach ($temp as $iname => $ival)
    {
            $i++;
            echo "<td>".trim($iname)."</td><td><input type=text class=\"restext\" size=1 onChange=\"updateFields(5,this)\" name=\"".substr($iname,0,4)."\" value=\"".trim($ival)."\"></td>\n";
            if ($i % 6 == 0)
                echo "</tr><tr align=center>";
    }

/* document.writeln("<tr align=center>")
 for(i=1;i<improvementMods.length;++i){    //i=1 because improvementMods[0] is the labels
  var thename = improvementMods[i][0].substr(0,3)
  document.writeln('<td>' + improvementMods[i][0] + ':</td><td><input type=text size=1 onChange="updateFields(5,this)" name="' + improvementMods[i][0].substr(0,4) + '"></td>')
  // document.writeln('<td>' + improvementMods[i][0] + ':</td><td><input type=text size=1 onChange="updateFields(5,this)" name="' + improvementMods[i][0].substr(0,4) + '" value="' + impCount[thename] + '"></td>')
  if (i%6==0){
   document.writeln("</tr><tr align=center>")        //new row every 6 cells
  }
 }
*/
?>

 <script>
 document.writeln("</tr>")
 </script>

</form>
</table>
<!-- END IMPROVEMENT TABLE -->
</td>
</tr>
</table>

<script>
preCalc() // run after load
</script>
<!-- that's all folks -->
<br style="clear:both;" />

<?
}
else
{
    echo "Error: you need to <a href=\"?show=loader\">preload your nation data</a> before you will be able to use the resource management features of this calculator.";
}
?>
</div>