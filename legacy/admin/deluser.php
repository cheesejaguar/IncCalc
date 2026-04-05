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
<span>User Deletion Verification</span>

<hr  />
<p>
        Are you sure you wish to delete <strong><?echo $user; ?></strong>?<br />
        * Deleted users can not be restored, and must be readded manually by either an Inc. representative or an alliance group admin.<br /><br />
        <table style="width:100%; align:right;">
        <tr><td class="tablist"></td>
                <td class="tablist" style="width:40px;"><form action="adminprocess.php" method="POST">
                    <input type="hidden" name="deluser" maxlength="30" value="<? echo $user; ?>">
                    <input type="hidden" name="subdeluser" value="1">
                    <input type="submit" value="Delete">
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

