<?
include_once("../common/basepath.inc.php");
include_once("../auth/session.php");

if ($session->isAdmin())
    header("Location: showgroups.php");
else if ($session->isRep())
  header("Location: showclients.php");
else if ($session->logged_in)
  header("Location: ../");
else
    header("Location: ../index.php?show=login");

?>

