<?
include_once("../common/basepath.inc.php");
include_once("../auth/session.php");

/**
 * displayBannedUsers - Displays the banned users
 * database table in a nicely formatted html table.
 */
function displayBannedUsers(){
   global $database;
   $q = "SELECT username,timestamp "
       ."FROM ".TBL_BANNED_USERS." ORDER BY username";
   $result = $database->query($q);
   /* Error occurred, return given name by default */
   $num_rows = mysql_numrows($result);
   if(!$result || ($num_rows < 0)){
      echo "Error displaying info";
      return;
   }
   if($num_rows == 0){
      echo "Database table empty";
      return;
   }
   /* Display table contents */
?>
<fieldset>
<table>
<thead>
    <tr><td class=\"tablist\"><b>Username</b>&nbsp;&nbsp;</td><td class=\"tablist\"><b>Time Banned</b></td><td class=\"tablist\">Action</td></tr>
</thead>
<?
   for($i=0; $i<$num_rows; $i++){
      $uname = mysql_result($result,$i,"username");
      $time  = mysql_result($result,$i,"timestamp");
      $time = date("Ymd H:i", $time + TIMEZONE_OFFSET * 60 * 60)." ".TIMEZONE_ABBR;

            if ($i % 2)
                echo "  <tr class=\"white\">\n";
            else
                echo "  <tr class=\"shade\">\n";

      echo "        <td class=\"tablist\">$uname</td>\n";
      echo "        <td class=\"tablist\">$time</td>\n";
      echo "        <td class=\"tablist\">\n";
?>
    <form action="adminprocess.php" method="POST">
        <input type="hidden" name="delbanuser" value="<? echo $uname; ?>">
        <input type="hidden" name="subdelbanned" value="1">
        <input type="submit" value="Rem">
    </form>
<?
      echo "        </td>\n";
      echo "    </tr>\n";
   }
   echo "</table></fieldset><br />\n";
}

/**
 * User not an administrator or not logged in, redirect to main page
 * automatically.
 */
if(!($session->logged_in)) {
    header("Location: ../index.php?show=login");
}

if((!$session->isAdmin())) {
   header("Location: ../");
}
else{
include_once("../template/adminheader.php");
?>
    <div id="infocontentsub">

    <h2>Site Administration</h2>
    <span>For Level 9 users only -- manage groups, group-admins, etc from here.</span>
    <hr  />
    <p>
    <ul>
        <li><a href="showclients.php">Manage Clients</a> (<a href="showclients.php?multiusers=1">only multis</a>)</li>
        <li><a href="showbans.php">Manage Bans</a></li>
        <li><a href="showgroups.php">Manage Groups</a></li>
        <li><a href="addgroup.php">Add Group</a></li>
    </ul>

    <h2>Admin Center</h2>
    <span>Manage the username blacklist.</span>
    <hr  />
    <p>
        <? displayBannedUsers(); ?>
    </p>
    </div>
<?
}
include_once("../template/adminfooter.php");
?>

