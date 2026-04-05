<?php

// chartsrc
//$SCRIPT_HOME_DIR = "/home/bliangco/public_html/projects/inc/";
if (!isset($SCRIPT_HOME_DIR)) {
    include_once("../basepath.inc.php");
}
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."common/chart/growthdata.class.php");

// only helpful if you're logged in and nation data has been stored -- otherwise we can't use the class.
if (!$session->logged_in) { header("index.php?show=login"); }
if (!isset($_SESSION['nationinfo'])) { header("loader.php"); }

class ChartSrc extends Object
{
    var $data;
    var $opts;
    var $wanted;

    function ChartSrc()
    {
        $this->opts = array("ns", "infr", "tech", "happy", "income", "cit", "pop");
        return;
    }

    function Statistic($stat)
    {
        if ( (in_array($stat, $this->opts)) || ($stat != "") ) // verify valid
            $this->wanted = $stat;
        else
            $this->wanted = "ns";

        $a = new GrowthChartData($this->wanted);
        $this->data = $a->getData();
        //print_r($this->data);
    }

    function getData()
    {
        return $this->data;
    }
}

$stat = $_GET['stat'];
$chartobj = new ChartSrc();
$chartobj->Statistic($stat);

SendChartData ($chartobj->getData());

 //print_r($chartobj->getData());

?>