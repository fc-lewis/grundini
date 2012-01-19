define([], function() {

  function ContentViewModel(model, url, selectedItem, themeClasses, title) {
    var viewModelData = {}, content;

    this.getUrl = function(){
      return url;
    };

    this.getThemeClasses = function(){
      return themeClasses;
    };

    this.getSelectedItem = function(){
      return selectedItem;
    };

    this.getTitle = function(){
      return title;
    };

    this.getModel = function() {
      return model;
    };

    this.getModelData = function() {
      return viewModelData;
    };

    this.getContent = function(){
      return content;
    };

    this.setContent = function(val){
      content = val;
    };
  }

  var cvmP = ContentViewModel.prototype;

  cvmP.update = function(fn){

    var vmd = this.getModelData();

    vmd.url = this.getUrl();
    vmd.selectedItem = this.getSelectedItem();
    vmd.themeClass = this.getThemeClasses();
    vmd.title = this.getTitle();

  };

  return ContentViewModel;


});