<?php

include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."tech/modifier.class.php");
// $CALC_DEBUG_MODE = 1;

// CN INC.  Basis originally obtained from caseus, 20070318
// Cost = (mod) (kx+20)
// mod = ironmod * lumbermod * uraniummod * asphaltmod * (1-numCamps*0.1) * interstatemod * max((1-2*tech/NS),0.90)
//  :: do not distribute ::
class calcTech extends Object
{
        var $_modArray;
        var $_modValue;
        var $_usedMods;
        var $_wanted;
        var $_basecost;
        var $_tech;
        var $_university;

        // the obligatory constructor class.  initialize important variables and constants.
        function calcTech()
        {
            $this->Object();
            $this->_basecost = 0;
            $this->_university = 0;
            $this->_tech = 0;
            $this->init_modifier();
        }

        function init_modifier()
        {
            $this->_modValue = 1;

            $gold = new techModifier("gold", 0.05);                 // $a[key][val], but wanted to keep
            $chips = new techModifier("microchips", 0.08);          // the design as modular as possible.
            $univ = new techModifier("university", 0.1);
            $guniv = new techModifier("guniversity", 0.1);
            $space = new techModifier("space", 0.03);
            $rlab = new techModifier("research", 0.03);

            $this->_modArray = Array(
                                                            "gold"=>$gold,
                                                            "microchips"=>$chips,
                                                            "univ"=>$univ,
                                                            "greatuniv"=>$guniv,
                                                            "space"=>$space,
                                                            "rlab"=>$rlab); // an array of objects, with keys matching their descriptor labels.

            $this->_usedMods = Array("gold", "microchips", "univ",
                                                            "greatuniv", "space", "rlab"
                                                            ); // KLUDGE:  We'll figure something out eventually.
            $return;
        }

        // Public->Private Storing of variables
        function setImprovements($val)
        {
            $this->_university = $val;
            $this->updateImprovements();
        }

        function setTech($val)
        {
            $this->_tech = $val;
            $this->updateBase();
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

        function getBase()
        {
            global $CALC_DEBUG_MODE;
            if ($CALC_DEBUG_MODE == 1) { echo "basecost: ".$this->_basecost."<br />"; }
            return $this->_basecost;
        }

        function getK()
        {
            return $this->_kval;
        }

        function getTech()
        {
            return $this->_tech;
        }

        function getWanted()
        {
            return $this->_wanted;
        }

        function getCost()
        {
      $a = ($this->getModifier() * ($this->getBase()));
      return $a;
        }

        function getCostFor($levels)
        {
            // we assume person will buy in blocks of 10 for efficiency's sake.
            $stepsize = 10;
            $steps = intval($levels / $stepsize);
            $a = 0;

            // loop through buying sets of 10 infra, with updated pricing at each step
            for ($i = 0; $i < $steps; $i++)
            {
                $temp = $this->getTech();
                $a = $a + ($stepsize * $this->getCost());
                $this->setTech($temp + $stepsize); // update k value
      }

      // calculate cost of purchasing the final x<10 units of infrastructure
      $remaining = $levels - ($steps * 10);

      // add everything together
      $a = $a + ($remaining * $this->getCost());
      $a *= 1.5;

            return $a;
        }

        // Public->Private update of infra-cost variables
        function updateBase()
        {
            // this is a bit of a KLUDGE as well, though efficiency does not matter here.
            // collect the modifier constant corresponding to current infrastructure values.
            $current = $this->_tech;

            if ($current < 5)
                    $kval = 10000;
            else if ($current < 8)
                    $kval = 12000;
            else if ($current < 10)
                    $kval = 13000;
            else if ($current < 15)
                    $kval = 14000;
            else if ($current < 30)
                    $kval = 16000;
            else if ($current < 50)
                    $kval = 18000;
            else if ($current < 75)
                    $kval = 20000;
            else if ($current < 100)
                    $kval = 22000;
            else if ($current < 150)
                    $kval = 24000;
            else if ($current < 200)
                    $kval = 26000;
            else if ($current < 250)
                    $kval = 30000;
            else
                    $kval = 40000;


            $this->_basecost = 100*$current + $kval; // store in object;
            return;
        }

        /* KLUDGE:  Improvements contribute in a different way than resources, bonuses, governments,
        //  and wonders.  What nonsense!  Because the admin douched it up here, updateFactories()
        //  is a messy workaround.
        */
        function updateImprovements()
        {
            global $CALC_DEBUG_MODE;
            // (1-numCamps*0.1)
            $uMod =  1-(.1) * $this->_university;

            if ($CALC_DEBUG_MODE == 1) {
                echo $this->_modValue . "---universities--"; // debug stuff
                echo $uMod."--<br />";
                echo $this->_modValue * $uMod."|<br />";
            }

            $this->_modValue = $this->_modValue * $uMod;

            return;
        }

        function updateModifier($arrayWanted)
        {   // assumes that factories have already been factored in.

            global $CALC_DEBUG_MODE;

            if (!is_array($arrayWanted)) return $this->_modValue;

            foreach ($arrayWanted as $modElement) {
                // echo $modElement."..".in_array($modElement, $this->_usedMods)."<br />";
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