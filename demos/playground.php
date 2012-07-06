<!doctype html>
<html>
<head>
    <title>Cube / Akra Engine</title>
</head>
<body>
<!-- <script type='text/javascript' src="webgl-debug.js"></script> -->
<?php 
    $ready = false;
    
    if (isset($_GET['root']) && isset($_GET['entry']) && isset($_GET['home'])) {
        $root = "Define(A_CORE_HOME, '" . $_GET['home'] . "'); Include('" . $_GET['root'] . "');";
        $entry = "Include('" . $_GET['entry'] . "');";    
        $ready = true;
    }
    

    if (isset ($_GET['analyzer'])) {
        $analyzer = "Include('" . $_GET['analyzer'] . "');";
    }

    $query = $root . $analyzer . $entry;
?>
<?php if ($ready) { ?>


<style type="text/css">
    body {
        padding: 0;
        margin: 0;
        background-color: #777;
    }

    #wrapper {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        position: fixed;
    }
    #drop_zone {
        background-color: #CCC;
        border: 2px dashed #bbb;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        padding: 15px;
        text-align: center;
        font: 20pt bold 'corner';
        color: #bbb;
    }
</style>
<div id="drop_zone">Drop model here</div>
<div id='wrapper'>
    <canvas id="canvas"></canvas>
    <script type="text/javascript">
        (function (pCanvas) {
            pCanvas.width = window.innerWidth;
            pCanvas.height = window.innerHeight;
        })(document.getElementById('canvas'));
    </script>
</div>
<script type='text/javascript' src="http://127.0.0.1:8000/?q=<?php echo $query; ?>;"></script>


<?php } else { ?>


<style type="text/css">
body{
    background: #111111;
    color: #61686d;
    font: 14px "Helvetica Neue", Helvetica, Arial, Verdana, sans-serif;
    padding-bottom: 60px;
}

#box {
    background: #ffffff;
    width: 650px;
    height: 400px;
    margin: 0 auto;
    display: block;
    border: none;
    position: relative;
    z-index: 0;
}

p {
    color: #9cadad;
    text-shadow: 0px 1px 1px #fff;
    font-size: 12px;
}

a.forgot {
    display: block;
    color: #33abdd;
    text-shadow: 0px 1px 1px #000;
    font-size: 12px;
    text-align: center;
    margin: 0 auto;
    margin-top: 20px;
    text-decoration: none;
    width: 150px;
}

a.forgot:hover {
    color: #52bae5;
}

input{font-weight: lighter;}

h1 {
    color: #fff;
    font-weight: 200;
    width: 400px;
    text-align: center;
    font-size: 28px;
    margin: 0 auto;
    margin-top: 150px;
    margin-bottom: 2%;
    text-shadow: 0px 1px 1px #000;
}

#box form {
    position: relative;
}

#box form input[type=text] {
    position: relative;
    left: 47px;
    border: none;
    background: #CCC;
    display: block;
    height: 30px;
    width: 530px;
    padding: 10px;
    margin-top: 5px;
    color: #999999;
    font-size: 20px;
    font-weight: lighter;
    text-shadow: 0px 1px 1px #e7e7e7;
}

#box form input[type=text]:focus, #box form input[type=password]:focus {
    outline: none;
    color: #666666;
}


#box form label {
    position: absolute;
    left: 60px;
    top: 180px;
    color: #8d8b8b;
    font-weight: 200;
}

#box form input[type=button], #box form input[type=submit] {
    border: 1px solid #CCC;
    display: block;
    position: absolute;
    top: 230px;
    left: 50px;
    width: 550px;
    height: 41px;
    color: #5e7171;
    font-weight: bold;
    font-size: 18px;
    text-shadow: 0px 1px 0px #fff;
    cursor: pointer;
}

#box form input[type=button]:hover, #box form input[type=submit]:hover{
    background-position: 0 -41px;
}

#box form input[type=button]:active, #box form input[type=submit]:active{
    background-position: 0 -82px;
}

</style>
<script type="text/javascript">
function go () {
    var home = document.getElementById('home').value;
    var root = document.getElementById('root').value;
    var entry = document.getElementById('entry').value;
    var analyzer = document.getElementById('analyzer').value;

    window.location.href = window.location.origin + window.location.pathname + '?root=' + root + '&' + 'home=' + home + '&' + 
    (analyzer.length && analyzer != '/akra-engine-general/analyzer/' ? 'analyzer=' + analyzer + '&':'') + 
        'entry=' + entry;
}

</script>
<div id="box">
    <form>
        <input id="home" type="text" onclick="" onfocus="this.select()" onblur="this.value=!this.value?'/akra-engine-core/src/':this.value;" value="/akra-engine-core/src/" />
        <input id="root" type="text" onclick="" onfocus="this.select()" onblur="this.value=!this.value?'C:/webservers/home/akra/www/akra-engine-core/src/':this.value;" value="C:/webservers/home/akra/www/akra-engine-core/src/" />
        <input id="entry" type="text" onclick="" onfocus="this.select()" onblur="this.value=!this.value?'C:/webservers/home/akra/www/akra-engine-general/demos/keymap.js':this.value;" value="C:/webservers/home/akra/www/akra-engine-general/demos/keymap.js">
        <input id="analyzer" type="text" onclick="" onfocus="this.select()" onblur="this.value=!this.value?'/akra-engine-general/analyzer/':this.value;" value="/akra-engine-general/analyzer/">
        <input type="button" name="" value="Launch" onclick="go();"/>
    </form>
</div>
<?php } ?>
</body>
</html>

