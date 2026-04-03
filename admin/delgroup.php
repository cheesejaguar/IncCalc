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

if(!$session->isAdmin())
   header("Location: ../");
else
{
    include_once("../template/adminheader.php");
?>
<div id="infocontentsub">
<h2>Admin Center</h2>
<span>Group Deletion Verification</span>

<hr  />
<p>
        Are you sure you wish to delete <strong><? $gid = $_GET["gid"]; echo $gid; ?></strong>?<br />
        *Deleted groups will not be restored.  All users in these groups will be purged.  If you want to only suspend access, consider "disabling" their group account.<br /><br />
        <table style="width:100%; align:right;">
        <tr><td class="tablist"></td>
                <td class="tablist" style="width:40px;"><form action="adminprocess.php" method="POST">
                    <input type="hidden" name="gid" maxlength="30" value="<? echo $gid; ?>">
                    <input type="hidden" name="subdelgroup" value="1">
                    <input type="submit" value="Delete">
                    </form></td>
                <td class="tablist" style="width:40px;"><form action="showgroups.php" method="GET">
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

