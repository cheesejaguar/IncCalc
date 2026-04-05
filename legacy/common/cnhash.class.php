<?php
include_once("basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");

class cnHash extends Object
{
   var $time;
   var $db;

   /* Class constructor */
   function cnHash(){
      $this->time = time();
   }

    function parseURL($string)
    {
        $id = strstr(strtolower($string), "nation_id=");
        $id = substr($id, 10);
        return $id;
    }

    function createHash($nationid, $alliance)
    {
        $alliancekey = md5($alliance);
        $tmp = sha1($alliance.$nationid);
        $tmp = crypt($tmp, "bl");
        $nationkey = ereg_replace("[^A-Za-z0-9]", "",$tmp);
        $nationkey = substr($nationkey, 2, 6);
        $nationkey = strtolower($nationkey);

        return $nationkey;
    }

    function checkHash($nationid, $alliance, $code, $userip)
    {
        $k = $this->updateCheckCount($nationid, $userip);

        if ($k == 9) return 9;

        if ($code == $this->createHash($nationid, $alliance))
            return 1;

        return 0;
    }

    function updateCheckCount($nationid, $ip)
    {
        global $database;
        $q = "SELECT checks, lastcheck FROM nationhash where nationid='".$nationid."' AND ip='".$ip."';";
        $res = $database->query($q);
        $rowcount = mysql_numrows($res);

    if(!$res || ($rowcount < 1)){
      // first time this fucker is checking this ID
      $q = "INSERT INTO nationhash VALUES ('$nationid', '$ip', 1, '$this->time');";
      $database->query($q);
    }
        else
        {
            $a = mysql_fetch_array($res);
            $checkcount = $a['checks'] + 1;
            $timestamp = $a['lastcheck'];

            if ($checkcount > 3)
            {
                if ($timestamp + 24*60*60 > $this->time)
                {   // lock out give error code 9
                    return 9;
                }
                else
                {
                    $q = "UPDATE nationhash set checks = 1, lastcheck = ".$this->time." WHERE ip = '".$ip ."'
                           AND nationid='".$nationid."';";
                    $database->query($q);
                }
            }
            else
            {
            // update the count
            $q = "UPDATE nationhash SET checks = ".$checkcount.",
                                     lastcheck = ".$this->time."
                         WHERE ip = '".$ip ."'
                           AND nationid='".$nationid."';";
            // echo $q."<br />";
            $database->query($q);
            }
        }

        if ($rowcount > 250) {
            // we don't want more than 100 entries.
            $q = "DELETE * FROM nationhash LIMIT 1 ORDER BY lastcheck";
            $database->query($q);
        }

    }

}
?>