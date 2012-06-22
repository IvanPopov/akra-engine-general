<!doctype html>
<html>
<head>
    <title>Cube / Akra Engine</title>
    <style type="text/css">
        body {
            padding: 0;
            margin: 0;
        }

        #wrapper {
            margin: 0 auto;
            width: 800px;
        }

        .loader {
            position: relative;
            top: -300px;
            left: 150px;
            width: 500px;
        }

        #progressbar-text {
            text-align: center;
            width: 500px;
            position: relative;
            top: -30px;
            font-family: sans-serif;
            color: white;
            font-size: 18px;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div id='wrapper'>
    <canvas id="canvas" style="border: 1px solid #eee;" width="800" height="600"></canvas>
</div>
<!-- <script type='text/javascript' src="webgl-debug.js"></script> -->
<script type='text/javascript' src="http://127.0.0.1:8000/?q=Include('./');<?php echo ($_GET['analyzer']? "Include('./analyzer/A_Analyzer.js');": ""); ?>Include('./demos/<?php echo $_GET['entry']; ?>');"></script>

</body>
</html>

