<?php

//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."common/parse.class.php");
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
        // initialize chart properties
        $this->chart[ 'axis_category' ] = array (  'min'=>0, 'max'=>550, 'size'=>12, 'color'=>"000000", 'alpha'=>75, 'font'=>"arial", 'bold'=>true, 'skip'=>0 ,'orientation'=>"horizontal" );
        $this->chart[ 'axis_ticks' ] = array ( 'value_ticks'=>false, 'category_ticks'=>true, 'major_thickness'=>1, 'minor_thickness'=>0, 'minor_count'=>1, 'major_color'=>"000000", 'minor_color'=>"222222" ,'position'=>"inside" );
        $this->chart[ 'axis_value' ] = array ( 'font'=>"arial", 'bold'=>true, 'size'=>10, 'color'=>"000000", 'alpha'=>75, 'prefix'=>"", 'suffix'=>"", 'decimals'=>0, 'separator'=>"", 'show_min'=>false );
        $this->chart[ 'chart_border' ] = array ( 'color'=>"000000", 'top_thickness'=>1, 'bottom_thickness'=>2, 'left_thickness'=>1, 'right_thickness'=>1 );
        $this->chart[ 'chart_grid_h' ] = array ( 'alpha'=>10, 'color'=>"000000", 'thickness'=>1 );
        $this->chart[ 'chart_grid_v' ] = array ( 'alpha'=>20, 'color'=>"000000", 'thickness'=>2, 'type'=>"dotted" );
        // $this->chart[ 'chart_pref' ] = array ( 'point_size'=>5, 'trend_alpha'=>20, 'trend_thickness'=>2 );
        $this->chart[ 'chart_pref' ] = array ( 'point_size'=>2, 'trend_thickness'=>0, 'line_alpha'=>20, 'line_thickness'=>1 );
        $this->chart[ 'chart_rect' ] = array ( 'x'=> 75, 'y'=>25, 'width'=>400, 'height'=>165, 'positive_color'=>"000000",'positive_alpha'=>10, 'negative_color'=>"ff0000",  'negative_alpha'=>10 );
        $this->chart[ 'chart_type' ] = "scatter";
        $this->chart[ 'chart_value' ] = array ( 'position'=>"cursor", 'bold'=>true, 'size'=>10, 'color'=>"000000", 'alpha'=>75, 'decimals'=>2 );

        $this->chart[ 'draw' ] = array ( array ( 'type'=>"text", 'color'=>"000000", 'alpha'=>80, 'font'=>"arial", 'bold'=>true, 'size'=>11, 'x'=>230, 'y'=>210, 'width'=>400, 'height'=>170, 'text'=>"Enemy Spies (#)", 'h_align'=>"left", 'v_align'=>"top" ),
                                   array ( 'type'=>"text", 'color'=>"000000", 'alpha'=>80, 'rotation'=>-90, 'bold'=>true, 'size'=>11, 'x'=>-7, 'y'=>160, 'width'=>200, 'height'=>60, 'text'=>"Success Prob. (%)", 'h_align'=>"left", 'v_align'=>"bottom" ));
                                   /*,
                                   array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>3, 'rotation'=>-10, 'bold'=>true, 'size'=>100, 'x'=>260, 'y'=>180, 'text'=>"@" ),
                                   array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>3, 'rotation'=>10, 'bold'=>true, 'size'=>100, 'x'=>15, 'y'=>100, 'text'=>"@" ),
                                   array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>3, 'rotation'=>45, 'bold'=>true, 'size'=>100, 'x'=>225, 'y'=>-20, 'text'=>"@" ),
                                   array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>3, 'rotation'=>-45, 'bold'=>true, 'size'=>100, 'x'=>10, 'y'=>-10, 'text'=>"@" ),
                                   array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>3, 'rotation'=>0, 'bold'=>true, 'size'=>100, 'x'=>350, 'y'=>30, 'text'=>"@" ) );
*/
         $this->chart[ 'legend_label' ] = array ( 'layout'=>"vertical", 'font'=>"arial", 'bold'=>true, 'size'=>12, 'color'=>"ffffff", 'alpha'=>50 );
         $this->chart[ 'legend_rect' ] = array ( 'x'=>600, 'y'=>190, 'width'=>10, 'height'=>35, 'margin'=>3, 'fill_color'=>"ffffff", 'fill_alpha'=>0, 'line_color'=>"000000", 'line_alpha'=>0, 'line_thickness'=>0 );

        $this->chart[ 'series_color' ] = array ( "B91631" );// "88ff00");//, "ff8800" );

    }

    function getDbValues($field)
    {
        global $database;
        global $_SESSION;
        $days = array("");
        $vals = array($field);


        $q = "SELECT timestamp, ".$field." FROM ".TBL_NATION_DATA." WHERE id =\"".$this->uid."\" ORDER BY timestamp ASC;";
        $res = $database->query($q);

        if ((!$res) || (mysql_numrows($res) < 1)) return;

        $baseday = (mysql_result($res,0, "timestamp"));
        array_push( $this->chart['draw'], array ( 'type'=>"text", 'color'=>"ffffff", 'alpha'=>30, 'font'=>"arial", 'bold'=>true, 'size'=>10, 'x'=>130, 'y'=>200, 'width'=>400, 'height'=>80, 'text'=> "started: ".date("d M Y", $baseday), 'h_align'=>"left", 'v_align'=>"top" ));
        for ( $i=0; $i < mysql_num_rows($res); $i++ ) {
            $day = round( (mysql_result($res, $i, "timestamp") - $baseday)/60/60/24, 0);
            $val = mysql_result($res,$i, $field);
            array_push($days, "x");
            array_push($days, "y");
            array_push($vals, $day);
            array_push($vals, $val);
            // array_push($days, $day);
            // array_push($vals, $val);
        }

        // print_r($days);
        // print_r($vals);
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