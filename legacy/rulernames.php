<?php
//$SCRIPT_HOME_DIR = "/home/bliangco/public_html/projects/inc/";
//$CALC_DEBUG_MODE = 0;
include_once("common/basepath.inc.php");
include_once($SCRIPT_HOME_DIR ."auth/session.php");
include_once($SCRIPT_HOME_DIR ."common/parsenations.class.php");
    if(!$session->logged_in)
        header("Location: index.php");

    include($SCRIPT_HOME_DIR ."template/header2.php");
?>
    <br style="clear: both;">
        <div id="infocontentsub">
            <h2>Search Display Parser</h2>
            <span>Need to get a whole bunch of ruler names to message but don't have the time to fill them in one by one?  Our ruler extraction scheme will generate a linebreak-delimited string which you'll be able to paste into the CC field without fail.</span>

            <hr  /><br style="clear: both;" />
            <p>
                Search for your desired nations (or browse newly created ones, I suppose) in Cybernations.  Copy the results into the below text box and we'll provide a list of their ruler names.  Please do just one page at a time.
                <?
                if (!isset($_GET["count"])) { $showcount = 30; } else { $showcount = $_GET["count"]; }
                if (!isset($_GET["indx"])) { $indx = 0; } else { $indx = $_GET["indx"]; }
                if (isset($_POST["search_data"]))
                {
                   $extractnames = new ParseSearch($_POST["search_data"]);
                   echo "Ruler names have been extracted from search text.<br style='clear:both;' />";
                ?>
                    <textarea name="cp" cols=50 rows=4><? echo $extractnames->extract($showcount, $indx); ?></textarea><br style="clear:both;" />
             </p>
             <p>
                <?
                }
                ?>
                <form action="<?php echo $_SERVER{'SCRIPT_NAME'}?>?count=<? echo $showcount; ?>&indx=<? echo $indx; ?>" method="post">
                <textarea name="search_data" cols=50 rows=4></textarea><br />
                <input type="submit" value="submit" name="submit">
                </form>
            </p>
            <p>
                As with the the nation data preloader, this does not work well with Internet Explorer.
            </p>
        </div>
    <br style="clear:both;" />

<? include($SCRIPT_HOME_DIR."template/footer.php");
?>