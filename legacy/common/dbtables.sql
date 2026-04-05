#  dbtables.sql
#
#  Table structure for users table
#

DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
  id int(20) NOT NULL AUTO_INCREMENT,
  name varchar(10) not null,
  leader varchar(32) not null,
  accounts_max int(5) not null,
  accounts_current int(5) not null,
  active int(1) not null,
  primary key (id)
);


DROP TABLE IF EXISTS users;

CREATE TABLE users (
 username varchar(30) primary key,
 password varchar(32),
 userid varchar(32),
 userlevel tinyint(1) unsigned not null,
 usergroup varchar(32),
 email varchar(50),
 timestamp int(11) unsigned not null
);

INSERT INTO `users` VALUES ('admin', '391ad922f2f4bd20f3963aef83ec74f9', 'c531aab33142d79645e7cd8b84986b64', 9, 'admin', 'none@donotreply.com', 1174858356);


DROP TABLE IF EXISTS ip_users;

CREATE TABLE ip_users (
 id int(20) NOT NULL AUTO_INCREMENT,
 username varchar(30) NOT NULL,
 ip varchar(15) NOT NULL,
 timestamp int(11) UNSIGNED NOT NULL,
 PRIMARY KEY (id)
)

#
#  Table structure for active users table
#
DROP TABLE IF EXISTS active_users;

CREATE TABLE active_users (
 username varchar(30) primary key,
 timestamp int(11) unsigned not null
);


#
#  Table structure for active guests table
#
DROP TABLE IF EXISTS active_guests;

CREATE TABLE active_guests (
 ip varchar(15) primary key,
 timestamp int(11) unsigned not null
);


#
#  Table structure for banned users table
#
DROP TABLE IF EXISTS banned_users;

CREATE TABLE banned_users (
 username varchar(30) primary key,
 timestamp int(11) unsigned not null
);




# Nation ID Checking
DROP TABLE IF EXISTS nationhash;
CREATE TABLE nationhash (
  nationid int(10) not null,
  ip varchar(32) not null,
  checks int(1) not null,
  lastcheck int(11) unsigned not null
);



DROP TABLE IF EXISTS ip_attempts;

CREATE TABLE ip_attempts(
 ip varchar(15) NOT NULL,
 attempts int(5) NOT NULL,
 last int(11) UNSIGNED NOT NULL,
 PRIMARY KEY (ip)
);


DROP TABLE IF EXISTS data_nations;

CREATE TABLE data_nations (
   id varchar(30) NOT NULL,
   gove varchar(30),
   reli varchar(30),
   tech varchar(30),
   infr varchar(30),
   land varchar(30),
   pland varchar(30),
   nland varchar(30),
   pop varchar(30),
   cit varchar(30),
   income varchar(30),
   ginc varchar(30),
   happy varchar(30),
   ns varchar(30),
   soldier varchar(30),
   tank varchar(30),
   air varchar(30),
   nuke varchar(30),
   spy varchar(30),
   tax varchar(30),
   envir varchar(30),
   cash varchar(30),
   defcon varchar(30),
   timestamp int(11) UNSIGNED NOT NULL,
   PRIMARY KEY (id, timestamp)
);

DROP TABLE IF EXISTS warstats_wars;
CREATE TABLE warstats_wars(
   wid int(10) NOT NULL,
   nation varchar(30) NOT NULL, 
   fighting varchar(30) NOT NULL, 
   started int(11) UNSIGNED NOT NULL, 
   active int(1) UNSIGNED NOT NULL,
   PRIMARY KEY (wid),
   UNIQUE KEY (nation, fighting, started)
);

DROP TABLE IF EXISTS warstats_battles;
CREATE TABLE warstats_battles (
   id  int(10) NOT NULL,
   war int(10) NOT NULL,
   winsoldiers int(10),
   wintanks int(10),
   winland int(10),
   wintech int(10),
   wininfra int(10),
   wincash int(10),
   winfighter int(10),
   winbomber int(10),
   wincruise  int(10),
   losssoldiers int(10),
   losstanks int(10),
   lossland int(10),
   losstech int(10),
   lossinfra int(10),
   losscash int(10),
   lossfighter int(10),
   lossbomber int(10),
   losscruise int(10),
   timestamp int(11) UNSIGNED NOT NULL,
   PRIMARY KEY (id)
);