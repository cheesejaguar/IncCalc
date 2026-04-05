<?php
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");

class ParseSearch extends Object
{

    var $_text;
    var $_rulers = array();

    function ParseSearch($startmeup)
    {
        $temp = $this->getText($startmeup, "Page:", "Nation Strength Range:");
        $this->_text = trim($this->getText($temp, "War", "Page:"));
        $this->analyzeNations();
        return;
    }

    function analyzeNations()
    {
        $splitted = explode("\t", $this->_text);
        $newarray = array();

        for ($i = 0; $i < count($splitted); $i++)
        {
            if (strpos(trim($splitted[$i]), "]") == false)
            {
                array_push($newarray, trim($splitted[$i]));
            }
        }

        for ($i = 0; $i < count($newarray) - 2; $i++)
        {
            if ($i % 4 == 1)
            {
                array_push($this->_rulers, $newarray[$i]);
            }
        }
/*
        echo "<pre>";
        print_r($newarray);
        print_r($this->_rulers);
        echo "</pre>";
*/
    }

    function Extract($num_to_show, $start_with)
    {
        if (count($this->_rulers) < $start_with) return;
        if (count($this->_rulers) < $num_to_show) $num_to_show = count($this->_rulers) - $start_with;

        $myarraynames = array_slice($this->_rulers, $startwith, $num_to_show);
        $tempstr = implode("\n", $myarraynames);
        return $tempstr;
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

}
?>