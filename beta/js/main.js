require([
  'js/core/routeHandler',
  'js/core/simpleMemCache',
  'js/GrundiniApp'
],
        function(initRoutesFn, cache, grundiniApp) {

          window.cache = cache;

          window.onunload = function() {
            
            try{
              delete window.cache;  
            }
            catch(e){
              //do nothing
            }
              
            
          };

          initRoutesFn(grundiniApp);
        });

