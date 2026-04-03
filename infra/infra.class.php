<?php

include_once($SCRIPT_HOME_DIR."common/object.class.php");
include_once($SCRIPT_HOME_DIR."infra/modifier.class.php");

// CN INC.  Basis originally obtained from caseus, 20070318
//  :: do not distribute ::
class calcInfra extends Object
{
        var $_modArray;
        var $_modValue;
        var $_usedMods;
        var $_factories;
        var $_wanted;
        var $_level;
        var $_kval;

        // the obligatory constructor class.  initialize important variables and constants.
        function calcInfra()
        {
            $this->Object();
            $this->_kval = 0;
            $this->init_modifier();
        }

        function init_modifier()
        {
            $this->_modValue = 1;

            $aluminum = new infraModifier("aluminum", 0.07);    // true object-oriented nature lol
            $coal = new infraModifier("coal", 0.04);                    // i started with a matrix array i.e.
            $iron = new infraModifier("iron", 0.05);                    // $a[key][val], but wanted to keep
            $lumber = new infraModifier("lumber", 0.06);            // the design as modular as possible.
            $marble = new infraModifier("marble", 0.10);
            $rubber = new infraModifier("rubber", 0.03);
            $const = new infraModifier("construction", 0.05);
            $steel = new infraModifier("steel", 0.02);
            $gov =  new infraModifier("government", 0.05);
            $istate = new infraModifier("interstate", 0.08);
            $factory = new infraModifier("factory", 0.08);

            $this->_modArray = Array("aluminum"=>$aluminum,
                                                            "coal"=>$coal,
                                                            "iron"=>$iron,
                                                            "lumber"=>$lumber,
                                                            "marble"=>$marble,
                                                            "rubber"=>$rubber,
                                                            "construction"=>$const,
                                                            "steel"=>$steel,
                                                            "government"=>$gov,
                                                            "interstate"=>$istate,
                                                            "factory"=>$factory);   // an array of objects, with keys matching their descriptor labels.

            $this->_usedMods = Array("aluminum", "coal", "iron", "lumber", "marble",
                                                            "rubber", "construction", "steel", "government",
                                                            "interstate", "factory"); // KLUDGE:  We'll figure something out eventually.
            $return;
        }

        // Public->Private Storing of variables
        function setFactories($val)
        {
            $this->_factories = $val;
            $this->updateFactories($val);
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
            // we assume person will buy in blocks of 10 for efficiency's sake.
            $stepsize = 10;
            $steps = intval($this->_wanted / $stepsize);
            $a = 0;
            $aa = $this->getInfra();

            // loop through buying sets of 10 infra, with updated pricing at each step
            for ($i = 0; $i < $steps; $i++)
            {
                $temp = $this->getInfra();
                $a = $a + ($stepsize * ($this->getModifier() * ($this->getK() * $temp + 500)));
                $this->setInfra($temp + $stepsize); // update k value
      }

      // calculate cost of purchasing the final x<10 units of infrastructure
      $remaining = $this->_wanted - ($steps * 10);
      $temp = $this->getInfra();

      // add everything together
      $a = $a + ($remaining * ($this->getModifier() * ($this->getK() * $temp + 500)));

      $this->setInfra($aa);

      // success! +- $0.10
      return $a;
        }

        // output HTML table.  REF: seltable.inc
        function getSelectTable($eval)
        {
            global $SCRIPT_HOME_DIR;
            include($SCRIPT_HOME_DIR."infra/seltable.inc");
        }

        // Public->Private update of infra-cost variables
        function updateK()
        {
            // this is a bit of a KLUDGE as well, though efficiency does not matter here.
            // collect the modifier constant corresponding to current infrastructure values.
            $current = $this->_level;
            if ($current < 20)
                    $kval = 0;
            else if ($current < 30)
                    $kval = 2;
            else if ($current < 40)
                    $kval = 5;
            else if ($current < 50)
                    $kval = 8;
            else if ($current < 60)
                    $kval = 10;
            else if ($current < 150)
                    $kval = 12;
            else if ($current < 300)
                    $kval = 15;
            else if ($current < 1000)
                    $kval = 20;
            else if ($current < 3000)
                    $kval = 25;
            else if ($current < 4000)
                    $kval = 30;
            else if ($current < 5000)
                    $kval = 40;
            else if ($current < 8000)
                    $kval = 60;
            else
                    $kval = 70;


            $this->_kval = $kval; // store in object;
            return;
        }

        /* KLUDGE:  Factories contribute in a different way than resources, bonuses, governments,
        //  and wonders.  What nonsense!  Because the admin douched it up here, updateFactories()
        //  is a messy workaround (instead of .92^(# of factories)) it is (1-(#factories)*0.08).
        */
        function updateFactories($have)
        {
            global $CALC_DEBUG_MODE;

            $temp = (1 - ($have * 0.08));
            if ($CALC_DEBUG_MODE == 1) {
                echo $this->_modValue . "---factories--"; // debug stuff
                echo $temp."--<br />";
            }

            $this->_modValue = $this->_modValue * $temp;

            return;
        }

        // Most infra-reduction resources/etc stack as a modifier multiplied by the k constant.
        // this modifier is simply (res1)*(res2)*...*(government modifier)*(nation wonder modifiers)
        function updateModifier($arrayWanted)
        {   // assumes that factories have already been factored in.

            global $CALC_DEBUG_MODE;

            if (!is_array($arrayWanted)) return $this->_modValue;

            foreach ($arrayWanted as $modElement) {
                $modElement = strtolower($modElement);
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