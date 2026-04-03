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
	
	<link rel="stylesheet" type="text/css" media="screen" href="v2.css">
</head>

<body>
	<script type="text/javascript" src="http://projects.masterelite.net/cntrade/infra/resource/script.js.php" />

	<div id="top"></div>

	<div id="contentbg">

	<div id="mainWrapper">

		<div id="logo">
			<h1><a title="CN Inc." href="">CN Inc.</a></h1>
	  </div>

		<div id="intro">
			<p><h2>CN Inc. Calculator Majiggy.</h2></p>
			<? if ($session->logged_in) { ?>
					<p>Welcome, <strong><? echo $session->username; ?></strong>.  You are one of <strong><? echo $database->num_active_users; ?></strong> client(s) actively using this service.  Enjoy!<br />
			<? } else { ?>
					<p>A large amount of effort, manpower, and time was spent creating this product.  Respect it.  Are you interested in seeing what Inc. can do for your alliance?  Navigate to our <a href="http://z6.invisionfree.com/CN_INC/index.php?act=idx">homepage</a>. </p>
			<? } ?>
			<div id="navi">
				<ul>
					<li><a title="Home" href="index.php">Home</a></li>
					<li><a title="Features" href="index.php?show=feat">Features</a></li>
					<li><?
									if($session->logged_in) 
										echo "<a title=\"Logout\" href=\"process.php\">Logout</a>";
									else
										echo "<a title=\"Login\" href=\"index.php?show=login\">Login</a>";
							?></li>
					<li><?	
									if($session->isAdmin())	      
										echo "<a title=\"Admin\" href=\"admin/index.php\">Admin</a>"; 
									else if ($session->isRep())
										echo "<a title=\"Manage\" href=\"admin/index.php\">Group</a>";
									else
										echo "<a title=\"About\" href=\"http://z6.invisionfree.com/CN_INC/index.php?act=idx\">Inc.</a>"; 
							?></li>
					<li><a title="CN" href="http://cybernations.net">Cybernations</a></li>
				</ul>
			</div>
		</div>

		<br style="clear: both;">