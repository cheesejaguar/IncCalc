<?php

include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."upkeep/modifier.class.php");

// CN INC.  Basis originally obtained from caseus, 20070318
// Cost = (mod) (kx+d)
// mod = ironmod * lumbermod * uraniummod * asphaltmod * (1-numCamps*0.1) * interstatemod * max((1-2*tech/NS),0.90)
//  :: do not distribute ::
class calcUpkeep extends Object
{
        var $_modArray;
        var $_modValue;
        var $_usedMods;
        var $_laborcamps;
        var $_wanted;
        var $_level;
        var $_kval;
        var $_tech;
        var $_ns;

        // the obligatory constructor class.  initialize important variables and constants.
        function calcUpkeep()
        {
            $this->Object();
            $this->_kval = 0;
            $this->_laborcamps = 0;
            $this->_ns = 1;
            $this->init_modifier();
        }

        function init_modifier()
        {
            $this->_modValue = 1;

            $iron = new infraModifier("iron", 0.1);                 // $a[key][val], but wanted to keep
            $lumber = new infraModifier("lumber", 0.08);            // the design as modular as possible.
            $uranium = new infraModifier("uranium", 0.03);
            $asphalt = new infraModifier("asphalt", 0.05);
            $istate = new infraModifier("interstate", 0.08);
            $labor = new infraModifier("labor", 0.1);

            $this->_modArray = Array(
                                                            "iron"=>$iron,
                                                            "lumber"=>$lumber,
                                                            "uranium"=>$uranium,
                                                            "asphalt"=>$asphalt,
                                                            "labor"=>$labor,
                                                            "interstate"=>$istate); // an array of objects, with keys matching their descriptor labels.

            $this->_usedMods = Array("iron", "lumber", "uranium",
                                                            "asphalt", "labor", "interstate"
                                                            ); // KLUDGE:  We'll figure something out eventually.
            $return;
        }

        // Public->Private Storing of variables
        function setImprovements($val)
        {
            $this->_laborcamps = $val;
            $this->updateImprovements();
        }

        function setTech($val)
        {
            $this->_tech = $val;
        }

        function setNS($val)
        {
            if (!$val) return;
            $this->_ns = $val;
        }

        function setInfra($val)
        {
            $this->_level = $val;
            $this->updateK();
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

        function getWanted()
        {
            return $this->_wanted;
        }

        function getCost()
        {
      $a = ($this->getModifier() * ($this->getK() * $this->getInfra() + 20));
      return $a;
        }

        function getCostEnd()
        {
            return $this->getCost() + $this->getCostD();
        }

        function getCostD()
        {
            // $this->setInfra($this->getInfra());
            $current = $this->getInfra();
            $a = ($this->getModifier() * ($this->getK() * $current + 20));
            // echo $a."|";
            $this->setInfra($current+ $this->getWanted());
            $b = ($this->getModifier() * ($this->getK() * $this->getInfra() + 20));
            // echo $b."|";

            $this->setInfra($current);
            return ($b - $a);
        }

        // Public->Private update of infra-cost variables
        function updateK()
        {
            // this is a bit of a KLUDGE as well, though efficiency does not matter here.
            // collect the modifier constant corresponding to current infrastructure values.
            $current = $this->_level;
            if ($current < 30)
                    $kval = 0;
            else if ($current < 40)
                    $kval = .01;
            else if ($current < 60)
                    $kval = .02;
            else if ($current < 80)
                    $kval = .03;
            else if ($current < 140)
                    $kval = .04;
            else if ($current < 200)
                    $kval = .05;
            else if ($current < 300)
                    $kval = .06;
            else if ($current < 500)
                    $kval = .07;
            else if ($current < 700)
                    $kval = .08;
            else if ($current < 1000)
                    $kval = .09;
            else if ($current < 2000)
                    $kval = .11;
            else if ($current < 3000)
                    $kval = .13;
            else if ($current < 4000)
                    $kval = .15;
            else if ($current < 5000)
                    $kval = .17;
            else if ($current < 8000)
                    $kval = .1725;
            else
                    $kval = .175;


            $this->_kval = $kval; // store in object;
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
            $laborMod =  1-(1-$this->_modArray["labor"]->getModifier()) * $this->_laborcamps;

            if ($CALC_DEBUG_MODE == 1) {
                echo $this->_modValue . "---laborcamps--"; // debug stuff
                echo $laborMod."--<br />";
                echo $this->_modValue * $laborMod."|<br />";
            }

            $this->_modValue = $this->_modValue * $laborMod;

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

            if ($CALC_DEBUG_MODE == 1) {
                echo $this->_modValue . "---tech upgrade--"; // debug stuff
                echo max((1-((2*$this->_tech)/($this->_ns))), 0.90)."--".$this->_modValue * max((1-((2*$this->_tech)/($this->_ns))), 0.90)."<br />";
            }
            // tech now helps!
            $this->_modValue = $this->_modValue * max((1-((2*$this->_tech)/($this->_ns))), 0.90);

            return $this->_modValue;
        }
}

?>