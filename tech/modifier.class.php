<?
include_once($SCRIPT_HOME_DIR ."common/object.class.php");

/* @popModifier :: 
	private class handles modifier factor in population calculation equation
	
 	usage:  
 		$modifier = 1;

		$aluminum = new infraModifier("resourcename", modifier_amt);
		..
		
		$modifier *= $aluminum->getModifier($_POST["res_name"]);
*/

class techModifier extends Object
{
  var $_name;
	var $_mod;
  
  function techModifier($name,$modamount)
  {
    $this->Object();

    $this->_name 	= $name;
		$this->_mod = $modamount;
  }
	
	function getName() {
		return $this->_name;
	}
		
  function getModifier() {
		return (1-$this->_mod);
		//return $this->_mod;
  }

}
?>