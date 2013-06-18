define(['jquery'], function($){

  var grundiniUtils = window.grundiniUtils ={

    isMobile : function(){
      var w = $(window).width();

      return (w < 481);
    }
  };

  window.grundini = {
    isMobile : grundiniUtils.isMobile()
  };

  return grundiniUtils;
});