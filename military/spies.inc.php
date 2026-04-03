<?php

?>
<div id="infocontentsub">
    <h2>Spy Odds Calculator</h2>
    <span>From your submitted data, we can tell you what your odds are for operational success.</span>
    <hr  />
<?
    if (isset($_POST['submit'])) {
        $var1 = $_POST["spies"];
        $var2 = $_POST["tech"];
        $var3 = $_POST["dspies"];
        $var4 = $_POST["dtech"];
        $var5 = $_POST["dland"];
        $var6 = $_POST["dthreat"];

        include_once($SCRIPT_HOME_DIR."military/spyodds.class.php");
        $calc = new calcSpyOdds();
        $calc->setSpies($var1, $var3);
        $calc->setTech($var2, $var4);
        $calc->setLand($var5);
        $calc->setLevel($var6);

        $usermodifier = $calc->getMod(0);
        $oppomodifier = $calc->getMod(1);

?>
    <p>
    From the information was provided, we know that your offensive modifier is <strong><? echo $usermodifier; ?></strong><?
    if (trim($var3) != "") {
        ?>, and the Enemy defensive modifier is <strong><? echo $oppomodifier; ?></strong>.  This means that given the current situation you have a <strong><? echo number_format($calc->getOdds(), 2); ?>%</strong> probability of success.<br /><?
    } else {
        ?>, but we can't be sure about the enemy's defensive modifier.<br /> <?
    } ?>
    </p>
    <p>
        Below is a chart of your success odds dependent on the enemy spy count.<br/>
<?

    $datapoints = $calc->OddsGraph();
    //include charts.php to access the InsertChart function
    include_once($SCRIPT_HOME_DIR."common/chart/charts.php");
    // echo $datapoints[0]."|".$datapoints[1]."|";
    echo InsertChart ( $baseURL."/common/charts.swf", $baseURL."/common/chart/charts_library", $baseURL."/military/spychart.class.php?a1=".$datapoints[0]."&a2=".$datapoints[1]."&a3=".$datapoints[2]."&a4=".$datapoints[3], 500, 230, fffffe );

?>
    </p>
<?
    }
    else
    {
        include_once($SCRIPT_HOME_DIR."resource/resparse.class.php");
        $parse = new ResParseText($_SESSION['nationinfo']);
        $var1 = $parse->getStat("spy");
        $var2 = $parse->getStat("tech");
    }
?>
        <div id="featuresAll2">

                <form action="index.php?show=spies" method="post">
                <fieldset>
                    <legend>Your Nation</legend>
                    <table colspan="2">
                        <tr style="vertical-align: baseline;">
                            <td>Spies</td>  <td><input class="input" type="textbox" title="spies" name="spies"    id="_1a" value="<? echo $var1; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Technology</td>     <td><input class="input" type="textbox" title="tech" name="tech"   id="_1b" value="<? echo $var2; ?>" /></td>
                        </tr>
                    </table>
                </fieldset>
        </div>
        <div id="featuresTech">
                <fieldset>
                    <legend>Enemy</legend>
                    <table colspan="2">
                        <tr style="vertical-align: baseline;">
                            <td>Spies</td>  <td><input class="input" type="textbox" title="hap" name="dspies"    id="_2a" value="<? echo $var3; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Technology</td>     <td><input class="input" type="textbox" title="inc" name="dtech"   id="_2b" value="<? echo $var4; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Land</td> <td><input class="input" type="textbox" title="pop" name="dland"      id="_2c" value="<? echo $var5; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Threat Level</td>
                            <td>
                                <select name="dthreat"><option>Low</option><option <? if ($var6 == "Guarded") echo "selected"; ?>>Guarded</option><option <? if ($var6 == "Elevated") echo "selected"; ?>>Elevated</option><option <? if ($var6 == "High") echo "selected"; ?>>High</option><option <? if ($var6 == "Severe") echo "selected"; ?>>Severe</option></select>
                            </td>
                        </tr>
                    </table>
                </fieldset>
        </div>
        <br style="clear:both;" /><br style="clear:both;" />
        <input type="submit" value="submit" name="submit" />
        </form>
</div>