<?

include_once("../common/basepath.inc.php");
include("../auth/session.php");

class AdminProcess
{
   /* Class constructor */
   function AdminProcess(){
      global $session;
      /* Make sure administrator is accessing page */
      if(!$session->isRep()){
         header("Location: ../");
         return;
      }
      /* User submitted registration form */
            if(isset($_POST['subjoin'])){
               $this->procRegister();
      }
      /* Admin submitted update user level form */
      else if(isset($_POST['subupdlevel'])){
         $this->procUpdateLevel();
      }
      /* Admin submitted delete user form */
      else if(isset($_POST['subdeluser'])){
         $this->procDeleteUser();
      }
      /* Admin submitted delete group form */
      else if(isset($_POST['subdelgroup'])){
        if (!$session->isAdmin()) { header ("Location: ../"); return; }
        $this->procDeleteGroup();
      }
      /* Admin submitted edit group form */
      else if(isset($_POST['subeditgroup'])){
        if (!$session->isAdmin()) { header ("Location: ../"); return; }
        $this->procEditGroup();
      }
      /* Admin submitted delete inactive users form */
      else if(isset($_POST['subdelinact'])){
        if (!$session->isAdmin())
        {
            header("Location: ../");
            return;
        }
        $this->procDeleteInactive();
      }
      /* Admin submitted ban user form */
      else if(isset($_POST['subbanuser'])){
         $this->procBanUser();
      }
      /* Admin submitted delete banned user form */
      else if(isset($_POST['subdelbanned'])){
        if (!$session->isAdmin())
        {
            header("Location: ../");
            return;
        }
         $this->procDeleteBannedUser();
      }

      /* admin wants to add a new user group */
      else if(isset($_POST['subaddgroup'])){
         if (!$session->isAdmin()) header("Location:../");
         $this->procGroupRegister();
      }

      /* Should not get here, redirect to home page */
      else{
         header("Location: ../");
      }
   }

   /**
    * procRegister - Processes the user submitted registration form,
    * if errors are found, the user is redirected to correct the
    * information, if not, the user is effectively registered with
    * the system and an email is (optionally) sent to the newly
    * created user.
    */
   function procRegister(){
      global $session, $form;
      /* Convert username to all lowercase (by option) */
      if(ALL_LOWERCASE){
         $_POST['user'] = strtolower($_POST['user']);
      }
      /* Registration attempt */
      $retval = $session->register($_POST['user'], $_POST['pass'], $_POST['email'], $_POST['group'], $_POST['level']);

      /* Registration Successful */
      if($retval == 0){
         $_SESSION['reguname'] = $_POST['user'];
         $_SESSION['regsuccess'] = true;
         header("Location: register.php");
      }
      /* Error found with form */
      else if($retval == 1){
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: register.php");
      }
      /* Registration attempt failed */
      else if($retval == 2){
         $_SESSION['reguname'] = $_POST['user'];
         $_SESSION['regsuccess'] = false;
         header("Location: register.php");
      }
   }

   function procGroupRegister() {
        global $session, $form;

        $retval = $session->gregister($_POST['name'],$_POST['leader'], $_POST['slots'], $_POST['active']);

        if ($retval == 0) {
            $_SESSION['reggroup'] = $_POST['name'];
            $_SESSION['regsuccess'] = true;
            header("Location: addgroup.php");
        }
        else if ($retval == 1) {
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: addgroup.php");
            }
            else if ($retval == 2) {
         $_SESSION['reggroup'] = $_POST['name'];
         $_SESSION['regsuccess'] = false;
         header("Location: addgroup.php");
            }
   }

   /**
    * procUpdateLevel - If the submitted username is correct,
    * their user level is updated according to the admin's
    * request.
    */
   function procUpdateLevel(){
      global $session, $database, $form;
      /* Username error checking */
      $subuser = $this->checkUsername("upduser");

      /* Errors exist, have user correct them */
      if($form->num_errors > 0){
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: ".$session->referrer);
      }
      /* Update user level */
      else{
         $database->updateUserField($subuser, "userlevel", (int)$_POST['updlevel']);
         header("Location: ".$session->referrer);
      }
   }

   /**
    * procDeleteUser - If the submitted username is correct,
    * the user is deleted from the database.
    */
   function procDeleteUser(){
      global $session, $database, $form;
      /* Username error checking */
      $subuser = $this->checkUsername("deluser");

      /* Errors exist, have user correct them */
      if($form->num_errors > 0){
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: ".$session->referrer);
      }
      /* Delete user from database */
      else{
         $temp = $database->groupCount($database->getUserGroup($subuser)) - 1;
         $q = "UPDATE ".TBL_GROUPS." SET accounts_current='$temp' WHERE name='".$database->getUserGroup($subuser)."';";
                 $database->query($q);
         $q = "DELETE FROM ".TBL_USERS." WHERE username = '$subuser'";
         $database->query($q);
                 $q = "DELETE FROM ".TBL_USERS_IPS." WHERE username = '$subuser'";
         $database->query($q);
         header("Location: showclients.php");
      }
   }

   function _groupdeluser($subuser)
   {
        global $database;
      $q = "DELETE FROM ".TBL_USERS." WHERE username = '$subuser'";
      $database->query($q);
            $q = "DELETE FROM ".TBL_USERS_IPS." WHERE username = '$subuser'";
      $database->query($q);
   }

   function procDeleteGroup(){
      global $session, $database, $form, $_POST;
      $gid = $_POST['gid'];

            $q = "SELECT username FROM ".TBL_USERS." WHERE usergroup='$gid';";
            $res = $database->query($q);

            $num_rows = mysql_numrows($res);
        if($num_rows > 0){
             for($i=0; $i<$num_rows; $i++){
                      $user  = mysql_result($res,$i,"username");
                      $this->_groupdeluser($user);
                 }
        }

      $q = "DELETE FROM ".TBL_GROUPS." WHERE name = '$gid'";
      $database->query($q);
            header("Location: showgroups.php");
   }

   function procEditGroup(){
      global $session, $form;
      /* Account edit attempt */
      //$retval = $session->editAccount($_POST['curpass'], $_POST['newpass'], $_POST['email']);

            $retval = $session->editGroup($_POST['gname'], $_POST['leader'], $_POST['slots']);

      /* Account edit successful */
      if($retval){
         $_SESSION['groupedit'] = true;
         header("Location: ".$session->referrer."?gid=".$_POST['gname']);
      }
      /* Error found with form */
      else{
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: ".$session->referrer."?gid=".$_POST['gname']);
      }
   }

   /**
    * procDeleteInactive - All inactive users are deleted from
    * the database, not including administrators. Inactivity
    * is defined by the number of days specified that have
    * gone by that the user has not logged in.
    */
   function procDeleteInactive(){
      global $session, $database;
      $inact_time = $session->time - $_POST['inactdays']*24*60*60;
      $q = "DELETE FROM ".TBL_USERS." WHERE timestamp < $inact_time "
          ."AND userlevel != ".ADMIN_LEVEL;
      $database->query($q);
      header("Location: ".$session->referrer);
   }

   /**
    * procBanUser - If the submitted username is correct,
    * the user is banned from the member system, which entails
    * removing the username from the users table and adding
    * it to the banned users table.
    */
   function procBanUser(){
      global $session, $database, $form;
      /* Username error checking */
      $subuser = $this->checkUsername("banuser");

      /* Errors exist, have user correct them */
      if($form->num_errors > 0){
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: ".$session->referrer);
      }
      /* Ban user from member system */
      else{
         $temp = $database->groupCount($database->getUserGroup($subuser)) - 1;
         $q = "UPDATE ".TBL_GROUPS." SET accounts_current='$temp' WHERE name='".$database->getUserGroup($subuser)."';";
                 $database->query($q);

         $q = "DELETE FROM ".TBL_USERS." WHERE username = '$subuser'";
         $database->query($q);

         $q = "INSERT INTO ".TBL_BANNED_USERS." VALUES ('$subuser', $session->time)";
         $database->query($q);
         header("Location: showclients.php");
      }
   }

   /**
    * procDeleteBannedUser - If the submitted username is correct,
    * the user is deleted from the banned users table, which
    * enables someone to register with that username again.
    */
   function procDeleteBannedUser(){
      global $session, $database, $form;
      /* Username error checking */
      $subuser = $this->checkUsername("delbanuser", true);

      /* Errors exist, have user correct them */
      if($form->num_errors > 0){
         $_SESSION['value_array'] = $_POST;
         $_SESSION['error_array'] = $form->getErrorArray();
         header("Location: ".$session->referrer);
      }
      /* Delete user from database */
      else{
         $q = "DELETE FROM ".TBL_BANNED_USERS." WHERE username = '$subuser'";
         $database->query($q);
                 $q = "DELETE FROM ".TBL_USERS_IPS." WHERE username = '$subuser'";
                 $database->query($q);
         header("Location: ".$session->referrer);
      }
   }

   /**
    * checkUsername - Helper function for the above processing,
    * it makes sure the submitted username is valid, if not,
    * it adds the appropritate error to the form.
    */
   function checkUsername($uname, $ban=false){
      global $database, $form;
      /* Username error checking */
      $subuser = $_POST[$uname];
      $field = $uname;  //Use field name for username
      if(!$subuser || strlen($subuser = trim($subuser)) == 0){
         $form->setError($field, "* Username not entered<br>");
      }
      else{
         /* Make sure username is in database */
         $subuser = stripslashes($subuser);
         if(strlen($subuser) < 3 || strlen($subuser) > 30 ||
            !eregi("^([0-9a-z])+$", $subuser) ||
            (!$ban && !$database->usernameTaken($subuser))){
            $form->setError($field, "* Username does not exist<br>");
         }
      }
      return $subuser;
   }
};

/* Initialize process */
$adminprocess = new AdminProcess;

?>
