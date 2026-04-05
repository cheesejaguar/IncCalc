<?php
include_once("basepath.inc.php");
include_once($SCRIPT_HOME_DIR."common/object.class.php");

$appendKey = "bClAiSnEgUs"; // CHANGE THIS!

// Encryptor class.  Simple Encrypt/Decrypt class should handle all
// nation-specific data going to the database.  We wouldn't want
// Inc. to have such prying eyes, huh?  It's unfortunate that I
// already know how to decrypt it.  TODO:  Find an encryption expert
// and have him go through this sloppy code and fix what I've done.


class Encryptor extends Object
{
    var $_key;

    function Encryptor() {
        global $appendKey;
        // on load, set key to be current time plus our "hidden" key
        //  -- total length should be 21.
        $this->_key = time().$appendKey;
        return;
    }

    // public accessor functions -- just one variable which is used as the encryption key.
    function SetKey($key)
    {
        global $appendKey;
        $this->_key = str_replace(' ', '', $key).$appendKey;
    }

    function GetKey()
    {
        global $appendKey;
        return substr($this->_key, 0, strlen($this->_key) - strlen($appendKey));
    }

    function Crypt($text)
    {
        global $appendKey;
        // Exploratory implementation using bitwise ops on strings;

        // no need to restrict key or pad it -- we're expecting a UNIX TIMESTAMP plus our appended key
        $text_len = strlen($text);

        // fill key with the bitwise AND of the ith key character and 0x1F, padded to length of text.
        $lomask = str_repeat("\x1f", $text_len); // Probably better than str_pad
        $himask = str_repeat("\xe0", $text_len);
        $k = str_pad("", $text_len, $this->_key); // this one _does_ need to be str_pad

        // {en|de}cryption algorithm
        $crypted =  mysql_escape_string(  (($text ^ $k) & $lomask) | ($text & $himask)  );
        //debug: echo $crypted."<br/>";
        return $crypted;
    }
}

// global instance.
$crypto = new Encryptor();

?>