<?php

	class Object {

   	var $_objId;
		var $log;

		function Object()
		{
		}

    function __getObjectId()
    {
       	return $this->_objId;
    }

		/**
		 * Returns a string with a representation of the class
         * @return The string representing the object
		 */
		function toString()
		{
			// returns the name of the class
			$ret_str = get_class( $this )." ".$this->_dumpVars();

			return $ret_str;
		}

		function _dumpVars()
		{
			$vars = get_object_vars( $this );

			$keys = array_keys( $vars );

			$res = "[";

			foreach( $keys as $key )
				$res .= " ".$key."=".$vars[$key];

			$res .= " ]";

			return $res;
		}

		/**
		 * Returns the name of the class
         * @return String with the name of the class
		 */
		function className()
		{
			return get_class( $this );
		}

		/**
		 * Returns the name of the parent class
         * @return String containing the name of the parent class
		 */
		function getParentClass()
		{
			$parent_class_name = get_parent_class( $this );

			return $parent_class_name;
		}

		/**
		 * Returns true if the current class is a subclass of the given
		 * class
         * @param $object The object.
         * @return True if the object is a subclass of the given object or false otherwise.
		 */
		function isSubclass( $object )
		{
			return is_subclass_of( $this, $object->className());
		}

		/**
		 * Returns an array containing the methods available in this class
         * @return Array containing all the methods available in the object.
		 */
		function getMethods()
		{
			return get_class_methods( $this );
		}

        /**
         * Returns true if the class is of the given type.
         *
         * @param object Object
         * @return Returns true if they are of the same type or false otherwise.
         */
		function typeOf( $object )
		{
			return is_a( $this, $object->className());
		}
	}
?>