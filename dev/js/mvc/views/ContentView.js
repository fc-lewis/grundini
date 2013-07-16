define(['core/core',
  'mvc/views/mvc.View'], function (core, mvcView) {

  function ContentView(viewModel, navView) {

    this.viewModel = viewModel;
    this.navView = navView;

    this.viewModelData = this.viewModel.getModelData();
  }

  core.inherit(ContentView, mvcView);

  var cvP = ContentView.prototype;

  cvP.load = function () {
    var vmd = this.viewModelData,
        that = this;

    $('.stage').load(vmd.url + '#app section.editorial-content', function(){
      that.contentLoaded(arguments);
    });
  };

  cvP.contentLoaded = function(args){
    var vmd = this.viewModelData,
        context = {contextItem: []};

    if (vmd.themeClass) {
      this.setTheme(vmd.themeClass);
    }

    if (vmd.title && (vmd.title.length > 0)) {
      context.contextItem.push({
        title: vmd.title,
        value: window.location.hash
      });
    }
    else {
      context = null;
    }

    this.setContentView(vmd.selectedItem, context);
    this.showStage();
  };

  cvP.setContentView = function(selectedItem, context){
    var that = this;
    that.navView.clearViewClasses();
    $('#app').addClass('contentView');
    that.navView.reloadOnResize = false;

    if (window.grundini.isMobile) {
      this.arrangeForDisplay(context);
    } else {
      that.navView.hideIllustrationNav(function(){
        that.arrangeForDisplay(context);
      });
    }

    that.navView.clearMainSelection();
    that.navView.setMainSelection(selectedItem);
    that.navView.setDisableYScroll(false);
    that.navView.clearTouchEventHandlers();

  };

  cvP.showStage = function(){
    this.navView.showStage();
  };

  cvP.arrangeForDisplay = function(context){
    this.navView.hideTitleBar();
    this.navView.hideSortBar();
    this.navView.hideShareControls();
    this.navView.hideIllustrationNav($.noop);

    if (context) {
      this.navView.setContext(context);
      this.navView.hidePosition();
      this.navView.showContext();
      this.navView.setViewClass('stage-contentview');
    }
    else {
      this.navView.setViewClass('stage-defaultview');
      this.navView.hideContext();
    }
  }


  return ContentView;
});