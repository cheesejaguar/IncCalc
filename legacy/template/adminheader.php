<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<title>Inc. Calculator</title>
	<!-- Meta Tags -->
	<meta http-equiv="content-type" content="text/html; charset=iso-8859-1">
	<meta http-equiv="Content-Language" content="de">
	<meta name="description" content="Cybernations Calculator">
	<meta name="keywords" content="Inc., Calculator, Cybernations">
	<meta name="robots" content="all">
	<!-- CSS -->
	<link rel="stylesheet" type="text/css" media="screen" href="../v2.css">
</head>

<body>
	<div id="top"></div>

	<div id="contentbg">

	<div id="mainWrapper">

		<div id="logo">
			<h1><a title="CN Inc." href="">CN Inc.</a></h1>
	  </div>

		<div id="intro">
			<p><h2>CN Inc. Calculator Majiggy.</h2></p>
			<p>Administration page.  Placeholder text. </p>
			<div id="navi">
				<ul>
					<? if (!$session->isAdmin()) { ?><li><a title="Clients" href="showclients.php">Clients</a></li><? }
						 else { ?><li><a title="Clients" href="showgroups.php">Groups</a></li><? } ?>
					<li><a title="Register" href="register.php">Add User</a></li>
					<li><a title="Info" href="profile.php">My Profile</a></li>
					<li><a title="Home" href="../">Back</a></li>
					<li><a title="Logout" href="../process.php">Logout</a></li>
				</ul>
			</div>
		</div>

		<br style="clear: both;">