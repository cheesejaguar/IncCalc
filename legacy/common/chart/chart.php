<?php

//include charts.php to access the InsertChart function
include "charts.php";

echo InsertChart ( "/common/charts.swf", "/common/chart/charts_library", "/common/chart/chartsrc.class.php?stat=".$stat, 400, 230 );

?>