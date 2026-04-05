<?php

    switch($_GET['show'])
    {
        case "economy":
            include($SCRIPT_HOME_DIR ."template/header2.php");
            include_once($SCRIPT_HOME_DIR."calc.inc.php");
            break;
        case "military":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."military/mobilize.class.php");
            include_once($SCRIPT_HOME_DIR."military.inc.php");
            break;
        case "spies":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."military/spies.inc.php");
            break;
        case "resource":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."resource/resource.inc.php");
            break;
        case "wonder":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."resource/wonder.inc.php");
            break;
        case "events":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."resource/event.inc.php");
            break;
        case "improvement":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."improvement.inc.php");
            break;
        case "stats":
            include($SCRIPT_HOME_DIR."template/header2.php");
            include_once($SCRIPT_HOME_DIR."growth.inc.php");
            break;
        case "loader":
            header("Location: loader.php");
            break;
        case "verifyuser":
            header("Location: checkid.php");
            break;
        case "rulers":
            header("Location: rulernames.php");
            break;
        default:
            include($SCRIPT_HOME_DIR ."template/header2.php");

    /*
        <div id="infocontentsub">
            <h2>Site Maintenance!</h2>
            <span>If you see this message, we're currently working on the calculator.  Please ignore any error messages -- we are trying to make all transitions as seamless as possible.  Please mention this to your alliance mates if they have trouble logging in.</span>
            <hr  />
        </div>
    */
    ?>
        <div id="infocontentsub">
            <h2>Welcome, <?echo $session->username; ?>!</h2>
            <span>What can Inc. help you with today?  Our products are constantly under development, so if you have any suggestions or absolutely *must* have that one new feature, please contact one of our representatives.</span>
            <hr  />
            <div id="featuresAll">
            <p class="texterSub"><span><strong>Economy</strong></span></p>
            <ul>
                <li class="nav listtwo"><a href="?show=stats">General Growth Guide</a></li>
                <li class="nav listone"><a href="?show=economy&eval=infra">Infrastructure Management</a></li>
                <li class="nav listtwo"><a href="?show=economy&eval=population">Population Management</a></li>
                <li class="nav listone"><a href="?show=resource">Resource Management</a></li>
                <li class="nav listtwo"><a href="?show=improvement">Improvement Purchases</a></li>
                <li class="nav listone"><a href="?show=wonder">Wonder Purchases</a></li>
                <li class="nav listtwo"><a href="?show=events">Event Management</a></li>
                <li class="nav listone"><a href="tech.php">Technology Pricing</a></li>
                <li class="nav listtwo"><a href="?show=loader">Preload my Nation Stats</a></li>
            </ul>
            </div>

          <div id="featuresTech">
            <p class="texterSub"><span><strong>Alliance</strong></span></p>
            <ul>
                <li class="nav listtwo"><a href="?show=verifyuser">Member Verification</a></li>
                <li class="nav listone"><a href="?show=rulers">Ruler Name Extraction</a></li>
            </ul>
            <br />
            <p class="texterSub"><span><strong>Military</strong></span></p>
            <ul>
                <li class="nav listtwo"><a href="?show=military">Mobilization Calculator</a></li>
                <li class="nav listone"><a href="?show=spies">Clandestine Ops</a></li>
                <li class="nav listtwo">Under Development</li>
            </ul>
            <br style="clear:both;" />

            </div>
            <br style="clear:both;" />

            <p>
                This text has been mostly unchanged since our first release of the calculator.  That doens't mean that we haven't implemented any changes -- just that we're too busy to write sentences about how great our product is.  We've finally put in the general growth guide (21 Oct 2007) and are working on other similar statistic-tracking applications.  As always, any data stored by Inc. is safeguarded with the utmost care and only exists in randomized-key encrypted form in our database.  Thanks for your continued support!
            </p>
            <p style="text-align:right"><i>-ThInc.</i></p>

        </div>
        <br style="clear:both;" />

        <br style="clear:both;" />
<?
    }
?>