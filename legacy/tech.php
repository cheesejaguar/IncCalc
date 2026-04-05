<?
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//$CALC_DEBUG_MODE = 0;
include_once("common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR ."tech/tech.class.php");

    if($session->logged_in)
    {
        include($SCRIPT_HOME_DIR ."template/header2.php");
    }
    else
    {
        header("Location: index.php");
    }
?>
<?

    if (isset($_POST['submit'])) {
        $tech1 = new calcTech();

        $a = $_POST["res"];
        $universities = $_POST["univ"];

        $tech = str_replace(",", "", $_POST["technology"]);
        $wanted = str_replace(",", "", $_POST["tech_wanted"]);
        if (!$wanted) $wanted = 0;
        if ($wanted > 5000) $wanted = 5000;


        $tech1->setImprovements($universities);
        $tech1->setTech($tech);
        $tech1->updateModifier($a);

?>
        <div id="infocontentsub">
            <h2>Tech Purchase Calculated</h2>
            <span>You're interested in purchasing tech, and need to know the cost.  Here are some of the facts.</span>
            <hr  />
            <p>
                According to our assumptions*, one tech level should cost you <strong>$<? echo number_Format($tech1->getCost(),2); ?></strong>.<br />
                If you want to buy <strong><? echo $wanted ?></strong> level(s) of technology (blocks of ten), you're going to need at least $<strong><? echo number_Format($tech1->getCostFor($wanted),2); ?></strong>.<? if ($wanted > 200) { ?><br />
                <br />
                <i>* Users with tech levels above 200 should only purchase tech on the open market (pricing is typically around the $21,000/level range).  Inc. has not built in analysis for those nations with tech levels of 250 and up.</i><? } ?>
            </p>
        </div>
<?
    }
?>
        <br style="clear: both;">
                <div id="infocontentsub">
                            <h2>Technology Purchase Calculations</h2>
                            <span>How much will this much tech cost me?  How much money do I need saved?  This feature is only accurate for <strong>first 250 tech levels</strong> -- if you're above that point, then you will definitely want to purchase technology on the open market.</span>

                            <hr  /><br style="clear: both;" />
<p>
    <form action="tech.php" method="POST">
        <div id="featuresAll2">
<? if (isset($_POST["res"]))  {
            $a = $_POST["res"];
            $USER_STORE = 0;
     }
     else
     {
            if (isset($_SESSION['nationinfo'])) { $USER_STORE = 1;          $a = new ParseText($_SESSION['nationinfo']); }
            else {
                $a = array();
                $USER_STORE = 0;
            }
     }

?>              <fieldset>
                    <legend>Nation Info</legend>
                    <table colspan="2">
                        <tr style="vertical-align: baseline;">
                            <td>Tech Needed</td><td><input class="input" type="textbox" title="resSelect" name="tech_wanted" id="_c" value="<? echo $_POST["tech_wanted"]; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Current Tech</td><td><input class="input" type="textbox" title="resSelect" name="technology" id="_tech" value="<? if (!$USER_STORE) { echo $_POST["technology"]; } else { echo $a->getStat("tech"); } ?>" /></td>
                        </tr>
                    </table>
                </fieldset>
        </div>
        <div id="featuresTech">
                <fieldset>
                    <legend>Improvements/Wonders</legend>
                    <table>
                        <tr style="vertical-align: baseline;">
                                <td><? if (!$USER_STORE) { ?>
                                    <select name="univ"><option>0</option><option <? if ($_POST["univ"] == 1) echo "selected"; ?>>1</option><option <? if ($_POST["univ"] == 2) echo "selected"; ?>>2</option></select><? }
                                    else { $b = $a->hasImprovement("Universities"); ?>
                                    <select name="univ"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option></select><? } ?>
                                </td>
                                <td style="width:150px;">Universities</td>
                                <td></td>
                                <td style="width:150px;"></td>
                        </tr>
                        <tr style="vertical-align: baseline;"><? if (!$USER_STORE) { ?>
                                <td><input class="inputcb" type="checkbox" title="GreatUniv" name="res[]" id="guniv" value="guniv" <? if (in_array("guniv", $a)) echo "checked "; ?>/></td><? }
                                else { ?>
                                <td><input class="inputcb" type="checkbox" title="GreatUniv" name="res[]" id="guniv" value="guniv" <? if ($a->hasWonder("Great University")) echo "checked "; ?>/></td><? } ?>
                                <td><label for="guniv">Great University</label></td>
                                <td>&nbsp;</td>
                                <td></td>
                        </tr>
                        <tr style="vertical-align: baseline;"><? if (!$USER_STORE) { ?>
                                <td><input class="inputcb" type="checkbox" title="Space" name="res[]" id="space" value="space" <? if (in_array("space", $a)) echo "checked "; ?>/></td><? }
                                else { ?>
                                <td><input class="inputcb" type="checkbox" title="Space" name="res[]" id="space" value="space" <? if ($a->hasWonder("Space Program")) echo "checked "; ?>/></td><? } ?>
                                <td><label for="space">Space Program</label></td>
                                <td>&nbsp;</td>
                                <td></td>
                        </tr>
                        <tr style="vertical-align: baseline;"><? if (!$USER_STORE) { ?>
                                <td><input class="inputcb" type="checkbox" title="Research" name="res[]" id="rlab" value="rlab" <? if (in_array("rlab", $a)) echo "checked "; ?>/></td><? }
                                else { ?>
                                <td><input class="inputcb" type="checkbox" title="Research" name="res[]" id="rlab" value="rlab" <? if ($a->hasWonder("National Research Lab")) echo "checked "; ?>/></td><? } ?>
                                <td><label for="rlab">Research Lab</label></td>
                                <td>&nbsp;</td>
                                <td></td>
                        </tr>
                    </table>
                </fieldset>
        </div>

        <br style="clear:both;" />
<? if ($USER_STORE) {
        $b = implode("+",$a->getResources());
        $c = implode("+",$a->getBonuses());
        $a = explode("+", strtolower($b."+".$c));
    }
 ?>
      <div id="info">
        <div id="featuresAll2">
                <fieldset>
                    <legend>Resources/Bonuses</legend>
                    <table>
                        <tr style="vertical-align: baseline;">
                            <td><input class="gold" type="checkbox" title="Gold" name="res[]" id="a" value="gold" <? if (in_array("gold", $a)) echo "checked "; ?>/><label for="a">&nbsp;</label></td>
                            <td><input class="microchip" type="checkbox" title="Microchips" name="res[]" id="i" value="microchips" <? if (in_array("microchips", $a)) echo "checked "; ?>/><label for="i">&nbsp;</label></td>
                        </tr>
                    </table>
                </fieldset>
            </div>
        </div>
        <br style="clear:both;" />
        <input type="submit" value="submit" name="submit" />
    </div>
</p>
    </form>
<br style="clear:both;" />
                </div>
                <br style="clear: both;">
        <?

include($SCRIPT_HOME_DIR."template/footer.php");

?>
