define(['jquery'], function($){

  var grundiniUtils = window.grundiniUtils ={

    isMobile : function(){
      var w = $(window).width();

      return (w < 681);
    }
  };

  window.grundini = {
    isMobile : grundiniUtils.isMobile()
  };

  return grundiniUtils;
});