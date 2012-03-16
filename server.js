var static = require('node-static');

var file = new (static.Server)('./v1.1');

require('http').createServer(
        function (request, response) {
          request.addListener('end', function () {
            // Serve static files!
            file.serve(request, response, function(err, result) {
              request.socket.setTimeout(500);

              if (err) {
                response.writeHead(err.status, err.headers);
                response.end();
              }
            });
          });
        }).listen(8081);


console.log('dev.grundini.com listening on port 80');