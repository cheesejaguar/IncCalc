<?php

?>
<div id="infocontentsub">
    <h2>Event Advisor</h2>
    <span>From preloaded data and your event specifics, we can tell you which choice will save you the most cash.</span>
    <hr  />
<?
if (isset($_SESSION['nationinfo']))
{

    if (isset($_POST['submit'])) {
        $var1 = $_POST["event1"];
        $var2 = $_POST["event2"];
        $msg = "";

        foreach ($var1 as $key => $val)
        {
            if (!is_numeric($val) && ($val != ""))
                $msg .= "<li style=\"color:red;\">Event 1 \"".$key."\" is not numeric.</li>";
            if ($val == "")
                $var1[$key] = 0;
        }
        foreach ($var2 as $key => $val)
        {
            if (!is_numeric($val) && ($val != ""))
                $msg .= "<li style=\"color:red;\">Event 2 \"".$key."\" is not numeric.</li>";
            if ($val == "")
                $var2[$key] = 0;
        }

        if ($msg != "")
        {
            echo "<ul>";
            echo $msg;
            echo "</ul>";
        }
        else
        {

        include_once($SCRIPT_HOME_DIR."resource/resparse.class.php");
        $parse = new ResParseText($_SESSION['nationinfo']);

        if ($var1["pop"] >= 1) $var1["pop"] /= 100;
        if ($var2["pop"] >= 1) $var2["pop"] /= 100;

        $cit_count = $parse->getStat("cit");
        $cit_income = $parse->getStat("income");
        $net_income = $cit_count * $cit_income;
        $happy = $parse->getStat("happy");
        $tech = $parse->getStat("tech");
        $tax_rate = $parse->getStat("tax")/100;

        $banks = 1+ (.07*$parse->hasImprovement("Banks"));
        $fm = 1 + (.05 * $parse->hasImprovement("Foreign Ministries"));
        $gc = 1 - (.08 * $parse->hasImprovement("Guerilla Camps"));
        $harbor = 1 + (.01 * $parse->hasImprovement("Harbors"));
        $school = 1 + (.05 * $parse->hasImprovement("Schools"));
        $univ = 1 + (.08 * $parse->hasImprovement("Universities"));

        $incomeMod = $banks * $fm * $gc * $harbor * $school * $univ;
        // $hap_income = 2 * $incomeMod * $tax_rate; // $cit_income / $happy;

        $choice1 = ($cit_income + ($incomeMod * $var1["income"]*$tax_rate) + ($incomeMod * 2 * $var1["happy"]*$tax_rate)) * ($cit_count * (1+$var1["pop"]));
        $choice2 = ($cit_income + ($incomeMod * $var2["income"]*$tax_rate) + ($incomeMod * 2 * $var2["happy"]*$tax_rate)) * ($cit_count * (1+$var2["pop"]));

        echo "<fieldset>\n";
        echo "<table>\n";
        echo "\t<thead>\n";
        echo "\t<tr>\n";
        echo "\t\t<td class=\"tablist\">Option</td><td class=\"tablist\">Projected Income</td><td class=\"tablist\">Suggested Event</td>\n   </tr>\n </thead>\n";
        echo "\t<tr class=\"white\">\n\t\t<td class=\"tablist\">1</td>\n\t\t<td class=\"tablist\">".number_format($choice1,2)."</td>\n";
        if ($choice1 >= $choice2)
             echo "\t\t<td class=\"tablist\" style=\"color:green; font-weight:bold\">Yes</td>\n";
        else
             echo "\t\t<td class=\"tablist\" style=\"color:green; font-weight:bold\">&nbsp;</td>\n";
        echo "\t</tr>\n";
        echo "\t<tr class=\"shade\">\n\t\t<td class=\"tablist\">2</td>\n\t\t<td class=\"tablist\">".number_format($choice2,2)."</td>\n";
        if ($choice2 > $choice1)
             echo "\t\t<td class=\"tablist\" style=\"color:green; font-weight:bold\">Yes</td>\n";
        else
             echo "\t\t<td class=\"tablist\" style=\"color:green; font-weight:bold\">&nbsp;</td>\n";
        echo "\t</tr>\n";
        echo "</table></fieldset><br style=\"clear:both;\" />";

        }
    }
?>
        <div id="featuresAll2">

                <form action="index.php?show=events" method="post">
                <fieldset>
                    <legend>Event 1</legend>
                    <table colspan="2">
                        <tr style="vertical-align: baseline;">
                            <td>Happiness</td>  <td><input class="input" type="textbox" title="hap" name="event1[happy]"    id="_1a" value="<? echo $var1["happy"]; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Income</td>     <td><input class="input" type="textbox" title="inc" name="event1[income]"   id="_1b" value="<? echo $var1["income"]; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Population</td> <td><input class="input" type="textbox" title="pop" name="event1[pop]"      id="_1c" value="<? echo $var1["pop"]; ?>" /></td>
                        </tr>
                    </table>
                </fieldset>
        </div>
        <div id="featuresTech">
                <fieldset>
                    <legend>Event 2</legend>
                    <table colspan="2">
                        <tr style="vertical-align: baseline;">
                            <td>Happiness</td>  <td><input class="input" type="textbox" title="hap" name="event2[happy]"    id="_2a" value="<? echo $var2["happy"]; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Income</td>     <td><input class="input" type="textbox" title="inc" name="event2[income]"   id="_2b" value="<? echo $var2["income"]; ?>" /></td>
                        </tr>
                        <tr style="vertical-align: baseline;">
                            <td>Population</td> <td><input class="input" type="textbox" title="pop" name="event2[pop]"      id="_2c" value="<? echo $var2["pop"]; ?>" /></td>
                        </tr>
                    </table>
                </fieldset>
        </div>
        <br style="clear:both;" /><br style="clear:both;" />
        <input type="submit" value="submit" name="submit" />
        </form>
<?
}
else
{
    echo "Error: you need to <a href=\"?show=loader\">preload your nation data</a> before you will be able to use the event advisor feature of this calculator.<br style=\"clear:both;\" />";
}
?>
</div>