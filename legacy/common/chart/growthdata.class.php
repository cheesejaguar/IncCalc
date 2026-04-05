<?php

//$SCRIPT_HOME_DIR = "/home/bliangco/public_html/projects/inc/";
if (!isset($SCRIPT_HOME_DIR)) {
    include_once("../basepath.inc.php");
}
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."common/parse.class.php");
include_once($SCRIPT_HOME_DIR."common/encrypt.class.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."common/chart/charts.php");

// only helpful if you're logged in and nation data has been stored -- otherwise we can't use the class.
if (!$session->logged_in)  header("index.php?show=login");
//if (!isset($_SESSION['nationinfo'])) header("loader.php");

class GrowthChartData extends Object
{
    var $chart;
    var $uid;
    var $today;
    var $curval;

    function GrowthChartData($field)
    {
        global $_SESSION;

        $a = new ParseText($_SESSION['nationinfo']);
        $this->uid = $a->getId();
        $this->today = time();
        $this->curval = $a->getStat($field);

        $this->init(); // initialize graph design
        //echo "asdf";

        if ($field) {
            $a = $this->getDbValues($field);
            if (!$a) return;

            $this->chart[ 'chart_data' ]    = $a;
        }
    }

    function init()
    {
    /*
        // initialize chart properties
        $this->chart[ 'axis_category' ] = array (  'size'=>12, 'color'=>"000000", 'alpha'=>75, 'font'=>"arial", 'bold'=>true, 'skip'=>0 ,'orientation'=>"horizontal" );
        $this->chart[ 'axis_ticks' ] = array ( 'value_ticks'=>false, 'category_ticks'=>true, 'major_thickness'=>1, 'minor_thickness'=>0, 'minor_count'=>1, 'major_color'=>"000000", 'minor_color'=>"222222" ,'position'=>"inside" );
        $this->chart[ 'axis_value' ] = array ( 'font'=>"arial", 'bold'=>true, 'size'=>10, 'color'=>"ffffff", 'alpha'=>50, 'prefix'=>"", 'suffix'=>"", 'decimals'=>0, 'separator'=>"", 'show_min'=>false );
        $this->chart[ 'chart_border' ] = array ( 'color'=>"000000", 'top_thickness'=>1, 'bottom_thickness'=>2, 'left_thickness'=>1, 'right_thickness'=>1 );
        $this->chart[ 'chart_grid_h' ] = array ( 'alpha'=>10, 'color'=>"000000", 'thickness'=>1 );
        $this->chart[ 'chart_grid_v' ] = array ( 'alpha'=>20, 'color'=>"000000", 'thickness'=>2, 'type'=>"dotted" );
        // $this->chart[ 'chart_pref' ] = array ( 'point_size'=>5, 'trend_alpha'=>20, 'trend_thickness'=>2 );
        $this->chart[ 'chart_pref' ] = array ( 'point_size'=>5, 'trend_thickness'=>0, 'line_alpha'=>20, 'line_thickness'=>2 );
        $this->chart[ 'chart_rect' ] = array ( 'x'=> 75, 'y'=>25, 'width'=>300, 'height'=>150, 'positive_color'=>"000000",'positive_alpha'=>25, 'negative_color'=>"ff0000",  'negative_alpha'=>10 );
        $this->chart[ 'chart_type' ] = "scatter";
        $this->chart[ 'chart_value' ] = array ( 'position'=>"cursor", 'bold'=>true, 'size'=>12, 'color'=>"ffffff", 'alpha'=>75 );

        $this->chart[ 'draw' ] = array ( array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>20, 'font'=>"arial", 'bold'=>true, 'size'=>25, 'x'=>75, 'y'=>190, 'width'=>400, 'height'=>150, 'text'=>"Day", 'h_align'=>"left", 'v_align'=>"top" ),
                                   array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>20, 'rotation'=>-90, 'bold'=>true, 'size'=>25, 'x'=>-20, 'y'=>180, 'width'=>200, 'height'=>60, 'text'=>"Value", 'h_align'=>"left", 'v_align'=>"bottom" ));

        $this->chart[ 'legend_label' ] = array ( 'layout'=>"vertical", 'font'=>"arial", 'bold'=>true, 'size'=>12, 'color'=>"ffffff", 'alpha'=>50 );
        $this->chart[ 'legend_rect' ] = array ( 'x'=>275, 'y'=>190, 'width'=>10, 'height'=>35, 'margin'=>3, 'fill_color'=>"ffffff", 'fill_alpha'=>0, 'line_color'=>"000000", 'line_alpha'=>0, 'line_thickness'=>0 );

        $this->chart[ 'series_color' ] = array ( "88ff00");//, "ff8800" );
*/
// initialize chart properties
        $this->chart[ 'axis_category' ] = array (  'min'=>0, 'size'=>12, 'color'=>"000000", 'alpha'=>75, 'font'=>"arial", 'bold'=>true, 'skip'=>0 ,'orientation'=>"horizontal" );
        $this->chart[ 'axis_ticks' ] = array ( 'value_ticks'=>false, 'category_ticks'=>true, 'major_thickness'=>1, 'minor_thickness'=>0, 'minor_count'=>1, 'major_color'=>"000000", 'minor_color'=>"222222" ,'position'=>"inside" );
        $this->chart[ 'axis_value' ] = array ( 'font'=>"arial", 'bold'=>true, 'size'=>10, 'color'=>"000000", 'alpha'=>75, 'prefix'=>"", 'suffix'=>"", 'decimals'=>0, 'separator'=>"", 'show_min'=>false );
        $this->chart[ 'chart_border' ] = array ( 'color'=>"000000", 'top_thickness'=>1, 'bottom_thickness'=>2, 'left_thickness'=>1, 'right_thickness'=>1 );
        $this->chart[ 'chart_grid_h' ] = array ( 'alpha'=>10, 'color'=>"000000", 'thickness'=>1 );
        $this->chart[ 'chart_grid_v' ] = array ( 'alpha'=>20, 'color'=>"000000", 'thickness'=>2, 'type'=>"dotted" );
        // $this->chart[ 'chart_pref' ] = array ( 'point_size'=>5, 'trend_alpha'=>20, 'trend_thickness'=>2 );
        $this->chart[ 'chart_pref' ] = array ( 'point_size'=>1, 'trend_thickness'=>0, 'line_alpha'=>80, 'line_thickness'=>2 , 'fill_shape' => true);
        $this->chart[ 'chart_rect' ] = array ( 'x'=> 75, 'y'=>25, 'width'=>500, 'height'=>165, 'positive_color'=>"000000",'positive_alpha'=>10, 'negative_color'=>"ff0000",  'negative_alpha'=>10 );
        $this->chart[ 'chart_type' ] = "scatter";
        $this->chart[ 'chart_value' ] = array ( 'position'=>"cursor", 'bold'=>true, 'size'=>10, 'color'=>"000000", 'alpha'=>75, 'decimals'=>2 );
        $this->chart['series_explode'] = array ( 600 );

        $this->chart[ 'draw' ] = array ( array ( 'type'=>"text", 'color'=>"000000", 'alpha'=>80, 'font'=>"arial", 'bold'=>true, 'size'=>11, 'x'=>230, 'y'=>210, 'width'=>400, 'height'=>170, 'text'=>"Day", 'h_align'=>"left", 'v_align'=>"top" ),
                                   array ( 'type'=>"text", 'color'=>"000000", 'alpha'=>80, 'rotation'=>-90, 'bold'=>true, 'size'=>11, 'x'=>-25, 'y'=>130, 'width'=>200, 'height'=>60, 'text'=>"Value", 'h_align'=>"left", 'v_align'=>"bottom" ));
/*
         $this->chart[ 'legend_label' ] = array ( 'layout'=>"vertical", 'font'=>"arial", 'bold'=>true, 'size'=>10, 'color'=>"000000", 'alpha'=>80 );
         $this->chart[ 'legend_rect' ] = array ( 'x'=>490, 'y'=>153, 'width'=>10, 'height'=>35, 'margin'=>3, 'fill_color'=>"ffffff", 'fill_alpha'=>10, 'line_color'=>"000000", 'line_alpha'=>0, 'line_thickness'=>0 );
*/
         $this->chart[ 'legend_label' ] = array ( 'layout'=>"vertical", 'font'=>"arial", 'bold'=>true, 'size'=>10, 'color'=>"000000", 'alpha'=>80 );
         $this->chart[ 'legend_rect' ] = array ( 'x'=>75, 'y'=>25, 'width'=>10, 'height'=>35, 'margin'=>3, 'fill_color'=>"ffffff", 'fill_alpha'=>10, 'line_color'=>"000000", 'line_alpha'=>0, 'line_thickness'=>0 );
        $this->chart[ 'series_color' ] = array ( "B91631" );// "88ff00");//, "ff8800" );

    }

    function getDbValues($field)
    {
        global $database;
        global $_SESSION;
        global $crypto;

        $days = array("");
        if ($field == "tech") {
            $vals = array("technology");
            $vals2 = array("10% infra");
            $vals3 = array("20% infra");
        }
        elseif ($field == "cit") {
            $vals = array("num. of citizens");
            $vals2 = array("actual soldiers");
            $vals3 = array("minimum soldiers");
        }
        elseif ($field == "infr") {
            $vals = array("infrastructure");
        }
        elseif ($field == "ns") {
            $vals = array("strength");
        }
        else
        {
            $vals = array($field);
        }

        // $q = "SELECT timestamp, ".$field." FROM ".TBL_NATION_DATA." WHERE id =\"".$this->uid."\" ORDER BY timestamp ASC;";
        $q = "SELECT timestamp, ns, infr, tech, happy, income, cit, pop FROM ".TBL_NATION_DATA." WHERE id=\"".$this->uid."\" ORDER BY timestamp ASC;";
        $res = $database->query($q);

        //echo $q."RES--<br />";

        if ((!$res) || (mysql_numrows($res) < 1)) return;

        $baseday = (mysql_result($res,0, "timestamp"));
        array_push( $this->chart['draw'], array ( 'type'=>"text", 'color'=>"000000", 'alpha'=>80, 'font'=>"arial", 'bold'=>true, 'size'=>10, 'x'=>10, 'y'=>210, 'width'=>400, 'height'=>80, 'text'=> "start date: ".date("d M Y", $baseday), 'h_align'=>"left", 'v_align'=>"top" ));

        for ( $i=0; $i < mysql_num_rows($res); $i++ ) {
            $unixtime = mysql_result($res, $i, "timestamp");
            $day = round( ($unixtime - $baseday)/60/60/24, 0);
            $crypto->SetKey($unixtime);
            //echo $unixtime."<br />";
            //echo $crypto->GetKey()."<br />";
            $val = $crypto->Crypt(mysql_result($res,$i, $field));
            //echo $val."<br />";
            array_push($days, "x");
            array_push($days, "y");
            array_push($vals, $day);
            array_push($vals, $val);
            if ($field == "tech") {
                array_push($vals2, $day);
                array_push($vals2, mysql_result($res,$i,"infr")*0.1);
                array_push($vals3, $day);
                array_push($vals3, mysql_result($res,$i,"infr")*0.2);
            }
            else if ($field == "cit") {
                array_push($vals2, $day);
                array_push($vals2, mysql_result($res,$i,"pop") - mysql_result($res,$i,"cit"));
                array_push($vals3, $day);
                array_push($vals3, mysql_result($res,$i,"cit")*0.2);
            }

            // array_push($days, $day);
            // array_push($vals, $val);
        }

        $a = array();
        if ($field == "tech") {
            $a[0] = $days;
            $a[1] = $vals;
            $a[2] = $vals2;
            $a[3] = $vals3;// array($days, $vals), array($days, $vals2));
            return $a;
        }
        else if ($field == "cit") {
            $a[0] = $days;
            $a[1] = $vals;
            $a[2] = $vals2;
            $a[3] = $vals3;
            return $a;
        }

        return array($days, $vals);
    }

    function setTimeZero($timestamp)
    {
        $this->chart['draw'] = array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>30, 'font'=>"arial", 'bold'=>true, 'size'=>10, 'x'=>130, 'y'=>200, 'width'=>400, 'height'=>80, 'text'=> "started: ".date("d M Y", $timestamp), 'h_align'=>"left", 'v_align'=>"top" );
    }

    function setChartData($myarray)
    {
        $this->chart[ 'chart_data' ] = $myarray;
    }

    function setField($field)
    {
        $a = $this->getDbValues($field);
        if (!$a) return;

        $this->chart[ 'chart_data' ]    = $a;
    }

    function getData()
    {
        return $this->chart;
    }
}

?>