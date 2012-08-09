var preprocessor = require('./approc.js');

var fs = require('fs');
var http = require("http");
var url = require('url');
var code, custom;
var build = 0;
var rebuild;
var build_num = 0;
var q = null;

function now() {
  return (new Date).getTime();
}

http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/javascript"});
  rebuild = false;

  var $_GET = url.parse(request.url, true).query;
  if ($_GET['q'] == undefined) {
      response.end();
  }
  try {
    if (q !== $_GET['q']) {
      build = 0;
      q = $_GET['q'];
    }

    custom = preprocessor.code($_GET['q'], {include: true});

    for (var file in custom.include) {
        if (fs.statSync(file).mtime.getTime() > build) {
          rebuild = true;
          break;
        }
    }

    if (rebuild) {
      code = preprocessor.next();
      build = now();
      console.log('rebuild: ', build, '(', (build_num ++), ')');
    }

    response.end(code);
  }
  catch (e) {
    response.end(e.message);
    preprocessor.reset();
  }


}).listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
