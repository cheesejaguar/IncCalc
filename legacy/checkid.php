<?
// $SCRIPT_HOME_DIR = "/home/bliangco/public_html/projects/inc/";
include_once("common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR ."infra/infra.class.php");
include_once($SCRIPT_HOME_DIR ."population/population.class.php");
include_once($SCRIPT_HOME_DIR ."common/cnhash.class.php");

    function listGroups()
    {
        global $database, $_POST, $session;
        $res = $database->query("SELECT name FROM ".TBL_GROUPS." WHERE name != 'admin' ORDER BY name ASC");
        $count = mysql_numrows($res);

        $msg = "<select class=\"dropdown\" name=\"aId\">\n";
        for($i=0; $i < $count; $i++)
        {
            $name = mysql_result($res,$i,"name");
            $msg .= "<option";
            if (isset($_POST['aId']))
            {
                if ($_POST['aId'] == $name)
                    $msg .= " selected";
            }
            else if ($session->getGroup() == $name)
                $msg .= " selected";

            $msg .= ">".$name."</option>\n";
        }
        $msg .= "</select>\n";

        return $msg;
    }

    if($session->logged_in)
    {
        include($SCRIPT_HOME_DIR ."template/header2.php");
    }
    else
    {
        include($SCRIPT_HOME_DIR ."template/header.php");
    }
?>
<?

    if(isset($_POST['checkme']))
    {
        $a = new cnHash();
        $myip = $_SERVER['REMOTE_ADDR'];
        $nationid = $_POST['nId'];
        $alliance = $_POST['aId'];
        $check = trim($_POST['code']);

        $form->setValue("nId", $nationid);
        $form->setValue("aId", $alliance);
        $form->setValue("code", $check);

        if (!is_numeric($nationid)) $nationid = $a->parseURL($nationid);
        if ($alliance == "") { $form->setError('aId', "You must fill out the alliance affiliation"); $stopp = 1; }
        if (strlen($check) != 6) { $form->setError('code', "Nation codes are of length 6"); $stopp = 1; }

        if (!($stopp == 1)) {
            $b = $a->checkHash($nationid, $alliance, $check, $myip);
            if ($b == 1) // success
                $checkres = "<strong>Membership Verified!</strong>  The nation in question is a confirmed member of <strong>".$alliance."</strong>.";
            else if ($b == 9)
                $checkres = "Error!  You've checked this nation too many times today.  Please try again in 24 hours.";
            else
                $checkres = "<strong>Impostor!</strong>  The nation in question is <strong>NOT</strong> a member of <strong>".$alliance."</strong>.";
?>
                <div id="infocontentsub">
                            <h2>Check complete...</h2>
                            <span>The nation ID you've submitted has been checked for valid membership.</span>

                            <hr  />
        <br style="clear: both;" />
            <? echo $checkres; ?>

                </div>
<?
        }
    }

    if (isset($_POST['gencode']))
    {
            if(!$session->isRep())
            {
                $msg = "You do not have access to generate nation codes.  Fuck off and die.";
            }
            else
            {

                $nationid = $_POST['nId1'];
                $alliance = $_POST['aId1'];
                $c = new cnHash();

                if (!is_numeric($nationid)) $nationid = $c->parseURL($nationid);
                $form->setValue("nId1", $nationid);

                $msg = "The nation code for Nation ID#".$nationid." is <u>".$c->createHash($nationid, $alliance)."</u>";
?>

<p>
    <h3><? echo $msg; ?></h3>
</p>
<?
            }
    }
?>
        <br style="clear: both;">
                <div id="infocontentsub">
                            <h2>Nation Membership Review</h2>
                            <span>Check a nation's hash ID by typing in the nation's id or simply copy/pasting the nation's url.</span>

                            <hr  /><br style="clear: both;" />
<p>
    <form action="checkid.php" method="POST">
    <fieldset>
        <table align="left" border="0" cellspacing="0" cellpadding="3">
            <tr><td>Nation ID:</td><td><input style="width:120px;" type="text" name="nId" maxlength="100" value="<? echo $form->value("nId"); ?>"></td><td><? echo $form->error("nId"); ?></td></tr>
            <tr><td>Alliance:</td><td>
                        <? echo listGroups(); ?>
                    </td>
                    <td><? echo $form->error("aId"); ?></td></tr>
            <tr><td>Posted Code:</td><td><input style="width:120px;" type="text" name="code" maxlength="30" value="<? echo $form->value("code"); ?>"></td><td><? echo $form->error("code"); ?></td></tr>
            <tr>
                <td colspan="2" align="right">
                    <input type="hidden" name="checkme" value="1">
                    <input type="submit" value="Check">
                </td>
            </tr>
        </table>
    </fieldset>
    </form>
</p>
<br style="clear:both;" />

<?
    if ($session->isRep())
    {
?>
                            <h2>Generate new member code</h2>
                            <span>Keep tabs on who's a real member of your alliance and who isn't.  Generate a new nation id code for one of your alliance mates!</span>

                            <hr  /><br style="clear: both;" />
<p>
    <form action="checkid.php" method="POST">
    <fieldset>
        <table align="left" border="0" cellspacing="0" cellpadding="3">
            <tr><td>Nation ID:</td><td><input style="width:120px;" type="text" name="nId1" maxlength="100" value="<? echo $form->value("nId1"); ?>"></td><td><? echo $form->error("nId1"); ?></td></tr>
            <tr>
                <td colspan="2" align="right">
                    <input type="hidden" name="gencode" value="1" />
                    <input type="hidden" name="aId1" value="<?echo $session->getGroup();?>" />
                    <input type="submit" value="Generate Code" />
                </td>
            </tr>
        </table>
    </fieldset>
    </form>
</p>
<?
    }
        ?>
                </div>
                <br style="clear: both;">
        <?

include($SCRIPT_HOME_DIR."template/footer.php");

?>
