<?php

include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."population/modifier.class.php");

// CN INC.  Basis originally obtained from caseus, 20070324
//	:: do not distribute ::
class calcMobilize extends Object
{
		var $_modArray;
		var $_modValue;
		var $_usedMods;
		var $_barrack;
		var $_gcamp;
		var $_wanted;
		var $_citizens;
		var $_tankcost;
		var $_tankcount;
		var $_soldcost;
		var $_soldcount;
		
		// the obligatory constructor class.  initialize important variables and constants.
		function calcMobilize()
		{
			$this->Object();
			$this->_kval = 0;
			$this->_land = 0;
			$this->init_modifier();
		}
		
		function init_modifier() 
		{
			$this->_modValue = 1;
			// Modifier = (Cattle * Fish * Pigs * Wheat * Sugar * Clinics^# * Hospital * BorderWalls)
			$aluminum = new popModifier("Aluminum", 0.20);	
			$coal 	= new popModifier("Coal", .08);			
			$iron 	= new popModifier("Iron", 0);
			$lead 	= new popModifier("Lead", 0);			
			$oil 		= new popModifier("Oil", .1);		
			$pigs 	= new popModifier("Pigs", 0.15);			
			$gcamp 	= new popModifier("Guerilla", 0.35);
			$barr 	= new popModifier("Barracks", 0.1);
			$gov 		= new popModifier("Government", 0.05);
			
			$this->_modArray = Array("aluminum"=>$aluminum, 
															"coal"=>$coal, 
															"iron"=>$iron, 
															"lead"=>$lead, 
															"oil"=>$oil, 
															"pigs"=>$pigs, 
															"gcamp"=>$gcamp, 
															"barr"=>$barr, 
															"government"=>$gov
															);

			$this->_usedMods = Array("aluminum", "coal", "iron", "lead", 
															"oil", "pigs", "gcamp", "barr", 
															"government");
			$return;
		}

		// Public->Private Storing of variables
		function setImprovements($gcamp, $barr)
		{
			if ($clin) $this->_gcamp = $gcamp;
				else $this->_gcamp = 0;
				
			if ($wall) $this->_barrack = $barr;
				else $this->_barrack = 0;
				
			$this->updateImprovements();
		}

		function setCitizens($val)
		{
			$this->_citizens = $val;
		}

		function getCitizens($val)
		{
			return $this->_citizens;
		}
		
		function setSoldiers($val)
		{
			$this->_soldcount = $val;
		}
		
		function setTanks($val)
		{
			$this->_tankcount = $val;
		}
		
		function buySoldiers()
		{
			$a = ($this->_citizens * 0.8) - $this->_soldcount;
			return $a/$this->getModifier();
		}
		
		function costSoldiers()
		{
			return $this->getSoldierCost() * $this->buySoldiers();
		}
		
		function buyTanks()
		{
			return 0.1*0.8*$this->_citizens - $this->_tankcount;
		}
		
		function costTanks()
		{
			return $this->buyTanks() * $this->getTankCost();
		}
		
		// Private->(Private||Public) Retrieval of variables		
		function getModifier()
		{
			return $this->_modValue;
		}
		
		function getSoldierCost()
		{
			return $this->_soldcost;
		}
		
		function getTankCost()
		{
			return $this->_tankcost;
		}
		
		/* KLUDGE:  Improvements contribute in a different way than resources, bonuses, governments, 
		//	and wonders.  What nonsense!  Because the admin douched it up here, updateFactories() 
		//  is a messy workaround (instead of .92^(# of factories)) it is (1-(#factories)*0.08).  
		*/
		function updateImprovements()
		{
			global $CALC_DEBUG_MODE;
			
			$gcampMod = pow($this->_modArray["gcamp"]->getModifier(),$this->_gcamp); 
			$barrMod = pow($this->_modArray["barr"]->getModifier(),$this->_barrack);

			if ($CALC_DEBUG_MODE == 1) {	
				echo $this->_modValue . "---guerilla camps--"; // debug stuff			
				echo $gcampMod."--<br />"; 
				echo $this->_modValue * $gcampMod . "---barracks--";
				echo $barrMod."--<br />";
				echo $this->_modValue * $gcampMod * $barrMod ."<br />";
			}
				
			$this->_modValue = $this->_modValue * $gcampMod * $barrMod;
			
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
			if ($CALC_DEBUG_MODE == 1) echo $this->_modValue;
			$this->updateSoldierCost($arrayWanted);
			$this->updateTankCost($arrayWanted);
			
			return $this->_modValue;
		}
		
		function updateSoldierCost($arrayWanted)
		{
			$basecost = 8;
			if (in_array("iron", $arrayWanted))	$basecost -= 3;
			if (in_array("oil",	 $arrayWanted))	$basecost -= 3;
			
			$this->_soldcost = $basecost;
			return $basecost;
		}
		
		function updateTankCost($arrayWanted)
		{
			$basecost = 96;
			if (in_array("lead", $arrayWanted)) $basecost *= 0.92;
			$this->_tankcost = $basecost;
			return $basecost;
		}
}

?>