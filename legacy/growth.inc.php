<?php
include_once($SCRIPT_HOME_DIR ."common/chart/charts.php");
include_once($SCRIPT_HOME_DIR ."resource/resparse.class.php");
$a = new ResParseText($_SESSION['nationinfo']);

?>
<div id="infocontentsub">
    <h2>Nation Overview</h2>
    <span>By storing your preloaded nation statistics, Inc.'s latest offering allows you to track your nation growth in a number of exciting ways.</span>
    <hr  />
<?
if (isset($_SESSION['nationinfo']))
{
?>
<p>Every day when you preload your data for the calc, some superficial data on your nation is stored into a secure, encrypted database.  When you view this page, we cull your past inputs (along with current ones) and post them in graphical form so that you might have a good look at how your nation has been developing over the course of 1, 10, 100, or even 1000 days.  *This page is still under development*</p>
<br/>
<h2>Nation Strength</h2><hr />
<?
    $stat = "ns";
    echo InsertChart ( $baseURL."/common/charts.swf", $baseURL."/common/chart/charts_library", $baseURL."/common/chart/chartsrc.class.php?stat=".$stat, 600, 230, fffffe  );
?>
<p>In the grand scheme of things, nation strength does not give a very accurate picture of which nations are built in the best fashion.  A nation may be tech heavy or have too much military -- the important thing is that in your growth chart (this is the case for all of the different charts on this page) is always on a positive slope.  That being said, your ranking within CN is determined solely by this number -- try to make it grow huge! (that's what she said).</p>
<h2>Infrastructure</h2>
<hr />
<?
    $stat = "infr";
    echo InsertChart ( $baseURL."/common/charts.swf", $baseURL."/common/chart/charts_library", $baseURL."/common/chart/chartsrc.class.php?stat=".$stat, 600, 230, fffffe  );
?>
<p>If you know anything about cybernations, know this:  infrastructure is the key to all growth.  Ideal graphs should have a sort of stepped positive graph -- you should always work to increase infrastructure, but take the time to save for big jumps in infra over the 1000, 2000, etc. marks (failure to do so will result in a loss of net income due to increases in upkeep taxes).  You can check to see how much you'll need to save for your next jump using Inc.'s calculator.</p>
<h2>Technology</h2>
<hr />
<?
    $stat = "tech";
    echo InsertChart ( $baseURL."/common/charts.swf", $baseURL."/common/chart/charts_library", $baseURL."/common/chart/chartsrc.class.php?stat=".$stat, 600, 230, fffffe  );
?>
<p>Your technology level at each point in time has been recorded along with your infrastructure level.  A general suggestion has been made that you will be in good shape if you have between 10 and 20% of your infrastructure level in technology points.  If you're currently tech farming (or infrastructure is more than 200k/point) the 10-20% suggestion should be ignored.</p>
<p>Currently, your <strong>technology level is <? $b = 100*$a->getStat("tech")/($a->getStat("infr")); echo number_format($b,2); ?>%</strong> of your infrastructure.
</p>
<h2>Population</h2>
<hr />
<?
    $stat = "cit";
    echo InsertChart ( $baseURL."/common/charts.swf", $baseURL."/common/chart/charts_library", $baseURL."/common/chart/chartsrc.class.php?stat=".$stat, 600, 230, fffffe  );
?>
<p>Your nation's population consists of 1) citizens and 2) soldiers.  Spies do not count towards population (also, soldier efficiency no longer counts towards population).  The minimum amount of soldiers you should have to prevent anarchy is 20% of the number of citizens.  Hopefully your population line can stay above the "recommended" line, but not by too much.  Going above 45% of your citizens in soldiers leads to happiness penalties!.</p>
<p>Currently, your soldier count is <strong><?
$soldiers = $a->getStat("pop") - $a->getStat("cit");
$soldier_eff = $a->getStat("soldier");
$percent = 100*$soldiers / $a->getStat("cit");
$minimum = $a->getStat("cit")*0.2;
echo number_format($soldiers,0);
?></strong> which act equivalent to <?
    echo number_format($soldier_eff,0); ?> soldiers (counting bonuses).  This means that your number of soldiers is <? echo number_format($percent, 2);?>% of your citizen count.  You need a minimum of <strong><?
    echo number_format($minimum, 0); ?></strong> to maintain your happiness and prevent anarchy -- stay above this line!</p>
<?
}
else
{
    echo "Error: you need to <a href=\"?show=loader\">preload your nation data</a> before you will be able to use the general growth statistics feature of this calculator.<br style=\"clear:both;\" />";
}
?>
</div>