<?
/**
 * Inc. Cybernations Calculator
 * version 1 revision 1
 * brad liang
 *
 * My attempt at emulating the MVC object-styling was a .. bad effort.
 * In any case, the meat of what you're looking for are the different
 * function classes (infra, upkeep, etc).  They're accessed in include
 * files (*.inc.php) which are referenced by navigate.inc.php (l 36)
 *
 * Bugs?  Please post to Sourceforge
 */
include_once("common/basepath.inc.php");
$FACTORY_PLACE_HOLDER = "factory"; // dunno if we're using this or not.

include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR ."infra/infra.class.php");
include_once($SCRIPT_HOME_DIR ."population/population.class.php");
include_once($SCRIPT_HOME_DIR ."upkeep/upkeep.class.php");

$show = $_GET['show'];

// User wants to see features
if ($show == "feat")
{
    include($SCRIPT_HOME_DIR ."template/header2.php");
    include_once($SCRIPT_HOME_DIR."features.inc.php");
}
else
{
    /**
     * User has already logged in, so display relavent links, including
     * a link to the admin center if the user is an administrator.
     */
    if($session->logged_in)
    {
        include_once($SCRIPT_HOME_DIR."navigate.inc.php");
    }
    else{
    if ($show == "login")
    {
      include($SCRIPT_HOME_DIR ."template/login.php");
      return;
    }
    else
    {
        include($SCRIPT_HOME_DIR ."template/header.php");
        ?>
        <br />
                <div id="info">
                    <div id="features">
                        <div id="container-2">
                        <?

                        if($form->num_errors > 0){
                             if ($form->error("attempts")) {
                                 echo $form->error("attempts")."&nbsp;"; }
                             else
                             {
                                 echo $form->error("user")."&nbsp;";
                                 echo $form->error("pass")."&nbsp;";
                                 echo $form->error("group")."&nbsp;";
                             }
                        }
                            ?>
                            <p>
                                Cybernations is an online nation simulation game which has a bit of role-playing rolled in for those who
                                want it.  As is typical with these online games, a nation's productivity and growth are dependent on
                                multiple factors, ranging from resource availability to environmental status.
                            </p>
                            <p>
                                This service exists to help qualified nations to determine optimum settings for their individual nations.
                                Whether population or net income is your interest, we can help you get that step above the rest!
                            </p>
                            <p>
                                <font style="color:red; font-weight:bold">Disclaimer:</font> Inc. Services does not collect our clients'
                                CyberNations login information.  As part of our ongoing dedication to security, such practice has been
                                explicitly prohibited in our Terms of Service.  Please remember to use caution when downloading
                                software/accessing any website which asks you for your user credentials.
                            </p>
                            <p>
                                Inc. is a privately held company run from within the realm of Cybernations, and serves as both a consulting firm and a
                                services provider.  Inc. develops and manages products which are in turn marketed to the rest of the Cybernations community.
                                Our service is of the highest quality, and access can be obtained with a nominal fee (Cybernations-related currency only).
                            </p>
                        </div>
                    </div>

                    <div id="login">
                            <form id="loginForm" method="post" action="process.php">
                                <fieldset>
                                <label for="userName">Login:</label><br/>
                                    <input tabindex="1" name="user" id="userName" value="" maxlength="30" class="logininput user" type="text" />
                                    <span style="font-weight: bold;"></span>
                                    <input type="checkbox" id="remember" name="remember" <? if($form->value("remember") != ""){ echo "checked"; } ?> /> <label for="remember">Remember me</label>
                                    <br/>
                                <label for="userPassword">Password:</label><br/>
                                <input tabindex="2" name="pass" id="pass" maxlength="30" class="logininput pass" type="password" />
                                <input src="images/button.gif" name="submit" alt="Login" style="vertical-align: middle;" type="image" />
                                <input name="sublogin" value="1" type="hidden" />
                                <p style="margin: 0px;">&nbsp;</p>
                                </fieldset>
                            </form>
                            <br /><br />
                            <div style="color:black;">Forgot your password?  Now, you can <a href="resetaccount.php" style="color:black;font-weight:bold; font-decoration:hover;">recover it</a>.</div>
                    </div>

                </div>

                <br style="clear: both;">
        <?
        }
    }
}

include($SCRIPT_HOME_DIR."template/footer.php");

?>