<?
class Mailer
{
   /**
    * sendWelcome - Sends a welcome message to the newly
    * registered user, also supplying the username and
    * password.
    */
   function sendWelcome($user, $email, $pass){
      $from = "From: ".EMAIL_FROM_NAME." <".EMAIL_FROM_ADDR.">";
      $subject = "Inc. Calc User Information";
      $body = $user.",\n\n"
             ."Welcome! You've been given access by your alliance to our constantly under-development\n"
             ."CyberNations calculator. You may access our service using the following information:\n\n"
             ."Login: ".$user."\n"
             ."Password: ".$pass."\n\n"
             ."You'll be able to edit your email and password once you log in to the service -- but \n"
             ."you'll need to remember the current password, at least, temporarily.  Chances are that\n"
             ."your group administrator filled in an easy-to-remember password.  We recommend that you\n"
             ."choose a password personal to yourself, which uses both letters and numbers, and also\n"
             ."in the case of letters, a healthy mix of capitalized and lowercase variants will help\n"
             ."protect you, and Inc. from problems of hacked or stolen accounts.\n\n"
             ."Do *NOT* use your CN nation's password for our calculator!  While we strive to secure \n"
             ."any data you choose to submit, we'd rather not be blamed for a hacker ruining the game.\n"
             ."If you forget your password, we won't be able to recover it for you.  However, there is \n"
             ."an option for you to get a newly generated password emailed directly to you.\n\n"
             ."If you do have any problems with the website, or if you encounter any random bugs, you\n"
             ."can always stop by our irc channel on irc.esper.net (#inc).\n\n"
             ."\t- Inc. Staff";

      return mail($email,$subject,$body,$from);
   }

   /**
    * sendNewPass - Sends the newly generated password
    * to the user's email address that was specified at
    * sign-up.
    */
   function sendNewPass($user, $email, $pass){
      $from = "From: ".EMAIL_FROM_NAME." <".EMAIL_FROM_ADDR.">";
      $subject = "Inc. Calc User Password (updated)";
      $body = $user.",\n\n"
             ."We've generated a new password for you at your "
             ."request, you can use this new password with your "
             ."username to log in to the Inc. calculator.\n\n"
             ."Username: ".$user."\n"
             ."New Password: ".$pass."\n\n"
             ."It is recommended that you change your password "
             ."to something that is easier to remember, which "
             ."can be done by going to the Account page "
             ."after signing in.\n\n"
             ."\t- Inc. Staff";

      return mail($email,$subject,$body,$from);
   }
};

/* Initialize mailer object */
$mailer = new Mailer;

?>
