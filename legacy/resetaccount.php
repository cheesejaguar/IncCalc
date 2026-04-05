<?php
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
//$CALC_DEBUG_MODE = 0;
include_once("common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR ."resource/resparse.class.php");
include($SCRIPT_HOME_DIR ."template/header.php");


/**
 * Forgot Password form has been submitted and no errors
 * were found with the form (the username is in the database)
 */
if(isset($_SESSION['forgotpass'])){
   /**
    * New password was generated for user and sent to user's
    * email address.
    */
   if($_SESSION['forgotpass']){
      echo "<h1>New Password Generated</h1>";
      echo "<p>Your new password has been generated "
          ."and sent to the email <br>associated with your account.  Please expect it to show up in your mailbox in the next few minutes.  Until then, sit back and hope that you don't get quaded before update."
          ."</p>";
   }
   /**
    * Email could not be sent, therefore password was not
    * edited in the database.
    */
   else{
      echo "<h1>New Password Failure</h1>";
      echo "<p>There was an error sending you the "
          ."email with the new password,<br> so your password has not been changed. "
          ."</p>";
   }

   unset($_SESSION['forgotpass']);
}
else{

/**
 * Forgot password form is displayed, if error found
 * it is displayed.
 */
?>

    <br style="clear: both;">
        <div id="infocontentsub">
            <h2>Recover Account</h2>
            <span>Send a new password to your email address.</span>

            <hr  /><br style="clear: both;" />
            <p class="texterSub"><span><strong>If you don't remember the email address, you're SOL.  Inc. will not be manually resetting passwords in the future.</strong></span></p>
            <p>
                What have we learned in 8 months of operation?  That users are incompetent.  Yes, we mean you.  However, being that our laziness leads to upset users who <i>"can't remember their passwords,"</i> we've implemented this quick hack so you can get your fancy account back, without ever needing to interrupt any staff member.<br />
                <form action="process.php" method="post">
                Email: <input type="text" name="email" maxlength="30" value="<? echo $form->value("email"); ?>">
                <input type="hidden" name="subforgot" value="1">
                <input type="submit" value="Save me!">
                </form>
            </p>
            <p>
                When you click submit, you'll be transported to a new page with notification on whether or not your user password was successfully reset.  Cheers, and here's to no more interruptions of our time!
            </p>
        </div>
    <br style="clear:both;" />

<?
}

include($SCRIPT_HOME_DIR."template/footer.php");
?>