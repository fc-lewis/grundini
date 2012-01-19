var urlParser = require('url');

var grunFlickr = require('grundini-flickr');
var memCache = require('simpleMemCache.js');

var parsedUrl, urlKey, cachedResult;
var doCache = false;

require('http').createServer(
        function (request, response) {
          var bytesLen, resultStr, url;

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

            grunFlickr.handleRequest(request.url, function(result) {
              if (!result || !result.result) {
                response.writeHead(404, {
                  'Content-Length'  : bytesLen,
                  'Content-Type'    : 'application/json'
                });
                response.end();
                return;
              }

              cachedResult = memCache.put(urlKey, result);

              writeSuccess(cachedResult, response, parsedUrl.query.callback);

            });
          });
        }).listen(8111);

function writeSuccess(result, response, callback) {
  var bytesLen, resultStr;

  //JSONP
  if (result && callback) {
    resultStr = JSON.stringify(result);
    resultStr = [callback,'(',resultStr,')'].join('');
  }
  else {
    resultStr = JSON.stringify(result);
  }

  bytesLen = Buffer.byteLength(resultStr, 'utf8');

  response.writeHead(200, {
    'Content-Length'  : bytesLen,
    'Content-Type'    : 'application/json'
  });

  response.end(resultStr);
}

console.log('api.grundini.com listening on port 8111');