<?
include_once("../common/basepath.inc.php");
include("../auth/session.php");

// temporarily removed for debug
if (!$session->isAdmin())
{
     unset($_SESSION['regsuccess']);
     unset($_SESSION['reguname']);
   header("Location: showgroups.php");
}
else{

if(isset($_SESSION['regsuccess']))
{

   /* Registration was successful */
   if($_SESSION['regsuccess']){
         header("Location: showgroups.php");
   }
   /* Registration failed */
   else{
        include("../template/adminheader.php");
      echo "<h3>Group Addition</h3>";
      echo "We're sorry, but an error has occurred and the alliance registration for <b>".$_SESSION['reggroup']."</b> "
          ."could not be completed.<br>Please try again at a later time.<br />";
      echo "<a href=\"showgroups.php\">Go Back</a>";
   }
     unset($_SESSION['regsuccess']);
     unset($_SESSION['reguname']);
}
else
{
    include("../template/adminheader.php");

?>
<div id="infocontentsub">
<h2>New Group</h2>
<span>Add an alliance group.</span>
<hr />

<?
    if($form->num_errors > 0){
         echo $form->num_errors." error(s) found.";
    }
?>
    <br />
    <form action="adminprocess.php" method="POST">
    <fieldset>
    <legend>Group Information:</legend>
        <table align="left" border="0" cellspacing="0" cellpadding="3">
            <tr><td>Alliance:</td><td><input type="text" name="name" maxlength="30" value="<? echo $form->value("name"); ?>" /></td><td><? echo $form->error("name"); ?></td></tr>
            <tr><td>Leader:</td><td><input type="text" name="leader" maxlength="30" value="<? echo $form->value("leader"); ?>" /></td><td><? echo $form->error("leader"); ?></td></tr>
            <tr><td>Slots:</td><td><input type="text" name="slots" maxlength="50" value="<? echo $form->value("slots"); ?>" /></td><td><? echo $form->error("slots"); ?></td></tr>
            <tr><td>&nbsp;</td><td><input type="checkbox" title="Active" name="active" id="active" value="" <? if ($form->value("active")) echo "checked "; ?>/><label for="active">Activate Group</label></td></tr>
            <tr>
                <td colspan="2" align="right">
                    <input type="hidden" name="subaddgroup" value="1">
                    <input type="submit" value="Add Group">
                </td>
            </tr>
        </table>
    </fieldset>
    </form><br />
    <a href="showgroups.php">Go Back</a>
    </div>
<?
}

include_once("../template/adminfooter.php");

 }
?>