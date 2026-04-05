<?php
//$SCRIPT_HOME_DIR = "/home/bliangco/public_html/projects/inc/";
// include_once(dirname($_SERVER["PATH_TRANSLATED"])."/common/basepath.inc.php"); // relative target.  Unnecessary evil with this free host.
include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."common/encrypt.class.php");

function trim2($text)
{
    return str_replace(",", "", trim($text));
}

class ResParseText extends Object
{

    var $_text;
    var $_stats         = array();
    var $_resource      = array();
    var $_bonus         = array();
    var $_baseres       = array();
    var $_improvement   = array();
    var $_wonder        = array();

    function ResParseText($startmeup)
    {
        $this->_text = $this->getText($startmeup, "Government Information", "there is more information available for that item.");

        $this->updateResources();
        $this->updateImprovements();
        $this->updateWonders();
        $this->updateStats();
        return;
    }

    function updateResources()
    {
        $res_base   = trim($this->getText($this->_text, "Connected Resources:"  , "Bonus Resources:"));
        $res_bonus  = trim($this->getText($this->_text, "Bonus Resources:"          , "Trade Slots Used"));

        $temp = explode("] [", $res_base);
        foreach ($temp as $txt)
        {
            $tt .= substr($txt, 0, strpos($txt, " ")) . "] [";
        }
        $res_base = substr($tt, 0, -2);

        $temp = explode("] [", $res_bonus);
        foreach ($temp as $txt)
        {
            $ttt .= trim(substr($txt, 0, strpos($txt, "-"))) . "] [";
        }
        $res_bonus = substr($ttt, 0, -2);



        $res_base   = implode(" ", str_replace(" ", "_", explode("] [", $res_base)));
        $res_base   = str_replace("]", "", str_replace("[", "", $res_base   ));
        $res_bonus  = implode(" ", str_replace(" ", "_", explode("] [", $res_bonus)));
        $res_bonus  = str_replace("]", "", str_replace("[", "", $res_bonus));


        $this->_resource    = explode(" ", $res_base);
        $this->_bonus           = explode(" ", $res_bonus);

        $res_base = trim($this->getText($this->_text,"My Resources:","Connected Resources:"));

        $temp = explode("] [", $res_base);
        $res_base = "";
        foreach ($temp as $txt)
        {
            $res_base .= trim(substr($txt, 0, strpos($txt, " ")) ). "] [";
        }
        $res_base = substr($res_base, 0, strlen($res_base)-2);

        $res_base = implode(" ", str_replace(" ", "_", explode("] [", $res_base )));
        $res_base = str_replace("]", "", str_replace("[", "", $res_base));
        $this->_baseres = explode(" ", $res_base);

        return;
    }

    function updateImprovements()
    {
        $temp = trim($this->getText($this->_text, "Improvements:", "National Wonders:"));
        // "Banks: 5, Clinics: 2, Factories: 5, Harbors: 1, Schools: 5, Stadiums: 5, Universities: 2"
        $t = trim(ereg_replace('[^0-9 ]+', '', $temp));
        $a = trim(ereg_replace('[^a-zA-Z ]+', '', $temp));

        $name = explode("  ", $a); // Banks Clinics Factories Harbors Schools Stadiums Universities
        $val    = explode("  ", $t); // 5 2 5 1 5 5 2

        $this->_improvement = $this->combine_arr($name, $val); // { [Banks] => 5, [Clinics] => 2, .. }

        return;
    }

    function updateWonders()
    {
        $temp = trim($this->getText($this->_text, "National Wonders:", "Environment:"));
        //$t = trim(ereg_replace('[^0-9 ]+', '', $temp));
        $temp = str_replace(', ',',',$temp);

        $a = trim(ereg_replace('[^a-zA-Z ,]+', '', $temp));
        if ($a != "No national wonders")
            $name = explode(",", $a);
        else
            $name = array();

        $this->_wonder = $name;
    }

    function updateStats()
    {
        $a = array();
        $a["gove"]      = trim2( $this->getText($this->_text, "Government Type:", "(Next") );
        $a["gove"]      = trim2( $this->getText($a["gove"], "[", "]") );
        $temp = trim2( $this->getText($this->_text, "National Religion:", "Nation Team:"));
        $a["reli"]      = trim2( $this->getText($temp, "[", "]") );
        /*
        if (strpos($temp, "]") == false)
        {
            $temp = explode(" ",$temp);
            $a["reli"]  = trim2( $temp[0] );
        }
        else
        {
            $a["reli"]      = trim2( substr($temp, 1, strpos($temp, "]")-1) );
        }
        */
        $a["tech"]      = trim2( $this->getText($this->_text, "Technology:", "Infrastructure:") );
        $a["infr"]      = trim2( $this->getText($this->_text, "Infrastructure:", "Tax Rate:") );
        $a["land"]      = trim2( $this->getText($this->_text, "Area of Influence:", "mile diameter") );
        $temp = $this->getText($this->_text, "Area of Influence:", "War/Peace Preference:");
        $a["pland"]     = trim2 ($this->getText($temp, "diameter.", "in purchases") );
        $a["nland"]     = trim2 ($this->getText($temp, "modifiers,", "in growth") );
        $a["pop"]       = trim2( $this->getText($this->_text, "Total Population:", "Supporters") );
        $temp = $this->getText($this->_text, "Citizens:", "Avg. Gross Income Per Individual Per Day");
        $a["cit"]       = trim2( $this->getText($temp, "Soldiers", "Working Citizens") );
        $a["income"]    = trim2(substr(trim2( $this->getText($this->_text, "Avg. Individual Income Taxes Paid Per Day", "Avg. Net Daily Population Income (After Taxes)")) , 1));
        $temp   = $this->getText($this->_text, "Avg. Gross Income Per Individual", "Avg. Individual Income Taxes Paid Per Day");
        $a["ginc"]      = trim2 ($this->getText($temp, "$", "("));
        $temp = $this->getText($this->_text, "Population Happiness:", "ulation Per Mile:");
        $a["happy"]     = trim2( $this->getText($temp, "]", "Pop") );
        $a["ns"]        = trim2( $this->getText($this->_text, "Nation Strength:", "Efficiency:") );
        $temp   = trim2( $this->getText($this->_text, "Number of Soldiers:", "Deployed Soldiers:") );
        $a["soldier"]   = trim2($this->getText($temp, "(", ")"));
        $a["tank"]      = trim2( $this->getText($this->_text, "Number of Tanks:", "Defending Tanks:") );
        $a["air"]       = trim2( $this->getText($this->_text, "Aircraft:", "Number of Cruise Missiles") );
        $a["nuke"]      = trim2( $this->getText($this->_text, "Nuclear Weapons:", "Number of Spies:") );
        $a["spy"]      = trim2( $this->getText($this->_text, "Number of Spies:", "Number of Soldiers Lost in All Wars.") );
        $temp = $this->getText($this->_text, "Tax Rate", "Area of Influence:");
        $a["tax"]       = trim2( $this->getText($temp, ":", "%") );
        $temp = trim2($this->getText($this->_text, "Environment:", " Radiation"));   // environment is tricky because "senate votes" only shows up if you qualify.
        $temp   = trim2( $this->getText($temp, "]", "Global"));
        //$temp = explode("\n", $temp);
        //$temp = explode(" ", $temp[0]);
        $a["envir"]     = $temp;
        $temp = $this->getText($this->_text, "Government Financial", "Anywhere");
        $a["cash"]      = trim2 ($this->getText($temp, "$", "("));
        $temp = $this->getText($this->_text, "DEFCON Level:", "Number of Soldiers:");
        $a["defcon"]    = trim2 ($this->getText($temp, "[DEFCON", "-"));

        // variables that are non-numbers: religion, government

        $this->_stats = $a;
        return;
    }

    function getId()
    {
        return trim2($this->getText($this->_text, "Nation Name:", "Ruler:"));
    }

    function getText($text, $s1, $s2)
    {
        $mid_url = "";
        $pos_s = strpos($text,$s1);
        $pos_e = strpos($text,$s2);

        for ( $i=$pos_s+strlen($s1) ; ( ( $i < ($pos_e)) && $i < strlen($text) ) ; $i++ )
            $mid_url .= $text[$i];

        return $mid_url;
    }

    function getStat($key)
    {
        return ( $this->_stats[$key] );
    }

    function hasResource($lookup)
    {
        return (in_array($lookup, $this->_resource));
    }

    function getResources()
    {
        return $this->_resource;
    }

    function hasWonder($lookup)
    {
        return (in_array($lookup, $this->_wonder));
    }

    function hasBonus($lookup)
    {
        return (in_array($lookup, $this->_bonus));
    }

    function getBonuses()
    {
        return $this->_bonus;
    }

    function hasImprovement($lookup)
    {
        if (in_array($lookup, array_keys($this->_improvement)))
        {
            return $this->_improvement[$lookup];
        }

        return 0;
    }

    function getImprovements()
    {
        return $this->_improvement;
    }

    function combine_arr($keys, $val){
        $i = 0;
        foreach($keys AS $key){
            $arr_combined[$key] = $val[$i];
            $i++;
        }

        return $arr_combined;
    }

    function checkDb()
    {
        global $database;

        // only update entries into db when it's been 72 hours since this user's last addition.
        $q = "SELECT timestamp FROM ".TBL_NATION_DATA." WHERE id='".$this->getId()."' ORDER BY timestamp DESC LIMIT 1 ";
        // echo $q;
        $res = $database->query($q);
        if (!$res || (mysql_numrows($res) < 1)) { return true; }

        $a = mysql_fetch_array($res);
        // echo "<br/>".$a['timestamp'];
        if ( (24*60*60 + $a['timestamp']) < time()) { return true; }

        return false;
    }

    function addDb()
    {
        global $database, $crypto;

        $q = "INSERT INTO ".TBL_NATION_DATA." (id, ";
        foreach ($this->_stats as $key => $val) { $q .= $key .", "; }
        $q .= " timestamp) VALUES ('". $this->getId()."', ";
        foreach ($this->_stats as $key => $val) {

            $q .= "'".$crypto->Crypt($val)."', ";
        }
        $q .= time().") ;";
        //echo $q;
        $res = $database->query($q) or die("Data Storage failed.  Exiting");

    }

    function printTableSQL()
    {
        echo "DROP TABLE IF EXISTS ".TBL_NATION_DATA.";\n\n";
        echo "CREATE TABLE ".TBL_NATION_DATA." (\n";
        echo "   id varchar(30) NOT NULL,\n";

        foreach ($this->_stats as $key => $val) {
            echo "   ".$key." varchar(15),\n";
        }

        echo "   timestamp int(11) UNSIGNED NOT NULL,\n";
        echo "   PRIMARY KEY (id, timestamp)\n);";
    }
}
?>