<?php
require dirname(__DIR__) . "/vendor/autoload.php";
?><html>
<head>
  <meta charset="utf-8">
  <title>ActionKit Tests</title>
  <link href="assets/mocha.css" rel="stylesheet"/>
</head>
<body>
  <div id="mocha"></div>
  <script src="assets/jquery.min.js"></script>
  <!--  <script src="https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"></script> -->
  <script src="assets/expect.js"></script>
  <script src="assets/mocha.js"></script>

  <script src="../action.bundle.js"> </script>
  <script>mocha.setup('bdd')</script>
  <script src="test.basic.js"></script>
  <script>
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
  </script>
  <div class="foo"> </div>
</body>
</html>