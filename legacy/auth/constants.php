<?

/**
 * Server path and web-readable paths -- this has not really been implemented at this time.
 */
define("SCRIPT_HOME_DIR", "/home/bliangco/public_html/projects/inc/");
define("SCRIPT_BASE_URL", "http://bliang.com/projects/inc");

/**
 * Database Constants - these constants are required
 * in order for there to be a successful connection
 * to the MySQL database. Make sure the information is
 * correct.
 */
define("DB_SERVER", "localhost");
define("DB_USER", "username");
define("DB_PASS", "password");
define("DB_NAME", "database_name");

/**
 * Database Table Constants - these constants
 * hold the names of all the database tables used
 * in the script.
 */
define("TBL_USERS", "users");
define("TBL_ACTIVE_USERS",  "active_users");
define("TBL_ACTIVE_GUESTS", "active_guests");
define("TBL_BANNED_USERS",  "banned_users");
define("TBL_USERS_IPS", "ip_users");
define("TBL_GROUPS", "groups");
define("TBL_LOGINIPS", "ip_attempts");
define("TBL_NATION_DATA", "data_nations");
define("TBL_WARS", "warstats_wars");
define("TBL_BATTLES", "warstats_battles");

/**
 * Timezone offset - this constant replaces the
 * server time with your desired readable 24hr
 * time.  Only viewable by admin/group admins.
 */
define("TIMEZONE_OFFSET", +1);
define("TIMEZONE_ABBR"  , "EST");

/**
 * Special Names and Level Constants - the admin
 * page will only be accessible to the user with
 * the admin name and also to those users at the
 * admin user level. Feel free to change the names
 * and level constants as you see fit, you may
 * also add additional level specifications.
 * Levels must be digits between 0-9.
 */
define("ADMIN_NAME", "admin");
define("GUEST_NAME", "Guest");
define("ADMIN_LEVEL", 9);
define("REP_LEVEL",     2);
define("USER_LEVEL",  1);
define("GUEST_LEVEL", 0);

/**
 * This boolean constant controls whether or
 * not the script keeps track of active users
 * and active guests who are visiting the site.
 */
define("TRACK_VISITORS", true);

/**
 * Timeout Constants - these constants refer to
 * the maximum amount of time (in minutes) after
 * their last page fresh that a user and guest
 * are still considered active visitors.
 */
define("USER_TIMEOUT", 5);
define("GUEST_TIMEOUT", 5);

/**
 * Cookie Constants - these are the parameters
 * to the setcookie function call, change them
 * if necessary to fit your website. If you need
 * help, visit www.php.net for more info.
 * <http://www.php.net/manual/en/function.setcookie.php>
 */
define("COOKIE_EXPIRE", 60*60*24*100);  //100 days by default
define("COOKIE_PATH", "/");  //Avaible in whole domain

/**
 * Email Constants - these specify what goes in
 * the from field in the emails that the script
 * sends to users, and whether to send a
 * welcome email to newly registered users.
 */
define("EMAIL_FROM_NAME", "Inc. Staff");
define("EMAIL_FROM_ADDR", "no.reply@inc.masterelite.net");
define("EMAIL_WELCOME", true);

/**
 * This constant forces all users to have
 * lowercase usernames, capital letters are
 * converted automatically.
 */
define("ALL_LOWERCASE", true);

// want to see some debug messages?  Set it to 1.  Only works some of the time due to sloppy code.
define("CALC_DEBUG_MODE", 0);

?>
