<?
include_once("../common/basepath.inc.php");
include_once("../auth/session.php");

if($session->isAdmin())
{
    $gid = $_GET['gid'];

    if(isset($_SESSION['groupedit'])){
        unset($_SESSION['groupedit']);
        header("Location: showgroups.php");
    }

    include_once("../template/adminheader.php");
?>
<div id="infocontentsub">
<h2>Group Management</h2>
<span>Update Group information:  <strong><? echo $gid; ?></strong>.</span>
<?
    if($form->num_errors > 0)
         echo "<p><div style=\"color:ff0000;\">".$form->num_errors." error(s) found</div></p>";
?>
<form action="adminprocess.php" method="POST">
<table align="left" border="0" cellspacing="0" cellpadding="3">
    <tr>
        <td>Leader:</td>
        <td><input type="text" name="leader" maxlength="50" value="<? echo $form->value("leader");?>"></td>
        <td><? echo $form->error("leader"); ?></td>
    </tr>
    <tr>
        <td>Slots:</td>
        <td><input type="text" name="slots" maxlength="50" value="<? echo $form->value("slots");?>"></td>
        <td><? echo $form->error("slots"); ?></td>
    </tr>
    <tr>
        <td colspan="2" align="right">
            <input type="hidden" name="subeditgroup" value="1"/>
            <input type="hidden" name="gname" value="<?echo $gid;?>"/>
            <input type="submit" value="Edit Account"/>
        </td>
    </tr>
    <tr><td colspan="2" align="left"></td></tr>
</table>
</form>

</div>
<?
    include_once("../template/adminfooter.php");
} else {
   header("Location: ../");
}
?>