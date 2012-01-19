define([], function() {
  var cache = {};
  var expiresAfterMs = (1000 * 60 * 10); // ten mins

  var smCache = {

    put : function(key, value) {
      cache[key] = { data : value,
        timestamp : new Date().getTime()};

      return cache[key].data;
    },

    get : function(key) {
      if (cache[key]) {
        if (new Date().getTime() - cache[key].timestamp < expiresAfterMs) {
          return cache[key].data;
        }

        delete cache[key];
      }

      return undefined;
    }
  };

  setInterval(function(){
    for(var key in cache){
      if(new Date().getTime() - cache[key].timestamp > expiresAfterMs){
        delete cache[key];
      }
    }
    
  }, expiresAfterMs + 1000);
  
  return smCache; 

});
