<?
include_once("../common/basepath.inc.php");
include("../auth/session.php");

function displayIPs($user){
   global $database;
   $q = "SELECT ip,timestamp "
            ."FROM ".TBL_USERS_IPS." WHERE username='$user'";
   $result = $database->query($q);
   /* Error occurred, return given name by default */
   if(!$result){
      echo "Error displaying info";
      return;
   }
   $num_rows = mysql_numrows($result);

   if($num_rows == 0){
      echo "Database table empty";
      return;
   }
   else if ($num_rows < 0)
   {
      echo "Error displaying info";
      return;
   }
   /* Display table contents */
   echo "Viewing the IP access history of user \"<strong>".$user."</strong>\"<br />\n";
   echo "<fieldset><table align=\"left\" border=\"1\" cellspacing=\"0\" cellpadding=\"3\">\n";
   echo "<thead><tr><td><b>IP</b></td><td>Hostmask</td><td><b>Last Accessed</b></td></tr></thead>\n";
   for($i=0; $i<$num_rows; $i++){
      $ip  = mysql_result($result,$i,"ip");
      $host = GetHostByAddr($ip);
      $time   = mysql_result($result,$i,"timestamp");
            $time = date("Ymd H:i" , $time +TIMEZONE_OFFSET * 60 * 60)." ".TIMEZONE_ABBR;
            if ($i % 2) echo "  <tr class=\"white\">";
            else                echo "  <tr class=\"shade\">";
      echo "        <td>$ip</td>\n      <td>$host</td>\n        <td>$time</td>\n    </tr>\n";
   }
   echo "</table></fieldset><br />";
}

function checkMultIPs($user) {
    global $database;
    $q = "SELECT COUNT(*) FROM ".TBL_USERS_IPS." WHERE username='$user'";
    $result = $database->query($q);
    $cnt = mysql_result($result, 0);

    if ($cnt > 1)   return 1;

    return 0;
}

if (!$session->isRep())
{
   header("Location: ../");
}
else
{
    $user = $_GET['user'];
    if(trim($user) == '')
        header("Location: index.php");
    else
    {
        if ((!$session->isAdmin()) && ($database->getUserGroup($user) != $session->getGroup())) { header("Location: index.php"); }

        include("../template/adminheader.php");
        ?>
            <div id="infocontentsub">
            <h2>IP Access List</h2>
            <span>The IP address of all clients are logged and checked regularly for clients using this service from multiple locations.</span>
            <hr />
        <?
        if ($op == "purge")
        {
            if (!$session->isAdmin())
            {
                ?>
                <i>Error:  Only Inc. Shareholders have the necessary permissions to clear this list.</i><br /><?
            }
            else
            {
            global $database;
            $q = "DELETE FROM ".TBL_USERS_IPS." WHERE username='".$user."'";
            // echo $q; // debug
        $database->query($q);
            ?>
                IP Access list for <b><? echo $user; ?></b> has been purged.<br /><?
            }
        }
            ?>
            <br />
            <? displayIPs($user);   ?>
            <a href="showips.php?user=<? echo $user; ?>&op=purge">Purge List</a><br /><br />
            <a href="showclients.php">Back to Admin Center.</a><br />
        <?
        echo "       </div>";
    }

include_once("../template/adminfooter.php");

}
?>