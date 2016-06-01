<?php
require dirname(__DIR__) . "/vendor/autoload.php";
?>
<html>
<head>
  <meta charset="utf-8">
  <title>ActionKit Tests</title>
  <link href="assets/mocha.css" rel="stylesheet"/>

  <style type="text/css">
  .hidden { visibility: hidden; }
  </style>
</head>
<body>
  <div id="mocha"></div>
  <script type="text/javascript" src="assets/jquery.min.js"></script>
  <!--  <script src="https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"></script> -->
  <script type="text/javascript" src="assets/expect.js-0.3.1/index.js"></script>
  <script type="text/javascript" src="assets/mocha.js"></script>

  <script type="text/javascript" src="../action.js"> </script>
  <script>mocha.setup('bdd')</script>
  <script src="test.formutils.js"></script>
  <script src="test.basic.js"></script>
  <script src="test.server.js"></script>
  <script src="test.plugin.js"></script>
  <script>
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
  </script>

  <form id="formWithoutSignature" class="hidden"> </form>

  <form id="formSimple" class="hidden">
    <input type="hidden" name="__action" value="TestApp::Action::Simple"/>
    <input type="text" name="title" value="Programming JavaScript Applications: Robust Web Architecture with Node, HTML5, and Modern JS Libraries"/>
    <input type="text" name="isbn13" value="978-1491950296"/>
    <input type="text" name="isbn" value="1491950293"/>
  </form>
</body>
</html>
