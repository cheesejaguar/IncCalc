<?
//include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."auth/constants.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");

class BadLogin extends Object
{
    var $time;
    var $max;

    function BadLogin()
    {
        $this->time = time();
        $this->max = 8;
        return;
    }// <

    function checkAttempts($ip)
    {
        global $database;
        $ip = substr($ip, 0, strrpos($ip, ".")); // trim out the last so 192.168.0.1 => 192.168.0 .. basic allowance for dynamic ips.
        // echo $ip;
        $q = "SELECT attempts, last FROM ".TBL_LOGINIPS." WHERE ip = '".$ip."';";
        $res = $database->query($q);
        $rowcount = mysql_num_rows($res);

        if (!$res || ($rowcount < 1)) return 0;

        $a = mysql_fetch_array($res);

        $timestamp = $a['last'];
        $attempts = $a['attempts'];

        if ($timestamp + 1*60*60 < $this->time) // off chance that it's already been 24 hours since this asshat's last attempt
        {
            $q = "DELETE * FROM ".TBL_LOGINIPS." WHERE ip=".$ip."; ";
            $database->query($q);
            return 0;
        }

        return $attempts;
    }// <

    function updateAttempts($ip)
    {
        global $database;
        $ip = substr($ip, 0, strrpos($ip, "."));

        $q = "SELECT attempts, last FROM ".TBL_LOGINIPS." WHERE ip='".$ip."';";
        $res = $database->query($q);
        $rowcount = mysql_num_rows($res);

    if(!$res || ($rowcount < 1)){
        // never attempted a login incorrectly
        $q = "INSERT INTO ".TBL_LOGINIPS." VALUES ('".$ip."', '1', '".$this->time."');";
        $database->query($q);
    }// <
    else
    {
            $a = mysql_fetch_array($res);
            $checkcount = $a['attempts'] + 1;
            $timestamp = $a['last'];
        if ($checkcount > $this->max)// <
        {
                if ($timestamp + 1*60*60 > $this->time)// <
                {   // lock out give error code 9
                    return 9;
                }
                else
                {
                    $q = "UPDATE ".TBL_LOGINIPS."
                                     SET attempts=1,
                                             last=".$this->time."
                                 WHERE ip = '".$ip ."';";
                    $database->query($q);
                }// <
        }
        else
        {
                $q = "UPDATE ".TBL_LOGINIPS." SET attempts=".$checkcount.",
                                         last=".$this->time."
                             WHERE ip = '".$ip ."';";
                $database->query($q);
        }//<
    }
    }

}

$badlogin = new BadLogin();
?>
