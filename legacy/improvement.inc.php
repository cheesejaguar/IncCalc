<?php

?>
<div id="infocontentsub">
    <h2>Improvement Analysis</h2>
    <span>From preloaded data we can tell you which choice will generate the most amount of cash (or largest infra purchase capability).</span>
    <hr  />
<?
if (isset($_SESSION['nationinfo']))
{
        include_once($SCRIPT_HOME_DIR."resource/resparse.class.php");
        $parse = new ResParseText($_SESSION['nationinfo']);

        $cit_count = $parse->getStat("cit");
        $cit_income = $parse->getStat("income");
        $net_income = $cit_count * $cit_income;

        $happy = $parse->getStat("happy");

        $tech = $parse->getStat("tech");
        $tax_rate = $parse->getStat("tax")/100;

        // $improvement_list = $parse->getImprovements(); // array with key = Improvement name.

        $num_banks = $parse->hasImprovement("Banks");
        $num_walls = $parse->hasImprovement("Border Walls");
        $num_fm = $parse->hasImprovement("Foreign Ministries");
        $num_gc = $parse->hasImprovement("Guerilla Camps");
        $num_harbor = $parse->hasImprovement("Harbors");
        $num_school = (.05 * $parse->hasImprovement("Schools"));
        $num_univ = $parse->hasImprovement("Universities");

        $banks = 1+ (.07*$parse->hasImprovement("Banks"));
        $fm = 1 + (.05 * $parse->hasImprovement("Foreign Ministries"));
        $gc = 1 - (.08 * $parse->hasImprovement("Guerilla Camps"));
        $harbor = 1 + (.01 * $parse->hasImprovement("Harbors"));
        $school = 1 + (.05 * $parse->hasImprovement("Schools"));
        $univ = 1 + (.08 * $parse->hasImprovement("Universities"));

        $cost_imp["Banks"]                = 100000;
        $cost_imp["Border Walls"]         = 060000;
        $cost_imp["Churches"]             = 040000;
        $cost_imp["Clinics"]              = 050000;
        $cost_imp["Foreign Ministries"]   = 120000;
        $cost_imp["Guerilla Camps"]       = 020000;
        $cost_imp["Harbors"]              = 200000;
        $cost_imp["Hospitals"]            = 180000;
        $cost_imp["Intelligence Agencies"] = 38500;
        $cost_imp["Labor Camps"]          = 150000;
        $cost_imp["Police Headquarters"]  = 075000;
        $cost_imp["Schools"]              = 085000;
        $cost_imp["Stadiums"]             = 110000;
        $cost_imp["Universities"]         = 180000;
        $cost_imp["Factories"]            = 150000;

        $incomeMod = $banks * $fm * $gc * $harbor * $school * $univ;
        $hap_income = 2 * $incomeMod * $tax_rate; // $cit_income / $happy;

        $inc_change["Banks"]                = 0.07 * $net_income;
        $inc_change["Border Walls"]         = ($cit_income + 2*$hap_income) * ($cit_count * 0.98) - $net_income;
        $inc_change["Churches"]             = ($cit_income + 1*$hap_income) * ($cit_count * 1.00) - $net_income;
        $inc_change["Clinics"]              = ($cit_income + 0*$hap_income) * ($cit_count * 1.02) - $net_income;
        $inc_change["Factories"]            = 0;
        $inc_change["Foreign Ministries"]   = 0.07 * $net_income;
        $inc_change["Guerilla Camps"]       = -0.08 * $net_income;
        $inc_change["Harbors"]              = ($cit_income + 1*$hap_income) * ($cit_count * 1.00) - $net_income;
        $inc_change["Hospitals"]            = ($cit_income + 0*$hap_income) * ($cit_count * 1.06) - $net_income;
        $inc_change["Intelligence Agencies"] = ($cit_income + 1*$hap_income) * ($cit_count * 1.00) - $net_income;

        include_once($SCRIPT_HOME_DIR."upkeep/upkeep.class.php");
        $upkeep = new calcUpkeep();
        $resarray = array_merge($parse->getResources(), $parse->getBonuses());
        if (strpos("  Capitalist Dictatorship Federal Government Monarchy Republic Revolutionary Government", $parse->getStat("gove")) != 0) {  array_push($resarray, "Government");  }

        $upkeep->setTech($parse->getStat("tech"));
        $upkeep->setNS($parse->getStat("ns"));
        $upkeep->setImprovements($parse->hasImprovement("Labor Camps"));
        $upkeep->updateModifier($resarray);
        $upkeep->setInfra($parse->getStat("infr"));
        $upkeep_bill = round($upkeep->getCost(),2) * $parse->getStat("infr");

        $inc_change["Labor Camps"]      = (($cit_income - 1*$hap_income) * ($cit_count * 1.00) - $net_income) + ($upkeep_bill * 0.10);

        $inc_change["Police Headquarters"]  = ($cit_income + 2*$hap_income) * ($cit_count * 1.00) - $net_income;
        $inc_change["Schools"]              = 0.05 * $net_income;
        $inc_change["Stadiums"]             = ($cit_income + 3*$hap_income) * ($cit_count * 1.00) - $net_income;
        $inc_change["Universities"]         = 0.08 * $net_income;


        //$choice1 = ($cit_income + ($incomeMod * $var1["income"]*$tax_rate) + ($incomeMod * 2 * $var1["happy"]*$tax_rate)) * ($cit_count * (1+$var1["pop"]));
        //$choice2 = ($cit_income + ($incomeMod * $var2["income"]*$tax_rate) + ($incomeMod * 2 * $var2["happy"]*$tax_rate)) * ($cit_count * (1+$var2["pop"]));
?>
<fieldset>
<table>
    <thead>
    <tr>
        <td class="tablist">Improvement</td>
        <td class="tablist">Current</td>
        <td class="tablist">Income Change<sup style="line-height:0px; font-weight:normal;">1</sup></td>
        <td class="tablist">ROI<sup style="line-height:0px;font-weight:normal;">2</sup></td>
        <td class="tablist">Infra/Day<sup style="line-height:0px;font-weight:normal;">3</sup></td>
    </tr>
    </thead>
<?

include_once($SCRIPT_HOME_DIR."infra/infra.class.php");
$infra = new calcInfra();
$infra->setFactories($parse->hasImprovement("Factories"));
// print_r($resarray);
$infra->updateModifier($resarray);
$infra->setInfra($parse->getStat("infr"));
$infra->setWanted(1);
$cost_of_infra = $infra->getCost();

foreach($inc_change as $key=>$inc_change_val)
{

    $i++;
    if ($i % 2) {
        echo "  <tr class=\"white\">\n"; }
    else {
        echo "  <tr class=\"shade\">\n"; }

?>
        <td class="tablist"><? echo $key; ?></td>
        <td class="tablist"><? echo $parse->hasImprovement($key); ?></td>
        <td class="tablist"><?
            $myarray = Array("Universities", "Harbors", "Hospitals", "Foreign Ministries", "Factories");
            if (in_array($key, $myarray)) {
                switch ($key) {
                case "Harbors":
                if ($parse->hasImprovement($key) != 0 ) { $inc_change_val = 0; }
                break;

                case "Hospitals":
                if ($parse->hasImprovement($key) != 0 || ($parse->hasImprovement("Clinics") < 2)) { $inc_change_val = 0; }
                break;

                case "Foreign Ministries":
                if ($parse->hasImprovement($key)) { $inc_change_val = 0; }
                break;

                case "Universities":
                if (($parse->hasImprovement($key)==2) || ($parse->hasImprovement("Schools") < 3)) { $inc_change_val = 0; }
                break;

                case "Factories":
                $inc_change_val = 0;
                break;
                }
            }
            else
            {
                if ($parse->hasImprovement($key) == 5) { $inc_change_val = 0; }
            }

            if ($inc_change_val > 0) {
                $inc_change_val -= 5000;
                echo "<div style=\"color:green;\">".number_format($inc_change_val, 2)."</div>";
            } elseif ($inc_change_val < 0) {
                $inc_change_val -= 5000;
                echo "<div style=\"color:red;\">".number_format($inc_change_val, 2)."</div>";
            } else {
                echo number_format($inc_change_val, 2);
            }

        ?></td>
        <td class="tablist"><?
            if ($cost_imp[$key] == 0) { $roi = 0; }
            else { $roi = $inc_change_val / $cost_imp[$key]; }

            if ($roi < 0) { echo "Never"; }
            elseif ($roi == 0) { echo "N/A"; }
            else { echo number_format($roi, 0)." days"; }
        ?></td>
        <td class="tablist"><?
            // echo $cost_of_infra;
            $newcash = $net_income + $inc_change_val;
            if ($key == "Factories" && ($parse->hasImprovement("Factories") != 5)) {
                echo number_format($newcash / $cost_of_infra / 0.8, 2);
            } else {
                echo number_format($newcash / $cost_of_infra, 2);
            }
        ?></td>
    </tr>
<?
}
?>
</table>
</fieldset>
<br style="clear: both;" />
<ol>
<li>Changes in income reflect NET change (including an assumed 5000/day upkeep tax for having the improvement).</li>
<li>The return on interest will reflect "n\a" in the case where you are not able to purchase any more of that specific improvement.  And, of course, this is in terms of taxes made back, so factories will never achieve a positive return on balance.</li>
<li>Infra/day is <strong>technically incorrect</strong>; to cut down on server load the calculation only does a <strong>gross income/current infra cost</strong> analysis and does not take into account increases in infra prices between blocks of 10.  As a result, your actual purchasable infrastructure per day will go down, not to mention taxes to be paid for upkeep.</li>
</ol>
<br style="clear: both;" />
<?
}
else
{
    echo "Error: you need to <a href=\"?show=loader\">preload your nation data</a> before you will be able to use the event advisor feature of this calculator.<br style=\"clear:both;\" />";
}
?>
</div>