<?php

include_once($SCRIPT_HOME_DIR."common/object.class.php");

// CN INC.  Basis originally obtained from caseus, 20070918
//  :: do not distribute ::
class calcSpyOdds extends Object
{
        var $_threatMod;
        var $_land;
        var $_myspies;
        var $_yourspies;
        var $_mytech;
        var $_yourtech;


        // the obligatory constructor class.  initialize important variables and constants.
        function calcSpyOdds()
        {
            $this->Object();
        }

        // Public->Private Storing of variables
        function setLevel($type)
        {
            switch ($type)
            {
                case "Low":
                    $this->_threatMod = 0.75;
                    break;
                case "Guarded":
                    $this->_threatMod = 0.90;
                    break;
                case "Elevated":
                    $this->_threatMod = 1;
                    break;
                case "High":
                    $this->_threatMod = 1.10;
                    break;
                case "Severe":
                    $this->_threatMod = 1.25;
                    break;
            }

            return $this->_threatMod;
        }

        function setSpies($for, $against)
        {
            $this->_myspies = $for;
            $this->_yourspies = $against;
        }

        function setTech($for, $against)
        {
            $this->_mytech = $for;
            $this->_yourtech = $against;
        }

        function setLand($val)
        {
            $this->_land = $val;
        }

        function getMod($who)
        {
            if ($who == 0) // me
            {
                return $this->_myspies + ($this->_mytech / 20);
            }
            else // you
            {
                return ($this->_threatMod) * ($this->_yourspies + (($this->_land + $this->_yourtech) / 20) );
            }
        }

        function getOdds()
        {
            $forodds = $this->_myspies + ($this->_mytech / 20);
            $againstodds = ($this->_yourspies + (($this->_land + $this->_yourtech) / 20)) * $this->_threatMod;
            $a = 100 * $forodds / ($forodds + $againstodds);
            return $a;
        }

        function OddsGraph()
        {
            $forodds = $this->_myspies + ($this->_mytech / 20);
            /*
            $againstoddslow = (0 + (($this->_land + $this->_yourtech) / 20)) * $this->_threatMod;
            $againstoddshigh = (550 + (($this->_land + $this->_yourtech) / 20)) * $this->_threatMod;
            $againstoddsmid = (250 + (($this->_land + $this->_yourtech) / 20)) * $this->_threatMod;
            $a1 = 100 * $forodds / ($forodds + $againstoddslow);
            $a2 = 100 * $forodds / ($forodds + $againstoddshigh);
            $a3 = 100 * $forodds / ($forodds + $againstoddsmid);
            */
            return array($forodds, $this->_land, $this->_yourtech, $this->_threatMod);
            // return array($a1, $a2, $a3);
        }
}

?>