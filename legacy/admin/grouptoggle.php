<?
//$SCRIPT_HOME_DIR = "/home/master00/public_html/inc/";
include_once("../common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR."auth/session.php");
include_once($SCRIPT_HOME_DIR."common/cnhash.class.php");


function checkActive($gid) {
   global $database;

   $q = "SELECT active FROM ".TBL_GROUPS." WHERE name='$gid';";
   $res = $database->query($q);

     if (!$res || mysql_numrows($res) < 1)
        return 9;

   $a = mysql_fetch_array($res);
   return $a['active'];
}


if (!$session->isAdmin()) {
   header("Location: ../");
}
else{

    if (!isset($_GET['gid']))
        header("Location: showgroups.php");

    $gid = $_GET['gid'];
    if (checkActive($gid) == 1)  {
        $x = 0; }
    else if (checkActive($gid) == 0) {
        $x = 1; }
    else {
        header("Location: showgroups.php"); }

    $q  = "UPDATE ".TBL_GROUPS." SET active=".$x." WHERE name='$gid';";
    //echo $q;
    $database->query($q);
    header("Location: showgroups.php");
}

?>
