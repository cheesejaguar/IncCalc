<?
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."common/cnhash.class.php");

function displayGroups() {
   global $database, $session;

   $q = "SELECT name, leader, accounts_max, accounts_current, active FROM ".TBL_GROUPS." WHERE name != 'admin' ORDER BY name ASC, active desc";
   // echo $q;

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
   echo "       <td class=\"tablist\">Group</td><td class=\"tablist\">Leader</td><td class=\"tablist\">Accounts</td><td class=\"tablist\">Enabled</td><td class=\"tablist\">Management</td>\n   </tr>\n </thead>\n";
   for($i=0; $i<$num_rows; $i++){
      $group  = mysql_result($result,$i,"name");
      $leader = mysql_result($result,$i,"leader");
      $slots    = mysql_result($result,$i,"accounts_max");
      $used   = mysql_result($result,$i,"accounts_current");
      $active = mysql_result($result,$i,"active");
            $enabled = ($active==1)?"<div style=\"color:green;\">yes</div>": "<div style=\"color:red;\">no</div>";

            if ($i % 2)
                echo "  <tr class=\"white\">\n";
            else
                echo "  <tr class=\"shade\">\n";

      echo "        <td class=\"tablist\"><a href=\"showclients.php?showme=$group\">$group</a></td>\n";
      echo "        <td class=\"tablist\">$leader</td>\n";
      echo "        <td class=\"tablist\">$used / $slots</td>\n";
      echo "        <td class=\"tablist\">$enabled</td>\n";
      echo "        <td class=\"tablist\">\n";
?>
            <a href="editgroup.php?gid=<?echo $group; ?>">Edit</a>
            <a href="delgroup.php?gid=<?echo $group; ?>">Del</a>
            <a href="grouptoggle.php?gid=<?echo $group; ?>"><?if ($active) echo "Disable"; else echo "Enable"; ?></a>
<?
      echo "        </td>\n";
      echo "    </tr>\n";
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

if(!$session->isAdmin()) {
   header("Location: ../");
}
else{

    include_once($SCRIPT_HOME_DIR."template/adminheader.php");
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
    <span>Alliance/Group Management</span>
    <hr  />
    <p>
        <? displayGroups(); ?>
    </p>
</div>
<?
}
include_once($SCRIPT_HOME_DIR."template/adminfooter.php");
?>

