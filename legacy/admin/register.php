<?
include_once("../common/basepath.inc.php");
include("../auth/session.php");

// temporarily removed for debug
if (!$session->isRep())
{
     unset($_SESSION['regsuccess']);
     unset($_SESSION['reguname']);
   header("Location: showclients.php");
}
else{

if(isset($_SESSION['regsuccess']))
{

   /* Registration was successful */
   if($_SESSION['regsuccess']){
         header("Location: index.php");
   }
   /* Registration failed */
   else{
        include("../template/header.php");
      echo "<h3>Registration Failed</h3>";
      echo "We're sorry, but an error has occurred and your registration for the username <b>".$_SESSION['reguname']."</b>, "
          ."could not be completed.<br>Please try again at a later time.<br />";
      echo "<a href=\"showclients.php\">Go Back</a>";
   }
     unset($_SESSION['regsuccess']);
     unset($_SESSION['reguname']);
}
else
{
    include("../template/adminheader.php");

    function listGroups()
    {
        global $database, $_POST;
        $res = $database->query("SELECT name, accounts_current, accounts_max FROM ".TBL_GROUPS." WHERE name != 'admin'");
        $count = mysql_numrows($res);

        $msg = "<select class=\"dropdown\" name=\"group\">\n";
        for($i=0; $i < $count; $i++)
        {
            $name = mysql_result($res,$i,"name");
            $cur =  mysql_result($res,$i,"accounts_current");
            $max =  mysql_result($res,$i,"accounts_max");

            $msg .= "<option";

            if ( (isset($_POST['group'])) && ($_POST['group'] == $name) )
                $msg .= " selected";

            $msg .= ">".$name."</option>\n";
        }
        $msg .= "</select>\n";

        return $msg;
    }
?>
<div id="infocontentsub">
<h2>New User</h2>
<span>Create a new user for your user-group.  Group admins please keep track of your members and ensure that they follow our terms of service.</span>
<hr />
    <p>
<?
    if($form->num_errors > 0){
         echo $form->num_errors." error(s) found.";
    }
?>
    <br />
    <form action="adminprocess.php" method="POST">
    <fieldset>
    <legend>Add Client:</legend>
        <table align="left" border="0" cellspacing="0" cellpadding="3">
            <tr><td>Username:</td><td><input type="text" name="user" maxlength="30" value="<? echo $form->value("user"); ?>" /></td><td><? echo $form->error("user"); ?></td></tr>
            <tr><td>Password*:</td><td><input type="password" name="pass" maxlength="30" value="<? echo $form->value("pass"); ?>" /></td><td><? echo $form->error("pass"); ?></td></tr>
            <tr><td>Email:</td><td><input type="text" name="email" maxlength="50" value="<? echo $form->value("email"); ?>" /></td><td><? echo $form->error("email"); ?></td></tr>
            <tr><td>Group:</td><td><? if ($session->isAdmin()) echo listGroups(); else {
                                                                                                                                                            echo $session->getGroup()." (".$database->groupCount($session->getGroup())."/".$database->groupMax($session->getGroup()).")\n";
                                                                                                                                                            echo "<input type=\"hidden\" name=\"group\" value=\"".$session->getGroup()."\" />\n";
                                                                                                                                                        }
                                                                                                                                                            ?></td><td><? echo $form->error("group"); ?></td></tr>
            <tr><td>Userlevel:</td><td><?
                if ($session->isAdmin()) { ?><select class="dropdown" name="level"><option>1</option><option<? if ($_POST['group'] == 2) echo " selected"; ?>>2</option><option<? if ($_POST['group'] == 2) echo "selected"; ?>>9</option></select><?
                } else { ?><input type="hidden" name="level" value="1" />Regular User<? }
                ?></td></tr>
            <tr>
                <td colspan="2" align="right">
                    <input type="hidden" name="subjoin" value="1">
                    <input type="submit" value="Add Client">
                </td>
            </tr>
        </table>
    </fieldset>
    </form>
    </p>
    <p>
        * <strong>WARNING:</strong><i> Do not register a user with the same password that is used on CyberNations.net.</i>
    </p>
    <p>
        <a href="showclients.php">Go Back</a>
    </p>
    </div>
<?
}

include_once("../template/adminfooter.php");

 }
?>