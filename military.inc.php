<?php

	$eval = (isset($_GET['eval'])) ? $_GET['eval']: "infra";
	
	if (isset($_POST['submit'])) { 
		$mob = new calcMobilize();
		
		$a = $_POST["res"];
		$gcamp = $_POST["gcamp"];
		$varr = $_POST["barr"];

		$citizens = str_replace(",", "", $_POST["citizens"]);
		$soldiers = str_replace(",", "", $_POST["soldiers"]);
		$tanks = str_replace(",", "", $_POST["tanks"]);
				
		$mob->setCitizens($citizens);
		$mob->setSoldiers($soldiers);
		$mob->setTanks($tanks);
		$mob->setImprovements($gcamp, $barr);
		$mob->updateImprovements();
		$mob->updateModifier($a);
		
		$ns = 0.1*(0.8*$citizens - $soldiers) + $mob->buyTanks();
		if ($ns == 0) $ns = 1;
		
		$cost = $mob->costSoldiers() + $mob->costTanks();
		$costd = $cost / $ns;
	?>
		<div id="infocontentsub">
			<h2>Ready for War!</h2>
			<span>Below you'll find the requested details on requirements for maximum mobilization of ground combat units.</span>
			<hr  />
			<p>You will need to purchase <strong><? echo number_format($mob->buySoldiers(), 0); ?> soldiers</strong> ($<? echo number_format($mob->costSoldiers(), 2); ?>) and <strong><? echo number_format($mob->buyTanks(),0); ?> tanks</strong> ($<? echo number_format($mob->costTanks(), 2); ?>) to fully mobilize for war.<br />
			Buying these units will inflate your nation strength by <strong><? echo number_format($ns,3); ?></strong> ($<? echo number_format($costd,2); ?>/point).<br />
			<br />
			<i>Note:  Going above this amount of soldiers will result in a large drop in happiness; you may feel safer in a long war, but your economy will be impeded significantly.</i><br />	
			</p>
		</div>
	<?	
	}
	?>
	
	<br />
		<form action="<?php echo $_SERVER{'SCRIPT_NAME'}?>?show=military" method="post">
	<div id="infocontentsub">
			<h2>War Mobilization</h2>
			<span>How many units will you need to gear up for war?  How many tanks should you buy?  These questions have plagued the likes of Genghis Khan and those sweet dudes from 300.  While we can't guarantee victory, we'll tell you how to best slow those millions of incoming bastards!</span>
			<hr  />

		<div id="featuresAll2">
<? if (isset($_POST["res"]))  {
			$a = $_POST["res"]; 
			$USER_STORE = 0; 
	 }
	 else 
	 {
	 		if (isset($_SESSION['nationinfo']))	{ $USER_STORE = 1; 	 		$a = new ParseText($_SESSION['nationinfo']); }
	 		else {
	 			$a = array();
	 			$USER_STORE = 0;
	 		}
	 }
	 		
?>				<fieldset>
					<legend>Nation Info</legend>
					<table colspan="2">
						<tr style="vertical-align: baseline;">
							<td>Population</td><td><input class="input" type="textbox" title="resSelect" name="citizens" id="_a" value="<? if (!$USER_STORE){ echo $_POST["citizens"]; } else { echo $a->getStat("cit"); } ?>" /></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td>Soldiers</td><td><input class="input" type="textbox" title="resSelect" name="soldiers" id="_soldiers" value="<? if (!$USER_STORE) { echo $_POST["soldiers"]; } else { echo $a->getStat("soldier"); } ?>" /></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td>Tanks</td><td><input class="input" type="textbox" title="resSelect" name="tanks" id="_tank" value="<? if (!$USER_STORE) { echo $_POST["tanks"]; } else { echo $a->getStat("tank"); } ?>" /></td>
						</tr>
						<tr>
							<td colspan="4"><input class="inputcb" type="checkbox" title="Government" name="res[]" id="aa" value="government" <? if (!$USER_STORE) { if (in_array("government", $a)) echo "checked "; } else { if (strpos("  Communist, Democracy, Dictatorship, Federal Government Transitional", $a->getStat("gove")) != 0) echo "checked "; } ?>/><label for="aa">Government type is: Communist, Democracy, Dictatorship, Federal, Transitional</label></td>
						</tr>
					</table>
				</fieldset>
		</div>
		<div id="featuresTech">
				<fieldset>
					<legend>Improvements/Wonders</legend>
					<table>
						<tr style="vertical-align: baseline;">
								<td><? if (!$USER_STORE) { ?>
									<select name="gcamp"><option>0</option><option <? if ($_POST["gcamp"] == 1) echo "selected"; ?>>1</option><option <? if ($_POST["gcamp"] == 2) echo "selected"; ?>>2</option><option <? if ($_POST["gcamp"] == 3) echo "selected"; ?>>3</option><option <? if ($_POST["gcamp"] == 4) echo "selected"; ?>>4</option><option <? if ($_POST["gcamp"] == 5) echo "selected"; ?>>5</option></select><? } 
									else { $b = $a->hasImprovement("Guerilla Camps"); ?>
									<select name="gcamp"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option><option <? if ($b == 3) echo "selected"; ?>>3</option><option <? if ($b == 4) echo "selected"; ?>>4</option><option <? if ($b == 5) echo "selected"; ?>>5</option></select><? } ?>
								</td>
								<td style="width:150px;">Guerilla Camps</td>
								<td><? if (!$USER_STORE) { ?>
									<select name="barr"><option>0</option><option <? if ($_POST["barr"] == 1) echo "barr"; ?>>1</option><option <? if ($_POST["barr"] == 2) echo "selected"; ?>>2</option><option <? if ($_POST["barr"] == 3) echo "selected"; ?>>3</option><option <? if ($_POST["barr"] == 4) echo "selected"; ?>>4</option><option <? if ($_POST["barr"] == 5) echo "selected"; ?>>5</option></select> <? }
									else { $b = $a->hasImprovement("Barracks"); ?>
									<select name="barr"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option><option <? if ($b == 3) echo "selected"; ?>>3</option><option <? if ($b == 4) echo "selected"; ?>>4</option><option <? if ($b == 5) echo "selected"; ?>>5</option></select><? } ?>
								</td>
								<td style="width:150px;">Barracks</td>
						</tr>
						<tr style="vertical-align: baseline;">
								<td></td>
								<td colspan=3style="width:150px"><i></i></td>
						</tr>
					</table>
				</fieldset>
		</div>

		<br style="clear:both;" />
<? if ($USER_STORE) {
		$b = implode("+",$a->getResources());
		$c = implode("+",$a->getBonuses());
		$a = explode("+", strtolower($b."+".$c));
	}
 ?>
	  <div id="info">
	  	<div id="featuresAll2">
				<fieldset>
					<legend>Resources</legend>
					<table>
						<tr style="vertical-align: baseline;">
							<td><input class="aluminum" type="checkbox" title="Aluminum" name="res[]" id="a" value="aluminum" <? if (in_array("aluminum", $a)) echo "checked "; ?>/><label for="a">&nbsp;</label></td>
							<td><input class="coal" type="checkbox" title="Coal" name="res[]" id="b" value="coal" <? if (in_array("coal", $a)) echo "checked "; ?>/><label for="b">&nbsp;</label></td>
							<td><input class="iron" type="checkbox" title="Iron" name="res[]" id="c" value="iron" <? if (in_array("iron", $a)) echo "checked "; ?>/><label for="c">&nbsp;</label></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td><input class="lead" type="checkbox" title="Lead" name="res[]" id="d" value="lead" <? if (in_array("lead", $a)) echo "checked "; ?>/><label for="d">&nbsp;</label></td>
							<td><input class="oil" type="checkbox" title="Oil" name="res[]" id="e" value="oil" <? if (in_array("oil", $a)) echo "checked "; ?>/><label for="e">&nbsp;</label></td>
							<td><input class="pigs" type="checkbox" title="Pigs" name="res[]" id="k" value="pigs" <? if (in_array("pigs", $a)) echo "checked "; ?>/><label for="k">&nbsp;</label></td>
						</tr>
					</table>
				</fieldset>
			</div>
		</div>
		<br style="clear:both;" />
		<input type="submit" value="submit" name="submit" />
	</div>
		</form>
