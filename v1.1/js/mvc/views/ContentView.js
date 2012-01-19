define(['js/core/core',
  'js/mvc/views/mvc.View'], function(core, mvcView) {

  function ContentView(viewModel, navView) {

    this.getViewModel = function() {
      return viewModel
    };
    this.getNavView = function() {
      return navView
    };
  }

  core.inherit(ContentView, mvcView);

  var cvP = ContentView.prototype;

  cvP.render = function() {
    var url = this.getViewModel().getModelData().url,
            vmd = this.getViewModel().getModelData(),
            selectedItem = vmd.selectedItem,
            navView = this.getNavView(),
            context = {contextItem:[]};


    if (vmd.themeClass) {
      this.setTheme(vmd.themeClass);
    }

    $('.stage').load(url + '#app section.editorial-content');

    if(vmd.title && vmd.title.length){
      context.contextItem.push({
        title : vmd.title,
        value : window.location.hash
      });
    }
    else{
      context = null;
    }

    navView.setContentView(selectedItem, context);
    navView.showStage();
  };

  return ContentView;
});