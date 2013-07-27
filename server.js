var urlParser = require('url'),
  doCache = false,
  static = require('node-static'),
  httpsrv = require('http'),
  file = new (static.Server)('./build'),
  ports = {
    flickrApi: 8111,
    web: 8081
  };

var grunFlickr = require('grundini-flickr');
var memCache = require('simpleMemCache.js');
var doCache = false;

httpsrv.createServer(
  function (request, response) {
    var parsedUrl, urlKey, cachedResult,
      bytesLen, url;

    request.addListener('end', function () {
      //request.socket.setTimeout(1000);

      url = request.url;
      parsedUrl = urlParser.parse(request.url, true);

      if (doCache) {
        urlKey = memCache.getKeyFromUrl(parsedUrl, ['callback', '_']);
        cachedResult = memCache.get(urlKey);

        if (cachedResult) {
          cachedResult.cached = true;
          writeSuccess(cachedResult, response, parsedUrl.query.callback);
          //console.log('cached result');
          return;
        }

      }

      grunFlickr.handleRequest(request.url, function (result) {
        if (!result || !result.result) {
          response.writeHead(404, {
            'Content-Length': bytesLen,
            'Content-Type': 'application/json'
          });
          response.end();
          return;
        }

        cachedResult = memCache.put(urlKey, result);

        writeSuccess(cachedResult, response, parsedUrl.query.callback);

      });
    }).resume();


  }).listen(ports.flickrApi);


function writeSuccess(result, response, callback) {
  var bytesLen, resultStr;

  //JSONP
  if (result && callback) {
    resultStr = JSON.stringify(result);
    resultStr = [callback, '(', resultStr, ')'].join('');
  }
  else {
    resultStr = JSON.stringify(result);
  }

  bytesLen = Buffer.byteLength(resultStr, 'utf8');

  response.writeHead(200, {
    'Content-Length': bytesLen,
    'Content-Type': 'application/json'
  });

  response.end(resultStr);
}

console.log('api.grundini.com listening on port ' + ports.flickrApi);


//---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
//  Static server
//---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


httpsrv.createServer(

  function (request, response) {
    request.addListener('end', function () {
      // Serve static files!

      file.serve(request, response, function (err, result) {
        request.socket.setTimeout(1000);

        if (err) {
          console.log(err);
          response.writeHead(err.status, err.headers);
          response.end();
        }
      });
    }).resume();
  }).listen(ports.web);


console.log('grundini.com listening on port ' + ports.web);

