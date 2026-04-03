<?
include_once("../common/basepath.inc.php");
include_once("../auth/session.php");

if($session->isRep())
{
    $user = trim($_GET['user']);

    if ((!$session->isAdmin()) && ($database->getUserGroup($user) != $session->getGroup()))
        header("Location: showclients.php");

    if (strtolower($user) == "admin")
        header("Location: showclients.php");

    if(isset($_SESSION['useredit'])){
        unset($_SESSION['useredit']);
        header("Location: showclients.php");
    }

    include_once("../template/adminheader.php");
?>
<div id="infocontentsub">
<h2>User Management</h2>
<span>Update account information:  <strong><? echo $user; ?></strong>.</span>
<?
    if($form->num_errors > 0)
         echo "<p><div style=\"color:ff0000;\">".$form->num_errors." error(s) found</div></p>";
?>
<form action="../process.php" method="POST">
<table align="left" border="0" cellspacing="0" cellpadding="3">
<? if ($session->username == $user) { ?>
    <tr>
        <td>Current Password:</td>
        <td><input type="password" name="curpass" maxlength="30" value="<?echo $form->value("curpass"); ?>"></td>
        <td><? echo $form->error("curpass"); ?></td>
    </tr>
    <tr>
        <td>New Password:</td>
        <td><input type="password" name="newpass" maxlength="30" value="<? echo $form->value("newpass"); ?>"></td>
        <td><? echo $form->error("newpass"); ?></td>
    </tr>
<? } ?>
    <tr>
        <td>User Level</td>
        <td>
            <select name="ulevel">
                <option>1</option>
                <option<? if ($form->value("ulevel") == 2) echo " selected"; ?>>2</option>
                <? if ($session->isAdmin()) { ?><option<? if ($form->value("ulevel") == 9) echo " selected"; ?>>9</option><? } ?>
            </select>
        </td>
        <td><? echo $form->error("ulevel"); ?></td>
    </tr>

    <tr>
        <td>Email:</td>
        <td><input type="text" name="email" maxlength="50" value="<? echo $form->value("email");?>"></td>
        <td><? echo $form->error("email"); ?></td>
    </tr>

    <tr>
        <td colspan="2" align="right">
            <input type="hidden" name="subedit" value="1"/>
            <input type="hidden" name="uname" value="<?echo $user;?>"/>
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