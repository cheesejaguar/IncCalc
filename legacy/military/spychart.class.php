<?php

// chartsrc
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."military/spydata.class.php");

// only helpful if you're logged in and nation data has been stored -- otherwise we can't use the class.
if (!$session->logged_in) { header("index.php?show=login"); }

class ChartSrc extends Object
{
    var $data;

    function ChartSrc()
    {
        $this->Object();
        return;
    }

    function Statistic($a1, $a2, $a3, $a4)
    {
        $a = new GrowthChartData(false);
            $columns = array(1);
            $datapt = array(1);

            for ($i = 0; $i <= 550; $i = $i + 2)
            {
                array_push($columns, "x");
                array_push($columns, "y");

                $against = ($i + (($a2 + $a3) / 20)) * $a4;
                //echo $a1."|".$a2."|".$a3."|".$a4."DD";
                $currentdata = 100 * $a1 / ($a1 + $against);
                array_push($datapt, $i);
                array_push($datapt, $currentdata);
            }

            //print_r (array($columns, $datapt));
            $a->setChartData(array($columns, $datapt));
            $this->data = $a->getData();
    }

    function getData()
    {
        return $this->data;
    }
}

$a1 = $_GET["a1"];
$a2 = $_GET["a2"];
$a3 = $_GET["a3"];
$a4 = $_GET["a4"];
$chartobj = new ChartSrc();
$chartobj->Statistic($a1, $a2, $a3, $a4);

SendChartData ($chartobj->getData());

// print_r($chartobj->getData());

?>