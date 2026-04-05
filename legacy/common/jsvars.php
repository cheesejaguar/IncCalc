<?php
// $SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR."resource/resparse.class.php");
include_once($SCRIPT_HOME_DIR."infra/infra.class.php");
include_once($SCRIPT_HOME_DIR."upkeep/upkeep.class.php");
include_once($SCRIPT_HOME_DIR."tech/tech.class.php");

if (isset($_SESSION['nationinfo'])) {
    $USER_STORE = 1;
    $a = new ResParseText($_SESSION['nationinfo']);
}
else {
    echo "fuck you leave.";
    return; }
?>

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ---Inc. Client-Side Resource Calculator V1.0---                       *
 * Implemented in Javascript because twelve monkeys on typewriters could *
 * put together a functioning resource calculator in about a week.       *
 * Honestly, if you're bothering to steal this, I feel sorry for your    *
 * alliance already. Write a C app. This is sloppy and not IE-compatible.*
 * The code, such as it is, copyright Ryan Carlyle, April 2007.          *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

//TODO:DISPLAY CONTENT LOL
// done?

//DATA MANAGEMENT LOL

// set up JS nation vars
<?
echo "var tech = ".         $a->getStat('tech')."\n".
         "var infra = ".        $a->getStat('infr')."\n".
         "var tax = ".          ($a->getStat('tax')/100)."\n".
         "var defcon = ".       $a->getStat('defcon')."\n";
echo "var purLand = ".  $a->getStat('pland')."\n".
         "var natLand = ".  $a->getStat('nland')."\n".
         "var environment=".$a->getStat('envir')."\n".
         "var soldiers = ". $a->getStat('soldier')."\n".
         "var tanks = ".        $a->getStat('tank')."\n".
         "var planes = ".       $a->getStat('air')."\n".
         "var missiles = 0 // unused, not filled in";
echo "\nvar nukes = ".      $a->getStat('nuke')."\n".
         "var happiness = ".    $a->getStat('happy')."\n".
         "var population = ".   $a->getStat('cit')."\n".
         "var grossIncome = ".$a->getStat('ginc')."\n".
         "var cash = ".         $a->getStat('cash')."\n";
    $lit = 1 - 40/($a->getStat('tech') + 0.5);
    echo "var literacy = ". $lit ."\n";

        $infra1 = new calcInfra();
        $upkeep1 = new calcUpkeep();


        if (!isset($res)) {
            $b = implode("+",$a->getResources());
            $c = implode("+",$a->getBonuses());
            if (strpos("  Capitalist Dictatorship Federal Government Monarchy Republic Revolutionary Government", $a->getStat("gove")) != 0)
                $c .= "+government";
            $res = explode("+", strtolower($b."+".$c));
        }
        //echo "fact: ". $a->hasImprovement("Factories");
        //print_r($res);

        $infra1->setFactories($a->hasImprovement("Factories"));
        $infra1->updateModifier($res);
        $infra1->setInfra($a->getStat("infr"));
        $infra1->setWanted(1);
        echo "var infraCost = ".$infra1->getCost()."\n";

        $upkeep1->setTech($a->getStat('tech'));
        $upkeep1->setNS($a->getStat('ns'));
        $upkeep1->setImprovements($a->hasImprovement("Labor Camps"));
        $upkeep1->updateModifier($res);
        $upkeep1->setInfra($a->getStat("infr"));
        // $upkeep1->setWanted(1);
        echo "var InfraUpkeep = ".$upkeep1->getCost()."\n";

        $tech1 = new calcTech();
        $tech1->setImprovements($a->hasImprovement("Universities"));
        $tech1->setTech($a->getStat("tech"));
        $tech1->updateModifier($res);
        echo "var techCost = ".$tech1->getCost()."\n";

?>

var basePurLand = 0      // calculated with preCalc()
var baseEnvironment = 0
var baseSoldiers = 0
var baseHappiness = 0
var basePopulation = 0
var baseGrossIncome = 0
var baseInfraCost = 3000 // CALCULATE IN PHP WHEN PAGE IS SERVED TO PREVENT ALGORITHM LEAK
var baseInfraUpkeep = 30 // CALCULATE IN PHP
var baseTechCost = 30000 // CALCULATE IN PHP

