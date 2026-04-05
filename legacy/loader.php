<?php
//$SCRIPT_HOME_DIR = "/home/bliangco/public_html/projects/inc/";
//$CALC_DEBUG_MODE = 0;
include_once("common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR ."resource/resparse.class.php");

    if(!$session->logged_in)
        header("Location: index.php");

function html2txt($document){
    $search = array('@<script[^>]*?>.*?</script>@si',  // Strip out javascript
                                    '@<[\\/\\!]*?[^<>]*?>@si',            // Strip out HTML tags
                                    '@<style[^>]*?>.*?</style>@siU',    // Strip style tags properly
                                    '@<![\\s\\S]*?--[ \\t\\n\\r]*>@'          // Strip multi-line comments including CDATA
    );
    $text = preg_replace($search, '', $document);
    //$text = stripslashes($text);
    return $text;
}

function instr ($needle, $haystack)
{
  $needlechars = strlen($needle); //gets the number of characters in our needle
  $i = 0;
  for($i=0; $i < strlen($haystack); $i++) //creates a loop for the number of characters in our haystack
  {
    if(substr($haystack, $i, $needlechars) == $needle) //checks to see if the needle is in this segment of the haystack
    {
      return TRUE; //if it is return true
    }
  }
  return FALSE; //if not, return false
}


if (isset($_POST['cp']))
{
    // $a = new ParseText( $_POST['cp'] );
    $a = html2txt( $_POST['cp'] );
    // echo $a;
    if (instr(":. Nation Information", $a))
    {
        include($SCRIPT_HOME_DIR ."template/header2.php");
?>
    <br style="clear: both;">
        <div id="infocontent">
            <h2>Error!</h2>
            <span>Please copy/paste the "Standard Display" version of your "View My Nation" page, and not the "Extended Display" page.  If that's not the problem, are you using Internet Explorer?  We exclusively support FireFox, but there is a <a style="color:#000000; font-weight;" href="iebad.htm">workaround (click)</a> for IE users.  Doing so will limit the accuracy of your results.</span>
            <hr  />
        </div>
<?
    }
    else
    {
        $errorcheck = new ResParseText($a);

        $arrayme = $errorcheck->_stats;

        $errorme = false;
        foreach ($arrayme as $key => $val)
        {
            // DEBUG:  echo $key."=>".$val."\n";

            if ( instr("
", $val) ||
                     (trim($val) == "")
                 )
            {
                $errorme = true;
                break;
            }
        }

        if ($errorme) {
        include($SCRIPT_HOME_DIR ."template/header2.php");
?>
    <br style="clear: both;">
        <div id="infocontent">
            <h2>Error!</h2>
            <span>Please copy/paste the "Standard Display" version of your "View My Nation" page, and not the "Extended Display" page.  If that's not the problem, are you using Internet Explorer?  We exclusively support FireFox, but there is a <a style="color:#000000; font-weight: bold;" href="iebad.htm">workaround (click)</a> for IE users.  Doing so will limit the accuracy of your results.</span>
            <hr  />
        </div>
<?
     // print_r($errorcheck);
        }
        else
        {
            $session->setNationInfo($a);
             // print_r($a);
            if ($errorcheck->checkDb())
            {
                /*echo "<pre>";
                print_r($errorcheck);
                echo "</pre>";*/
                $errorcheck->addDb();
            }
             /*if ($session->isAdmin()) {
                 $errorcheck->printTableSQL();
             }*/
            header("Location: index.php");
        }
    }
}
else
{
    include($SCRIPT_HOME_DIR ."template/header2.php");
}
?>
    <br style="clear: both;">
        <div id="infocontentsub">
            <h2>Nation Information Parser</h2>
            <span>The lazy man's solution to filling out all those text fields.  Yes, we here at Inc. hate them too -- not because we're lazy, but because we value efficiency and our (lazy) customers.  At your "view my nation" screen, copy the entire page (Ctrl-A followed by Ctrl-C), then paste the contents into the text field below.  Click submit, and we'll have most of your information stored for the session!  You'll only need to fill this form out once each time you login (or if you update you nation).</span>

            <hr  /><br style="clear: both;" />
            <p>
                <form action="<?php echo $_SERVER{'SCRIPT_NAME'}?>" method="post">
                <textarea name="cp" cols=50 rows=4></textarea><br />
                <input type="submit" value="submit" name="submit">
                </form>
            </p>
            <p>
                Please be sure to have copied the *entire* contents of your nation screen into the input box above.  Failure to do so will result in malformed data which will provide you with incorrect data.  Additionally, this functionality only works with your personal "view my nation" screen, as only your screen will show you tech points, etc.
            </p>
        </div>
    <br style="clear:both;" />

<? include($SCRIPT_HOME_DIR."template/footer.php");
?>