define(['core/core',
  'mvc/views/mvc.View'], function(core, mvcView) {

  function TagGroupsView(viewModel) {
    var partialViews;
    this.getViewModel = function() {
      return viewModel;
    };

    this.getNavView = function() {
      return partialViews;
    };
    this.setPartialViews = function(val) {
      partialViews = val;
    };
  }

  core.inherit(TagGroupsView, mvcView);

  TagGroupsView.prototype.render = function() {
    var vm = this.getViewModel(), vmData, tagsForGroupHtml,
            navView = this.getNavView().navView,
            that = this,
            hb = this.getHashbang();

    vm.update();

    vmData = vm.getModelData();

    if(vmData)

    tagsForGroupHtml = Mustache.to_html(this.getTemplate('tags-for-group'), vmData);
    document.title = 'Grundini';

    $('.stage').html(tagsForGroupHtml);

    this.setTheme('theme-standard');
    navView.setTagGroupsView(hb);
    navView.showStage();
  };

  return TagGroupsView;
}); 