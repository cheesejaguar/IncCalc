<?
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."common/cnhash.class.php");

function checkMultIPs($user) {
    global $database;
    $q = "SELECT COUNT(*) FROM ".TBL_USERS_IPS." WHERE username='$user'";
    $result = $database->query($q);
    if (!$result) { }
    else
    {
        $cnt = mysql_result($result, 0);
        if ($cnt > 1)   { return 1; }
    }
    return 0;
}

/**
 * displayUsers - Displays the users database table in
 * a nicely formatted html table.
 */
function displayUsers() {
   global $database, $session;

   $q = "SELECT username,userlevel,usergroup, email,timestamp "
       ."FROM ".TBL_USERS;

   if (!$session->isAdmin())
        $q .= " WHERE usergroup='".$session->getGroup()."'";
   else if (isset($_GET["showme"]))
        $q .= " WHERE usergroup='".$_GET["showme"]."'";

   $q .= " ORDER BY usergroup ASC, userlevel DESC, username";
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
   echo "<fieldset>\n";
   echo "<table>\n";
   echo "   <thead>\n";
   echo "   <tr>\n";
   echo "       <td class=\"tablist\">&nbsp;</td><td class=\"tablist\">Username</td><td class=\"tablist\">Group</td><td class=\"tablist\">Level</td><td class=\"tablist\">Email</td><td class=\"tablist\">Last Active</td><td class=\"tablist\">IP</td><td class=\"tablist\">Management</td>\n  </tr>\n </thead>\n";
   for($i=0; $i<$num_rows; $i++){
      $uname  = mysql_result($result,$i,"username");
      $multi  = checkMultIPs($uname);
      $ulevel = mysql_result($result,$i,"userlevel");
      $multi = ($ulevel == 9) ? 0: $multi;
      $group    = mysql_result($result,$i,"usergroup");
      $email  = mysql_result($result,$i,"email");
      $time   = mysql_result($result,$i,"timestamp");
            $time = date("Ymd H:i", $time + TIMEZONE_OFFSET * 60 * 60)." ".TIMEZONE_ABBR;

            if (($_GET["multiusers"] == 1) && ($multi == 0)) { }
            else
            {
                if ($i % 2)
                    echo "  <tr class=\"white\">\n      <td class=\"tablist alert\">";
                else
                    echo "  <tr class=\"shade\">\n      <td class=\"tablist alert\">";

                if (($multi  == 1) && ($ulevel != 9)) { echo "!"; } else { echo "&nbsp;"; }
                echo "</td>\n";
                echo "      <td class=\"tablist\">$uname</td>\n";
                echo "      <td class=\"tablist\">$group</td>\n";
                echo "      <td class=\"tablist\">$ulevel</td>\n";
                echo "      <td class=\"tablist\">$email</td>\n";
                echo "      <td class=\"tablist\">$time</td>\n";
                echo "      <td class=\"tablist\">";
                if ($ulevel != 9) { echo "<a href=\"showips.php?user=$uname\">List</a>";  }
                echo "&nbsp;</td>\n";
                echo "      <td class=\"tablist\">\n";
?>
                <a href="edituser.php?user=<?echo $uname; ?>">Edit</a>
                <a href="deluser.php?user=<?echo $uname; ?>">Del</a>
                <a href="banuser.php?user=<?echo $uname; ?>">Ban</a>
                <!-- <a href="showclients.php?gencode=<?echo $uname; ?>">ID</a> -->
<?
                echo "      </td>\n";
                echo "  </tr>\n";
      }
   }
   echo "</table></fieldset><br />";
}


/**
 * User not an administrator or not logged in, redirect to main page
 * automatically.
 */
if(!($session->logged_in)) {
    header("Location: ../index.php?show=login");
}

if((!$session->isAdmin()) && (!$session->isRep())) {
   header("Location: ../");
}
else{

    include_once($SCRIPT_HOME_DIR."template/adminheader.php");
    if ($session->isRep()) {
?>
    <div id="infocontentsub">
    <? // BEGIN ADMIN PANEL SCREEN.
         if ($session->isAdmin())
         { ?>
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
    <? } /* END ADMIN PANEL SCREEN. (stop the c/p idiot!) */ ?>

    <h2>Admin Center</h2>
<?  if ($_GET["multiusers"] == 1) { ?>  <span>Showing Multi-Flagged Accounts</span><? } else { ?>   <span>Active Client Listing (show only <a href="?multiusers=1">multi-flagged accounts</a>)</span><? } ?>
    <hr  />
    <p>
        <? displayUsers(); ?>
    </p>
<?
    }
?>
</div>
<?
}
include_once($SCRIPT_HOME_DIR."template/adminfooter.php");
?>

