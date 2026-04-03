<?php

// chartsrc
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."military/warstats.class.php");

// only helpful if you're logged in and nation data has been stored -- otherwise we can't use the class.
if (!$session->logged_in) { header("index.php?show=login"); }
if (!isset($_SESSION['nationinfo'])) { header("loader.php"); }

class WarChart extends Object
{
    var $data;
    var $opts;
    var $wanted;
    var $ws;
    var $wid;

    function WarChart()
    {
        $this->ws = New WarStats();
        $this->opts = array("soldiers", "tanks", "cruise", "fighter", "bomber", "infra", "tech", "land", "cash");
        return;
    }

    function selectItem($kswitch, $enemy, $stat)
    {
        $this->wid = $this->ws->loadWar($enemy);
        $this->ws->loadBattles($this->wid);
        $this->data = $this->ws->loadStatGraph($kswitch, $stat);
    }

    function Statistic($stat)
    {
        if ( (in_array($stat, $this->opts)) || ($stat != "") ) // verify valid
            $this->wanted = $stat;
        else
            $this->wanted = "infra";

        $a = new GrowthChartData();
        $this->data = $a->getData();
        // print_r($this->data);
    }

    function getData()
    {
        return $this->data;
    }
}

$chartobj = new WarChart();
$chartobj->selectItem($win, $against, $stat);

SendChartData ($chartobj->getData());

// print_r($chartobj->getData());

?>