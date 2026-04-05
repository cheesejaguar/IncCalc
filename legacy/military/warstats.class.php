<?php
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."military/battleparse.class.php");
include_once($SCRIPT_HOME_DIR."resource/resparse.class.php");
include_once($SCRIPT_HOME_DIR."common/chart/charts.php");

//if (!isset($_SESSION['nationinfo'])) header("/loader.php");

class WarStats extends Object
{
    var $me;
    var $nation;
    var $type;
    var $time;
    var $wid;
    var $baseday;
    var $GraphDataIdx = array();
    var $GraphDataPoint = array();

    var $wins = array();
    var $losses = array();
    var $soldiers;
    var $tanks;
    var $aircraft;

    function createWar($name) {
        global $database;
        $q = "INSERT INTO ".TBL_WARS." (nation, fighting, started, active) VALUES ('".$this->nation."', '".$name."', ".$time.", 1);";
        $this->baseday = $this->time;
        $database->query($q);
    }
    function endWar($name) {
        global $database;
        $q = "UPDATE ".TBL_WARS." SET (active = 0) WHERE nation='".$this->nation."' AND fighting='".$name."';";
        $res = $database->query($q);
    }

    function loadWar($name) {
        global $database;
/*        $q = "
            SELECT wid FROM ".TBL_WARS."
             WHERE nation   = '".$this->nation."'
               AND fighting = '".$name."'
               AND started  = ".$this->time."
             LIMIT 1;";
/*/
        $q = "
            SELECT wid FROM ".TBL_WARS."
             WHERE nation   = '".$this->nation."'
               AND fighting = '".$name."'
             ORDER BY started DESC
             LIMIT 1;";
        $res = $database->query($q);
        $rowcount = mysql_numrows($res);

        if (!$res || ($rowcount < 1)) return -1;

        $a = mysql_fetch_array($res);
        $this->wid = $a["wid"];
        return $this->wid;
    }

    function createBattle($wid, $text) {
        global $database;
        if ($wid == -1) $wid = $this->wid;

        $battle = new BattleParse($text);

        foreach ($battle->wins as $key => $val)
        {
            $textwin .= ", win".$key."=".$val;
        }
        foreach ($battle->losses as $key=>$val)
        {
            $textloss = ", loss".$key."=".$val;
        }

        $q = "INSERT INTO ".TBL_BATTLES." VALUES (war=".$wid.$textwin.$textloss.", timestamp=".$this->time.");";
        $database->query($q);
    }

    function loadBattles($wid) {
        global $database;
        if ($wid == -1) $wid = $this->wid;

        $q = "SELECT * FROM ".TBL_BATTLES." WHERE war=".$WID." ORDER BY timestamp ASC";
        $res = $database->query($q);

        $rowcount = mysql_numrows($res);
        if (!$res || ($rowcount < 1)) return -1;

        $a = mysql_fetch_array($res);

        $this->baseday = (mysql_result($res,0, "timestamp"));

        for ( $i=0; $i < mysql_num_rows($res); $i++ ) {
            $this->battles[$i] = mysql_fetch_object($res);
        }
    }

    function getWarTotal($kswitch, $stat)
    {
        $count = 0;

        $stat = ($kswitch) ? "win".$stat : "loss".$stat;

        foreach ($this->battles as $battle)
            $count += ($battle[$stat]);

        return $count;
    }

    function loadStatGraph($kswitch, $stat)
    {
        // reset graph vars
        $this->graphDataIdx = array();
        $this->graphDataPoint = array();

        $stat = ($kswitch) ? "win".$stat : "loss".$stat;

        foreach ($this->battles as $battle)
        {
            // new data point:
            array_push($this->graphDataIdx, "x");
            array_push($this->graphDataIdx, "y");
            array_push($this->graphDataPoint, round( ($battle["timestamp"] - $this->baseday)/60/60/24, 0) );
            array_push($this->graphDataPoint, $battle[$stat]);
        }

        // return array (replicated in getGraphData)
        return array($this->graphDataIdx, $this->graphDataPoint);
    }

    function getGraphData()
    {
        return array($this->graphDataIdx, $this->graphDataPoint);
    }

    function WarStats()
    {
        global $_SESSION;

        $this->time = time();
        $this->me = new ResParseText($_SESSION['nationinfo']);
        $this->nation = $this->me->getId();
        $this->soldiers = $this->me->getStat("soldier");
        $this->tanks = $this->me->getStat("tanks");
        $this->aircraft = $this->me->getStat("air");

        return;
    }
}

?>
