<?php
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");

class BattleParse extends Object
{

    var $_text;
    var $type;
    var $wins = array();
    var $losses = array();


    function BattleParse($startmeup)
    {
        $this->_text = $startmeup;
        $this->setBattleType();
        $this->setStats();
        return;
    }

    function setBattleType()
    {
        if (strpos($this->_text, "bombing run") > 0)
            $this->type = "air";
        else if (strpos($this->_text, "attacked with a cruise missile") > 0)
            $this->type = "cruise";
        else if (strpos($this->_text, "have been attacked by") > 0)
            $this->type = "ground";
        else if (strpos($this->_text, "nuclear weapon") > 0)
            $this->type = "nuke";
        else
            $this->type = "invalid";

        $this->_text = substr($this->_text, 1+strpos($this->_text, "."));
    }

    function setStats()
    {
        switch($this->type)
        {
            case "air":
                $bombed = $this->getText($this->_text, "attack you", ". ");
                // echo "[".$bombed."]\n<br />";
                $kill["tanks"]  = trim($this->getText($bombed, "lost", "defending ta"));
                $kill["cruise"] = trim($this->getText($bombed, "nks", "cruise missile"));
                $kill["infra"]  = trim($this->getText($bombed, "and", "infra"));

                $this->_text = substr($this->_text, 1+ strpos($this->_text, ". "));
                $lost["bomber"] = trim($this->getText($this->_text, "destroyed", "attacking"));

                $this->_text = substr($this->_text, 1+strpos($this->_text, ". "));
                $lost["fighter"]= trim($this->getText($this->_text, "destroyed", "fighter aircraft launched"));
                $kill["fighter"]= trim($this->getText($this->_text, "lost", "fighter"));
            break;

            case "cruise":
                $kill["tanks"]  = trim($this->getText($this->_text, "lost", "defending tanks"));
                $kill["cruise"] = trim($this->getText($this->_text, " and", "infra"));
            break;

            case "ground":
                $kill["soldiers"]   = $this->getText($this->_text, "lost", "soldiers");
                $kill["tanks"]      = $this->getText($this->_text, " and", "tanks.");
                $this->_text = substr($this->_text, strpos($this->_text, " kill"));
                $lost["soldiers"]   = $this->getText($this->_text, "killed", "soldiers");
                $lost["tanks"]      = $this->getText($this->_text, " and", "tanks");
                $this->_text = substr($this->_text, strpos($this->_text, ". "));
                $kill["land"]       = $this->getText($this->_text, "razed", "miles");
                $kill["tech"]       = $this->getText($this->_text, "stole", "technology");
                $kill["infra"]      = $this->getText($this->_text, "destroyed", "infra");
                $kill["cash"]       = $this->getText($this->_text, "looted", "from");
                $lost["cash"]       = $this->getText($this->_text, "gained", "in your enemy");
            break;

            case "nuke":
                // echo $this->_text."asd<br/>";
                $kill["soldiers"]   = $this->getText($this->_text, "lost", "soldiers");
                $kill["tanks"]      = $this->getText($this->_text, ",",  "defending tanks");
                $kill["cruise"]     = $this->getText($this->_text, "tanks", "cruise");
                $kill["land"]       = $this->getText($this->_text, "missiles", "miles of land");
                $kill["infra"]      = $this->getText($this->_text, "miles of land", "infrastructure");
                //$kill["air"]
            break;

            default:
            break;
        }

        $this->wins = $kill;
        $this->losses = $lost;

    }

    function getText($text, $s1, $s2)
    {
        $mid_url = "";
        $pos_s = strpos($text,$s1);
        $pos_e = strpos($text,$s2);

        for ( $i=$pos_s+strlen($s1) ; ( ( $i < ($pos_e)) && $i < strlen($text) ) ; $i++ )
            $mid_url .= $text[$i];


        return trim(ereg_replace("[$,]", "", $mid_url));
    }

    function count($kswitch, $key)
    {
        if ($kswitch) return $this->wins[$key];

        return $this->losses[$key];
    }

    function loaded($kswitch)
    {
        $myret = array();
        if ($kswitch) {
            if (is_array($this->wins)) {
                foreach ($this->wins as $key => $val)
                    array_push($myret, $key);
            }
        }
        else
        {
            if (is_array($this->losses)) {
                foreach ($this->losses as $key => $val)
                    array_push($myret, $key);
            }
        }
        return $myret;
    }
}

/*if (isset($_POST["k"])) {
    $battle = new BattleParse($_POST["k"]);
    //$k = $battle->loaded(1);
    //print_r($k);
    print_r($battle->wins);
    //$k = $battle->loaded(0);
    //print_r($k);
    print_r($battle->losses);
}
<!--
<form action="battleparse.class.php" method="post">
    <input type="text" name="k" />
    <input type="submit" />
</form>
-->

// IGNORE --> deprecated commands, use adodb interface
if (check_dbaccess($session_object->personalDb()) != CASE_OKAY)
{
    raiseEvent(EVENT_ERROR, SQL_DB_NO_ACCESS, null);
    return;
}
if (execute_dbcommand("kill table " . $table_name . ";") == CASE_ALREADY_DONE)
{
    raiseEvent(EVENT_ERROR, SQL_DB_ALREADY_DONE, null);
    return;
}
else
{
    if (execute_dbcommand("dump data from " . SQL_EVENT_DB . ";") == CASE_OKAY)
    {
        // KLUDGE:  $session_object shouldn't need to be passed each time, but the class
        // actually modifies byRef for some reason.  Stop the madness and listen to my
        // suggestions.and we'll make some progress.
        // program halt issued so you will actually read my revision notes:
        kill $session_object;
        raiseEvent(EVENT_SUCCESS, SQL_DB_DATA_RETRIEVED, $session_object)
        $session_object->updateStatus(COMMAND_COMPLETED);
        return;
    }
    else
    {
        raiseEvent(EVENT_ERROR, SQL_DB_UNKNOWN, $errorlog_object);
        return;
    }
}

*/
?>