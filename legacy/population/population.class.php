<?php

include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."population/modifier.class.php");

// CN INC.  Basis originally obtained from caseus, 20070324
//	:: do not distribute ::
class calcPopulation extends Object
{
		var $_modArray;
		var $_modValue;
		var $_usedMods;
		var $_clinics;
		var $_walls;
		var $_hospitals;
		var $_land;
		var $_wanted;
		var $_level;
		var $_kval;
		var $_citizens;
		
		// the obligatory constructor class.  initialize important variables and constants.
		function calcPopulation()
		{
			$this->Object();
			$this->_kval = 0;
			$this->_land = 0;
			$this->_citizens = 0;
			$this->init_modifier();
		}
		
		function init_modifier() 
		{
			$this->_modValue = 1;
			// Modifier = (Cattle * Fish * Pigs * Wheat * Sugar * Clinics^# * Hospital * BorderWalls)
			$cattle = new popModifier("Cattle", 0.05);	
			$fish = new popModifier("Fish", 0.08);			
			$pigs = new popModifier("Pigs", 0.035);			
			$sugar = new popModifier("Sugar", 0.03);
			$wheat = new popModifier("Wheat", 0.08);		
			$clinic = new popModifier("Clinic", 0.02);
			$hospital = new popModifier("Hospital", 0.06);
			$walls = new popModifier("BorderWalls", -0.02);
			
			$this->_modArray = Array("cattle"=>$cattle, 
															"fish"=>$fish, 
															"pigs"=>$pigs, 
															"sugar"=>$sugar, 
															"wheat"=>$wheat, 
															"clinic"=>$clinic, 
															"hospital"=>$hospital, 
															"walls"=>$walls);

			$this->_usedMods = Array("cattle", "fish", "pigs", "sugar",
															"wheat", "clinic", "hospital", "walls");
			$return;
		}

		// Public->Private Storing of variables
		function setImprovements($clin, $wall, $hosp)
		{
			if ($clin) $this->_clinics = $clin;
				else $this->_clinics = 0;
				
			if ($wall) $this->_walls = $wall;
				else $this->_walls = 0;
				
			if ($hosp) $this->_hospitals = $hosp;
				else $this->_hospitals = 0;
				
			$this->updateImprovements();
		}
		
		function setInfra($val)
		{
			$this->_level = $val;
		}
		
		function setCitizens($val)
		{
			$this->_citizens = $val;
		}
		
		function setLand($val)
		{
			$this->_land = $val;
		}
		
		function setWanted($val)
		{
			$this->_wanted = $val;
		}

		// Private->(Private||Public) Retrieval of variables		
		function getModifier()
		{
			return $this->_modValue;
		}
		
		function getK()
		{
			return $this->_kval;
		}
		
		function getInfra()
		{
			return $this->_level;
		}
		
		function getLand()
		{
			return $this->_land;
		}
		
		function getWanted()
		{
			return $this->_wanted;
		}
		
		function getCitizens()
		{
			$a = $this->getModifier() * (7.5) * $this->getWanted();
			return $a;
		}
		
		function getCitizensT() // get total number of citizens after purchase.
		{
			if ($this->_citizens == 0)
				$a = $this->getModifier() * ((7.5)*$this->getInfra() + (0.28)*$this->getLand() + 20 );
			else
				$a = $this->_citizens;
				
			return $a + $this->getCitizens();
		}
		
		function getInfraGain($amt)
		{
			if ($amt > 0)
				$a = $amt / $this->getModifier() / 7.5;
			else
				$a = 0;
			return $a;
		}
		

		/* KLUDGE:  Improvements contribute in a different way than resources, bonuses, governments, 
		//	and wonders.  What nonsense!  Because the admin douched it up here, updateFactories() 
		//  is a messy workaround (instead of .92^(# of factories)) it is (1-(#factories)*0.08).  
		*/
		function updateImprovements()
		{
			global $CALC_DEBUG_MODE;
			
			$clinicMod = pow($this->_modArray["clinic"]->getModifier(),$this->_clinics); 
			$wallMod = pow($this->_modArray["walls"]->getModifier(),$this->_walls);
			$hospMod = pow($this->_modArray["hospital"]->getModifier(),$this->_hospitals);
			if ($CALC_DEBUG_MODE == 1) {	
				echo $this->_modValue . "---clinics--"; // debug stuff			
				echo $clinicMod."--<br />"; 
				echo $this->_modValue * $clinicMod . "---walls--";
				echo $wallMod."--<br />";
				echo $this->_modValue * $clinicMod * $wallMod . "---hospitals--";
				echo $hospMod."--<br />";
				echo $this->_modValue * $clinicMod * $wallMod * $hospMod ."<br />";
			}
				
			$this->_modValue = $this->_modValue * $clinicMod * $wallMod * $hospMod;
			
			return;
		}

		// Most infra-reduction resources/etc stack as a modifier multiplied by the k constant.
		// this modifier is simply (res1)*(res2)*...*(government modifier)*(nation wonder modifiers)
		function updateModifier($arrayWanted)
		{	// assumes that factories have already been factored in.
			global $CALC_DEBUG_MODE;
			
			if (!is_array($arrayWanted)) return $this->_modValue;
			
			foreach ($arrayWanted as $modElement) {
				
				if (in_array($modElement, $this->_usedMods)) {
					if ($CALC_DEBUG_MODE == 1) {
						echo $this->_modValue . "---"; // debug stuff
						echo $modElement . "--";
						echo $this->_modArray[$modElement]->getModifier()."--<br />";
					}

					$this->_modValue = $this->_modValue * $this->_modArray[$modElement]->getModifier();
				}
			}

			return $this->_modValue;
		}
}

?>