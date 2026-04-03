<?
include_once("../common/basepath.inc.php");
include_once("../auth/session.php");

/**
 * User not an administrator or not logged in, redirect to main page
 * automatically.
 */
if(!($session->logged_in)) {
    header("Location: ../index.php?show=login");
}

if(!$session->isRep())
   header("Location: ../");
else
{
    include_once("../template/adminheader.php");

    function checkGroupIPs() {
        global $database, $session;
        $m = 0;
        $q = "SELECT username FROM ".TBL_USERS." WHERE usergroup='".$session->getGroup()."' AND userlevel < 9;"; // ;";
        $res = $database->query($q);
        // echo $q;
        if (!$res) { return; }
        for($i=0; $i < mysql_numrows($res); $i++)
        {
            $user =  mysql_result($res,$i,"username");

            $q = "SELECT COUNT(*) FROM ".TBL_USERS_IPS." WHERE username='$user'";
            $result = $database->query($q);
            if (!$result) { return $m; }

            $cnt = mysql_result($result, 0);
            if ($cnt > 1)   { $m++; }
        }

        return $m;
    }
?>

<div id="infocontentsub">
<h2>Admin Center</h2>
<span>Group/User Statistics</span>
<hr  />
<p>
        <h3>Personal Information</h3>
        <strong>Username:</strong> <? echo $session->username; ?><br />
        <strong>Group</strong>:     <? echo $session->getGroup(); ?><br />
        <strong>Status</strong>:        <? if ($session->isAdmin())
                                        echo "Site Administrator";
                                 else
                                        echo "Group Adminsrator";
                            ?><br />
</p>
<p>
        <h3>Group Information</h3>
        <strong>Users Added</strong>: <? echo $database->groupCount($session->getGroup()); ?> / <? echo $database->groupMax($session->getGroup()); ?><br />
        <strong>Multi-marked Members</strong>: <?

        $tmp = checkGroupIPs();
        echo $tmp."<br />";
        if ($tmp > 0) echo "<i>Clients of this service are only allowed 1 IP per account.  Our staff members periodically check to make sure our clients adhere strictly to our rules.  If your group is found in violation of these terms, penalties will be charged of an amount TBD.</i>";
            ?><br />
</p>
</div>
<?
}

include_once("../template/adminfooter.php");
?>

