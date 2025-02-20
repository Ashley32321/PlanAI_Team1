<?php
// This is where some PHP code might live..
$strConn = "mysql:host=localhost;port=3306;dbname=classtodos";
$strUser='SCC';
$strPWord='SCC';
try {
    $db_conn = new PDO($strConn, $strUser, $strPWord);
    // set the PDO error mode to exception
    $db_conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }
  if (! isset($strSearchTerm)){
    $strSearchTerm = 'Weather in MO';
  }
  if (isset($_GET['SearchTerm'])){
    $strToSearchOnGoogle = $_GET['SearchTerm'];
  } else {
    $strToSearchOnGoogle = 'Weather in MO';
  }

?>
<html>
    <head>
        <title>Ashley's first Web Page</title>
    </head>
    <body>
        <H1>This is a home page in HTML...</h1>
        <p> This can have any of the content that might be described in<br>
        <a href="http://www.w3schools.com" target="_blank">W3 Schools</a> (... a very popular learning environment!)
        <form action=index.php method=get>
          Search Term: <input name='SearchTerm' type='text' size=50 value=<?php echo htmlspecialchars($strSearchTerm);?>>
          <input type="Submit">
      </form>
      <a href="http://www.google.com?q=<?php echo urlencode($strToSearchOnGoogle);?>" target="_blank">
        Google call with search term.
      </a> (... should use the user's input!)

    </body>
</html>