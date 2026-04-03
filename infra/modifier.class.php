<?
include_once($SCRIPT_HOME_DIR ."common/object.class.php");

/* @infraModifier :: 
	private class handles modifier factor in infra calculation equation
	
 	usage:  
 		$modifier = 1;

		$aluminum = new infraModifier("aluminum", 0.07);
		..
		
		$modifier *= $aluminum->getModifier($_POST["aluminum"]);
*/

class infraModifier extends Object
{
  var $_name;
	var $_mod;
  
  function infraModifier($name,$modamount)
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
  }

}
?>