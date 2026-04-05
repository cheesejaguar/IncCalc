<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html;charset=iso-8859-1" />
<title>Authorization Required</title>

	<link rel="stylesheet" type="text/css" media="screen" href="login.css" />

</head>

<body>
	<div id="mainWrap">

	<div id="wrapper">
		<div id="logo">
			<a title="home" href="index.php">
			<img src="images/main_logo.gif" alt="Logo" width="132" height="137" />
			</a>
		</div>

	<div id="loginform">

		<h2>Login</h2>
		<form name="loginForm" method="post" action="process.php" class="cmxform">
	<fieldset>
		<ol>
			<li>
			<label for="user">Username</label>
			<input name="user" type="text" class="loginF bguser" id="user" tabindex="1" maxlength="32" />
			</li>

			<li>
			<label for="pass">Password</label>
			<input type="password" tabindex="2" id="pass" name="pass" class="loginF bgpass" />
			</li>
			
			<li>
			<label for="remember">Remember me next time </label>
			<input type="checkbox" name="remember" />
			</li>
		</ol>

		<p class="buttonpo">
			<input name="sublogin" value="1" type="hidden">
			<input type="submit" class="button" name="Login" value="Login" tabindex="3"/>
		</p>

		 </fieldset>
	</form>

	<p class="sbutton">Authorization Required to move beyond this point.</p>


	</div>
<?
include($SCRIPT_HOME_DIR."template/footer.php");
?>