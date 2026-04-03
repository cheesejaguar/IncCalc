<?php

?>
<div id="infocontentsub">
    <h2>Wonder Advisor</h2>
    <span>From preloaded data, the wonder advisor lists comparative benefits of each wonder, and also suggests to you the one that will make you the most cash.  This selection process does not take into account the actual cost of the wonders themselves.</span>
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

        $banks = 1+ (.07*$parse->hasImprovement("Banks"));
        $fm = 1 + (.05 * $parse->hasImprovement("Foreign Ministries"));
        $gc = 1 - (.08 * $parse->hasImprovement("Guerilla Camps"));
        $harbor = 1 + (.01 * $parse->hasImprovement("Harbors"));
        $school = 1 + (.05 * $parse->hasImprovement("Schools"));
        $univ = 1 + (.08 * $parse->hasImprovement("Universities"));

        $incomeMod = $banks * $fm * $gc * $harbor * $school * $univ;
        // echo $banks . "*" . $fm . "*" . $gc. "*" . $harbor. "*" . $school . "*" .$univ ."=" . $incomeMod;
        $hap_income = 2 * $incomeMod * $tax_rate; // $cit_income / $happy;
        //         echo "hapincome=".$hap_income."<br />";

        //$countFac = $parse->hasImprovement("Factories");
        //  $t1 = implode("+",$parse->getResources());
        //  $t2 = implode("+",$parse->getBonuses());
        //  if (strpos("  Capitalist Dictatorship Federal Government Monarchy Republic Revolutionary Government", $parse->getStat("gove")) != 0)
        //      $t2 .= "+government";

        //$res = explode("+", strtolower($b."+".$c));

        //$infra1 = new calcInfra();
        //$infra1->setFactories($countFac);
        //$infra1->updateModifier($res);

        // $strength = $parse->getStat("ns");

        $a["Internet"]                  = $net_income + ($hap_income * 5 * $cit_count);
        $b["Internet"]                  =   35E6;
        $a["Space Program"]         = $net_income + ($hap_income * 3 * $cit_count);
        $b["Space Program"]         = 30E6;
        $a["Great Monument"]        = $net_income + ($hap_income * 4 * $cit_count);
        $b["Great Monument"]        = 35E6;
        $a["Movie Industry"]        = $net_income + ($hap_income * 3 * $cit_count);
        $b["Movie Industry"]        = 26E6;
        $a["Great University"]  = $net_income + ($hap_income * 0.002 * $tech * $cit_count);
        $b["Great University"]  = 35E6;
        $a["National Research Lab"]         = $net_income + ($cit_income * 0.03 * $cit_count);
        $b["National Research Lab"]         = 35E6;
        $a["Social Security System"]        = $net_income + ($net_income * 2 / 28);
        $b["Social Security System"]        = 40E6;
        $a["Disaster Relief Agency"]        = $net_income + ($cit_income * 0.03 * $cit_count);
        $b["Disaster Relief Agency"]        = 40E6;
        $a["Great Temple"]          = $net_income + ($hap_income * 5 * $cit_count);
        $b["Great Temple"]          = 35E6;
        $a["National War Memorial"]         = $net_income + ($hap_income * 4 * $cit_count);
        $b["National War Memorial"]         = 27E6;
        $a["Stock Market"]      = $net_income + (10 * $tax_rate * $incomeMod * $cit_count);
        //echo "st".(10*$tax_rate * $incomeMod * $cit_count);
        //echo "net".$net_income;
        //echo "st".$a["Stock Market"];
        $b["Stock Market"]      = 30E6;

        foreach ($a as $wname => $wval)
        {
            if ($parse->hasWonder($wname))
            {
                $a[$wname] = $net_income;
            }
        }

        $findMax = max($a);

        // echo max($a/$b);

   echo "<fieldset>\n";
   echo "<table>\n";
   echo "   <thead>\n";
   echo "   <tr>\n";
   echo "       <td class=\"tablist\">Wonder</td><td class=\"tablist\">Projected Income</td><td class=\"tablist\">Days to ROI</td><td class=\"tablist\">Suggested Purchase</td>\n   </tr>\n </thead>\n";
        $i = 0;
        foreach ($a as $wName => $wVal)
        {
            $i++;
            if ($i % 2) {
                echo "  <tr class=\"white\">\n"; }
            else {
                echo "  <tr class=\"shade\">\n"; }

            echo "      <td class=\"tablist\">".$wName."</td>";
            echo "      <td class=\"tablist\">".number_format($wVal, 2)."</td>";

            if ($wVal - $net_income != 0) {
                $temp = $b[$wName]/($wVal - $net_income); }
            else {$temp = 0;}
            echo "      <td class=\"tablist\">".number_format($temp, 0)."</td>";

            if ($parse->hasWonder($wName)) {
                echo "      <td class=\"tablist\" style=\"color:black;font-style:italic;\">Not Available</td>";
            }
            else if ($wVal == $findMax) {
                $nameMax = $wName;
                echo "      <td class=\"tablist\" style=\"color:green;font-weight:bold;\">Best</td>"; }
            else {
                echo "      <td class=\"tablist\">&nbsp;</td>"; }

            echo "  </tr>\n";

        }
    echo "</table></fieldset><br />";
    echo "<i>Note:  The interstate system is the only wonder whose provided benefits are in the form of infrastructure savings.  It has been pointed out by some very meticulous users that high-infrastructure nations often do not purchase as much infra as their ~4000 infra peers, and stand to gain much more by purchasing a social security system.  That's right, Inc. no longer recommends the interstate as the #1 wonder (circumstances may vary) -- concise explanation <a href=\"wonder.txt\">here</a>.  Thanks, TheBFG!</i><br style=\"clear:both;\" />";
?>
    <p>
    As detailed above, we recommend that you purchase the <? echo "<strong>".$nameMax."</strong>"; ?> wonder next.  This wonder will increase your income from $<? echo number_format($net_income, 2); ?> to $<? echo number_format($findMax,2); ?>, an increase of <strong>$<? echo number_format($findMax - $net_income, 2); ?></strong>.
    </p>
<?
}
else
{
    echo "Error: you need to <a href=\"?show=loader\">preload your nation data</a> before you will be able to use the wonder advisor feature of this calculator.<br style=\"clear:both;\" />";
}
?>
</div>