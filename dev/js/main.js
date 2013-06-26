require([
  'core/routeHandler',
  'core/simpleMemCache',
  'GrundiniApp',
  'libs/grundini-utils.js',
  'libs/mustache',
  'libs/inflection.min'
],
  function (initRoutesFn, cache, grundiniApp, grundiniUtils, mustache, inflection) {
    window.cache = cache;

    window.onunload = function () {

      try {
        delete window.cache;
      }
      catch (e) {
        //do nothing
      }

    };

    $(document).ready(function () {
      initRoutesFn(grundiniApp);
   });

  });

