<?php

if (isset($_POST['data']) && $_POST['encode'] == 'base64') {
	file_put_contents('data.txt', base64_decode($_POST['data']));
}
else {
    file_put_contents('data(not bin).txt', ($_POST['data']));
}
?>