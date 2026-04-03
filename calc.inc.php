<?php

    $eval = (isset($_GET['eval'])) ? $_GET['eval']: "infra";

    if (isset($_POST['submit'])) {

        $infra1 = new calcInfra();
        $pop1 = new calcPopulation();
        $upkeep1 = new calcUpkeep();

        $a = $_POST["res"];
        $b = $_POST["factory"];
        $e = $_POST["clinic"];
        $f = $_POST["walls"];
        $g = $_POST["hospital"];
        $labor = $_POST["labor"];


        $tech = str_replace(",", "", $_POST["technology"]);
        $strength = str_replace(",", "", $_POST["strength"]);
        $land = str_replace(",", "", $_POST["land"]);
        $income = str_replace(",", "", $_POST["income"]);

        $c = str_replace(",", "", $_POST["infra_have"]);
        $d = str_replace(",", "", $_POST["infra_wanted"]);
        $h = str_replace(",", "", $_POST["citizens_wanted"]);

        $infra1->setFactories($b);
        $infra1->updateModifier($a);
        $pop1->setImprovements($e, $f, $g);
        $pop1->updateModifier($a);
        $pop1->setLand($land);

        if (isset($_SESSION['nationinfo'])) {
            $tempo = new ParseText($_SESSION['nationinfo']);
            $pop1->setCitizens(str_replace(",", "", $tempo->getStat("cit")));
            // echo $tempo->getStat("cit")."ASF<br />";
        }

        $upkeep1->setTech($tech);
        $upkeep1->setNS($strength);
        $upkeep1->setImprovements($labor);
        $upkeep1->updateModifier($a);

        if ($d > 5000) $d = 5000;
        if ($h > 25000) $h = 25000;

        $pop1->setInfra($c);
        $pop1->setWanted($d);
        $infra1->setInfra($c);
        $infra1->setWanted($d);
        $upkeep1->setInfra($c);
        $upkeep1->setWanted($d);

        $billa = round($upkeep1->getCost(),2) * $c;
        $billb = ($c +$d) * round($upkeep1->getCostEnd(),2);
        $dbill = $billb - $billa;
    ?>
        <div id="infocontentsub">
            <h2>Results are In!</h2>
            <span>You wanted growth and we're here to give it to you.  Please consider our suggestions carefully!</span>
            <hr  />
    <? if ($eval == "infra") {
            if ((($pop1->getCitizens() * $income) - ($dbill)) != 0)
                $roi = $infra1->getCost() / (($pop1->getCitizens() * $income) - ($dbill));
            else
                $roi = 0;

            $dincome = ($pop1->getCitizens() * $income);
            ?>
            <p>You will need <strong>$<? echo number_format($infra1->getCost(), 2);?></strong> to purchase <strong><? echo $infra1->getWanted(); ?> infra levels</strong>.<br />
            Buying this much infra will provide result in your working population increasing to <strong><? echo number_format($pop1->getCitizensT(), 1); ?></strong> (+<? echo number_format($pop1->getCitizens(), 1); ?>).<br />
            Buying this much infra will increase your infrastructure upkeep (per level) from $<strong><? echo number_format($upkeep1->getCost(),2); ?></strong> to $<strong><? echo number_format($upkeep1->getCostEnd(),2); ?></strong> (+<? echo number_format($upkeep1->getCostD(),2); ?>).<br />
            The math wiz tells us that that's a total increase from $<strong><? echo number_format($billa,2) ?></strong> to $<strong><? echo number_format($billb,2); ?></strong> (+<? echo number_format($dbill,2); ?>) in infrastructure bills per day.<br />
            <br />
            With this purchase, your daily gross income will increase by $<strong><? echo number_format($dincome,2); ?></strong> (+$<? echo number_format($pop1->getCitizensT() * $income, 2); ?>).<br />
            Your net income (not including military upkeep) will become $<? echo number_format( ($pop1->getCitizensT()*$income) - $billb, 2); ?><br />
    <? if ($roi >= 0) { ?>
            You can expect a return on your investment in <strong><? echo number_format($roi, 0); ?> days (this assumes you do not buy any improvements/wonders).</strong><br />
    <? } else { ?>
            Unfortunately, without buying any improvements or wonders, you'll <strong>never</strong> make a return on your investment (infinite number of days, regardless of any conditions).  <strong>You must buy improvements/wonders!</strong><br />
    <? }

         } else if ($eval == "population") {
                $popmod = $pop1->getInfraGain($h);
                $infra1->setWanted($popmod);
                $upkeep1->setInfra($c);
                $upkeep1->setWanted($popmod);
                $billa = round($upkeep1->getCost(),2) * $c;
                $billb = ($c +$d) * round($upkeep1->getCostEnd(),2);
                $dbill = $billb - $billa;
                if ((($pop1->getCitizens() * $income) - ($dbill)) != 0)
                    $roi = $infra1->getCost() / (($pop1->getCitizens() * $income) - ($billb));
                else
                    $roi = 0;
                $dincome = ($h * $income);
    ?>
            <p>To get another <strong><? echo $h; ?></strong> citizens, you will need to purchase at least <strong><? echo number_format($popmod, 2); ?></strong> levels of infrastructure ($<?
                echo number_format($infra1->getCost(), 2);
            ?>).<br />
            Buying this much infra will increase your infrastructure upkeep (per level) from $<strong><? echo number_format($upkeep1->getCost(),2); ?></strong> to $<strong><? echo number_format($upkeep1->getCostEnd(),2); ?></strong> (+<? echo number_format($upkeep1->getCostD(),2); ?>).<br />
            The math wiz tells us that that's a total increase from $<strong><? echo number_format($billa,2) ?></strong> to $<strong><? echo number_format($billb,2); ?></strong> (+<? echo number_format($dbill); ?>) in infrastructure bills per day.<br />
            <br />
            With this purchase, your daily gross income will increase by $<strong><? echo number_format($dincome,2); ?></strong> (+$<? echo number_format($pop1->getCitizensT() * $income, 2); ?>).<br />
            Your net income (not including military upkeep) will become $<? echo number_format( ($pop1->getCitizensT()*$income) - $billb, 2); ?><br />
    <? if ($roi >= 0) { ?>
            You can expect a return on your investment in <strong><? echo $roi; ?> days (this assumes you do not buy any improvements/wonders).</strong><br />
    <? } else { ?>
            Unfortunately, without buying any improvements or wonders, you'll <strong>never</strong> make a return on your investment (infinite number of days, regardless of any conditions).  <strong>You must buy improvements/wonders!</strong><br />
    <? } ?>
            You can expect a *return on your investment in <strong><? echo $roi; ?> days.</strong><br />
    <? } else { ?> <p>Invalid selection.  Please try again.</p> <? } ?>
            <br />
            <i>* Please note, this feature has not yet been implemented.</i><br />
            </p>
        </div>
    <?

    }

    // always show the input form
    ?>

    <br />
        <form action="<?php echo $_SERVER{'SCRIPT_NAME'}?>?show=economy&eval=<? echo $eval; ?>" method="post"><?
            calcInfra::getSelectTable($eval);
        ?>
        <!-- Password (temporarily here): <input type="password" name="pass" /><br />-->
        </form>
