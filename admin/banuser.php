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
    if ( (!$session->isAdmin()) && ($session->getGroup() != $database->getUserGroup($user)) )
        header("Location: ../");

    include_once("../template/adminheader.php");
    $user = $_GET['user'];
?>
<div id="infocontentsub">
<h2>Admin Center</h2>
<span>User Ban Verification</span>

<hr  />
<p>
        Are you sure you wish to ban <strong><?echo $user; ?></strong>?<br /><br />
        Banning a user is a stronger action than simply deleting them.  Please make sure that the requested action is absolutely necessary before proceeding.  As with deletions, a user ban will result in data obfuscation and any stored information will be lost.  Furthermore, the user's login will be permanently denied for new registrations, only removable by Inc. administrators.<br />
        <table style="width:100%; align:right;">
        <tr><td class="tablist"></td>
                <td class="tablist" style="width:40px;"><form action="adminprocess.php" method="POST">
                    <input type="hidden" name="banuser" value="<? echo $user; ?>">
                    <input type="hidden" name="subbanuser" value="1">
                    <input type="submit" value="Ban User" />
                    </form></td>
                <td class="tablist" style="width:40px;"><form action="showclients.php" method="GET">
                    <input type="submit" value="Go Back">
                    </form></td>
                <td class="tablist" style="width:60px;"></td>
        </tr>
        </table>


</p>
</div>
<?
}

include_once("../template/adminfooter.php");
?>

