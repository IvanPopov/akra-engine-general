var preprocessor = require('./preprocessor/approc.js');

var fs = require('fs');
var http = require("http");
var url = require('url');

http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/javascript"});

  var $_GET = url.parse(request.url, true).query;
  if ($_GET['q'] == undefined) {
      response.end();
  }
  try {
     var custom = preprocessor.code($_GET['q'], {include: true});
//     for (var file in custom.include) {
//         console.log(file, 'modified: ', fs.statSync(__dirname + '/' + file).mtime);
//     }
     response.end(preprocessor.next());
  }
  catch (e) {
    response.end(e.message);
  }


}).listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
