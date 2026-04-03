<?php
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");

class ParseText extends Object
{

    var $_text;
    var $_stats             = array();
    var $_resource      = array();
    var $_bonus             = array();
    var $_improvement = array();
    var $_wonder            = array();

    function ParseText($startmeup)
    {
        $this->_text = $this->getText($startmeup, "Government Information", "Anywhere that you see the there is more information available for that item.");

        $this->updateResources();
        $this->updateImprovements();
        $this->updateWonders();
        $this->updateStats();
        return;
    }

    function updateResources()
    {
        $res_base   = trim($this->getText($this->_text, "Connected Resources:"  , "Bonus Resources:"));
        $res_bonus  = trim($this->getText($this->_text, "Bonus Resources:"          , "Trade Slots Used:"));

//      $res_base   = str_replace("]", "", str_replace("[", "", $res_base   ));
//      $res_bonus  = str_replace("]", "", str_replace("[", "", $res_bonus));

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
        if (!$a == "No national wonders")
            $name = explode(",", $a);
        else
            $name = array();
        $this->_wonder = $name;
    }

    function updateStats()
    {
        $a = array();
        $a["gove"]      = trim( $this->getText($this->_text, "Government Type:", "(Next") );
        $a["gove"]      = trim( $this->getText($a["gove"], "]", "-") );
        $temp = trim( $this->getText($this->_text, "National Religion:", "Nation Team:"));
        if (strpos($temp, "]") == false)
        {
            $temp = explode(" ",$temp);
            $a["reli"]  = trim( $temp[0] );
        }
        else
        {
            $a["reli"]      = trim( substr($temp, 1, strpos($temp, "]")-1) );
        }
        $a["tech"]      = trim( $this->getText($this->_text, "Technology:", "Infrastructure:") );
        $a["infr"]      = trim( $this->getText($this->_text, "Infrastructure:", "Tax Rate:") );
        $a["land"]      = trim( $this->getText($this->_text, "Area of Influence:", "mile") );
        $a["pop"]       = trim( $this->getText($this->_text, "Total Population:", "Supporters") );
        $temp = $this->getText($this->_text, "Citizens:", "Avg. Gross Income Per Individual Per Day");
        $a["cit"]       = trim( $this->getText($temp, "Soldiers", "Working Citizens") );
        $a["income"]    = trim( substr(trim( $this->getText($this->_text, "Avg. Individual Income Taxes Paid Per Day", "Avg. Net Daily Population Income (After Taxes)") ), 1) );
        $temp = $this->getText($this->_text, "Population Happiness:", "ulation Per Mile:");
        $a["happy"]     = trim( $this->getText($temp, "]", "Pop") );
        $a["ns"]        = trim( $this->getText($this->_text, "Nation Strength:", "Efficiency:") );
        $temp = trim( $this->getText($this->_text, "Number of Soldiers:", "Defending Soldiers:") );
        $a["soldier"]   = trim($this->getText($temp, "(", ")"));
        $a["tank"]      = trim( $this->getText($this->_text, "Number of Tanks:", "Defending Tanks") );

        $this->_stats = $a;
        return;
    }

    function getId()
    {
        return trim($this->getText($this->_text, "Nation Name:", "Ruler:"));
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


}
?>