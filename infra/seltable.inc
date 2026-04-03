<? include_once($SCRIPT_HOME_DIR ."auth/session.php"); 
	 include_once($SCRIPT_HOME_DIR ."common/parse.class.php");
?>
	<div id="infocontentsub">
			<h2>Calculator Input</h2>
			<span>Ingenuity defined.  Fill in your nation's information, the numbers you want, and click submit.  Our number-crunching gnomes will take care of the rest.</span>
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
<? switch ($eval) {
		case "population": ?>
						<tr style="vertical-align: baseline;">
							<td>Citizens Needed</td><td><input class="input" type="textbox" title="resSelect" name="citizens_wanted" id="_c" value="<? echo $_POST["citizens_wanted"]; ?>" /></td>
						</tr>
<?  break;
		default: ?>
						<tr style="vertical-align: baseline;">
							<td>Infra Purchase</td><td><input class="input" type="textbox" title="resSelect" name="infra_wanted" id="_b" value="<? echo $_POST["infra_wanted"]; ?>" /></td>
						</tr>
<? } ?>
						<tr style="vertical-align: baseline;">
							<td>Current Infra</td><td><input class="input" type="textbox" title="resSelect" name="infra_have" id="_a" value="<? if (!$USER_STORE){ echo $_POST["infra_have"]; } else { echo $a->getStat("infr"); } ?>" /></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td>Technology</td><td><input class="input" type="textbox" title="resSelect" name="technology" id="_tech" value="<? if (!$USER_STORE) { echo $_POST["technology"]; } else { echo $a->getStat("tech"); } ?>" /></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td>Land</td><td><input class="input" type="textbox" title="resSelect" name="land" id="_land" value="<? if (!$USER_STORE) { echo $_POST["land"]; } else { echo $a->getStat("land"); } ?>" /></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td>Nation Strength</td><td><input class="input" type="textbox" title="resSelect" name="strength" id="_strength" value="<? if (!$USER_STORE) { echo $_POST["strength"]; } else { echo $a->getStat("ns"); } ?>" /></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td>Ind. Income Taxes</td><td><input class="input" type="textbox" title="resSelect" name="income" id="_income" value="<? if (!$USER_STORE) { echo $_POST["income"]; } else { echo $a->getStat("income"); } ?>" /></td>
						</tr>
						<tr>
							<td colspan="4"><input class="inputcb" type="checkbox" title="Government" name="res[]" id="aa" value="government" <? if (!$USER_STORE) { if (in_array("government", $a)) echo "checked "; } else { if (strpos("  Capitalist Dictatorship Federal Government Monarchy Republic Revolutionary Government", $a->getStat("gove")) != 0) echo "checked "; } ?>/><label for="aa">Government type is: Capitalist, Dictatorship, Federal, Monarchy, Republic, or Revolutionary</label></td>
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
									<select name="walls"><option>0</option><option <? if ($_POST["walls"] == 1) echo "selected"; ?>>1</option><option <? if ($_POST["walls"] == 2) echo "selected"; ?>>2</option><option <? if ($_POST["walls"] == 3) echo "selected"; ?>>3</option><option <? if ($_POST["walls"] == 4) echo "selected"; ?>>4</option><option <? if ($_POST["walls"] == 5) echo "selected"; ?>>5</option></select><? } 
									else { $b = $a->hasImprovement("Border Walls"); ?>
									<select name="walls"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option><option <? if ($b == 3) echo "selected"; ?>>3</option><option <? if ($b == 4) echo "selected"; ?>>4</option><option <? if ($b == 5) echo "selected"; ?>>5</option></select><? } ?>
								</td>
								<td style="width:150px;">Border Walls</td>
								<td><? if (!$USER_STORE) { ?>
									<select name="clinic"><option>0</option><option <? if ($_POST["clinic"] == 1) echo "selected"; ?>>1</option><option <? if ($_POST["clinic"] == 2) echo "selected"; ?>>2</option><option <? if ($_POST["clinic"] == 3) echo "selected"; ?>>3</option><option <? if ($_POST["clinic"] == 4) echo "selected"; ?>>4</option><option <? if ($_POST["clinic"] == 5) echo "selected"; ?>>5</option></select> <? }
									else { $b = $a->hasImprovement("Clinics"); ?>
									<select name="clinic"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option><option <? if ($b == 3) echo "selected"; ?>>3</option><option <? if ($b == 4) echo "selected"; ?>>4</option><option <? if ($b == 5) echo "selected"; ?>>5</option></select><? } ?>
								</td>
								<td style="width:150px;">Clinics</td>
						</tr>
						<tr style="vertical-align: baseline;">
								<td><? if (!$USER_STORE) { ?>
									<select name="factory"><option>0</option><option <? if ($_POST["factory"] == 1) echo "selected"; ?>>1</option><option <? if ($_POST["factory"] == 2) echo "selected"; ?>>2</option><option <? if ($_POST["factory"] == 3) echo "selected"; ?>>3</option><option <? if ($_POST["factory"] == 4) echo "selected"; ?>>4</option><option <? if ($_POST["factory"] == 5) echo "selected"; ?>>5</option></select><? }
									else { $b = $a->hasImprovement("Factories"); ?>
									<select name="factory"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option><option <? if ($b == 3) echo "selected"; ?>>3</option><option <? if ($b == 4) echo "selected"; ?>>4</option><option <? if ($b == 5) echo "selected"; ?>>5</option></select><? } ?>
								</td>
								<td style="width:150px">Factories</td>
								<td><? if (!$USER_STORE) { ?>
									<select name="hospital"><option>0</option><option <? if ($_POST["hospital"] == 1) echo "selected"; ?>>1</option></select><? }
									else { $b = $a->hasImprovement("Hospitals"); ?>
									<select name="hospital"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option></select><? } ?>
								</td>
								<td style="width:150px;">Hospitals</td>
						</tr>
						<tr style="vertical-align: baseline;">
								<td><? if (!$USER_STORE) { ?>
									<select name="labor"><option>0</option><option <? if ($_POST["labor"] == 1) echo "selected"; ?>>1</option><option <? if ($_POST["labor"] == 2) echo "selected"; ?>>2</option><option <? if ($_POST["labor"] == 3) echo "selected"; ?>>3</option><option <? if ($_POST["labor"] == 4) echo "selected"; ?>>4</option><option <? if ($_POST["labor"] == 5) echo "selected"; ?>>5</option></select><? }
									else { $b = $a->hasImprovement("Labor Camps"); ?>
									<select name="labor"><option>0</option><option <? if ($b == 1) echo "selected"; ?>>1</option><option <? if ($b == 2) echo "selected"; ?>>2</option><option <? if ($b == 3) echo "selected"; ?>>3</option><option <? if ($b == 4) echo "selected"; ?>>4</option><option <? if ($b == 5) echo "selected"; ?>>5</option></select><? } ?>
								</td>
								<td style="width:150px">Labor Camps</td>
								<td>
									&nbsp;
								</td>
								<td style="width:150px">&nbsp;</td>
						</tr>
						<tr style="vertical-align: baseline;"><? if (!$USER_STORE) { ?>
								<td><input class="inputcb" type="checkbox" title="Interstate" name="res[]" id="n" value="interstate" <? if (in_array("interstate", $a)) echo "checked "; ?>/></td><? }
								else { ?>
								<td><input class="inputcb" type="checkbox" title="Interstate" name="res[]" id="n" value="interstate" <? if ($a->hasWonder("Interstate")) echo "checked "; ?>/></td><? } ?>
								<td><label for="n">Interstate Highway (Wonder)</label></td>
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
							<td><input class="cattle" type="checkbox" title="Cattle" name="res[]" id="i" value="cattle" <? if (in_array("cattle", $a)) echo "checked "; ?>/><label for="i">&nbsp;</label></td>			
							<td><input class="coal" type="checkbox" title="Coal" name="res[]" id="b" value="coal" <? if (in_array("coal", $a)) echo "checked "; ?>/><label for="b">&nbsp;</label></td>
							<td><input class="fish" type="checkbox" title="Fish" name="res[]" id="j" value="fish" <? if (in_array("fish", $a)) echo "checked "; ?>/><label for="j">&nbsp;</label></td>
							<td><input class="iron" type="checkbox" title="Iron" name="res[]" id="c" value="iron" <? if (in_array("iron", $a)) echo "checked "; ?>/><label for="c">&nbsp;</label></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td><input class="lumber" type="checkbox" title="Lumber" name="res[]" id="d" value="lumber" <? if (in_array("lumber", $a)) echo "checked "; ?>/><label for="d">&nbsp;</label></td>
							<td><input class="marble" type="checkbox" title="Marble" name="res[]" id="e" value="marble" <? if (in_array("marble", $a)) echo "checked "; ?>/><label for="e">&nbsp;</label></td>
							<td><input class="pigs" type="checkbox" title="Pigs" name="res[]" id="k" value="pigs" <? if (in_array("pigs", $a)) echo "checked "; ?>/><label for="k">&nbsp;</label></td>
							<td><input class="rubber" type="checkbox" title="Rubber" name="res[]" id="f" value="rubber" <? if (in_array("rubber", $a)) echo "checked "; ?>/><label for="f">&nbsp;</label></td>
							<td><input class="sugar" type="checkbox" title="Sugar" name="res[]" id="l" value="sugar" <? if (in_array("sugar", $a)) echo "checked "; ?>/><label for="l">&nbsp;</label></td>
						</tr>
						<tr style="vertical-align: baseline;">
							<td><input class="uranium" type="checkbox" title="Uranium" name="res[]" id="uran" value="uranium" <? if (in_array("uranium", $a)) echo "checked "; ?>/><label for="uran">&nbsp;</label></td>
							<td><input class="wheat" type="checkbox" title="Wheat" name="res[]" id="m" value="wheat" <? if (in_array("wheat", $a)) echo "checked "; ?>/><label for="m">&nbsp;</label></td>
						</tr>
					</table>
				</fieldset>
			</div>
			<div id="featuresTech">
				<fieldset>
					<legend>Bonuses</legend>
					<table>
						<tr style="vertical-align: baseline;">
							<td><input class="asphalt" type="checkbox" title="Asphalt" name="res[]" id="asphalt" value="asphalt" <? if (in_array("asphalt", $a)) echo "checked "; ?>/><label for="asphalt">&nbsp;</label></td>
							<td><input class="construction" type="checkbox" title="Construction" name="res[]" id="g" value="construction" <? if (in_array("construction", $a)) echo "checked "; ?>/><label for="g">&nbsp;</label></td>
							<td><input class="steel" type="checkbox" title="Steel" name="res[]" id="h" value="steel" <? if (in_array("steel", $a)) echo "checked "; ?>/><label for="h">&nbsp;</label></td>
						</tr>
					</table>
				</fieldset>
			</div>
		</div>
		<br style="clear:both;" />
		<input type="submit" value="submit" name="submit" />
	</div>