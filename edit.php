<?php
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//$CALC_DEBUG_MODE = 0;
include_once("common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");

if(!$session->logged_in)
    header("Location: index.php");

include($SCRIPT_HOME_DIR ."template/header2.php");

?>
<?
/**
 * User has submitted form without errors and user's
 * account has been edited successfully.
 */
if(isset($_SESSION['useredit'])){
   unset($_SESSION['useredit']);
?>
        <div id="infocontent">
            <h2>Profile Edit Successful</h2>
            <span>Your login information has been updated.</span>

            <hr  />
        <p>
            Take me back to the <a style="color:#000000; font-weight:bold;" href="/index.php">main page</a>.
        </p>
        </div>
<?
}
else{
?>
        <div id="infocontent">
            <h2>User Settings</h2>
            <span>Change your stored user password and email (current password required).</span>

            <hr  />
        <p>
            <?
            if($form->num_errors > 0){
               echo "<font size=\"2\" color=\"#ff0000\">".$form->num_errors." error(s) found</font></p><p>";
            }
?>
        <form action="process.php" method="POST">
        <table align="left" border="0" cellspacing="0" cellpadding="3">
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
        <tr>
           <td>Email:</td>
           <td><input type="text" name="email" maxlength="50" value="<?
        if($form->value("email") == "") {
           echo $session->userinfo['email'];
        }else{
           echo $form->value("email");
        } ?>"></td>
            <td><? echo $form->error("email"); ?></td>
        </tr>
        <tr><td></td><td style="text-align:right;">
            <input type="hidden" name="subedit" value="1">
            <input type="submit" value="Edit Account"></td></tr>
        </table>
        </form>

        </p>
        </div>

<?
}
?>
    <br style="clear:both;" />
<? include($SCRIPT_HOME_DIR."template/footer.php"); ?>
