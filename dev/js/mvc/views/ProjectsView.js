define(['core/core',
  'mvc/views/mvc.View'], function(core, mvcView) {

  function ProjectsView(viewModel) {
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

  core.inherit(ProjectsView, mvcView);

  ProjectsView.prototype.render = function() {
    var vm = this.getViewModel(),
            navView = this.getNavView().navView,
            hb = this.getHashbang(),
            context = {contextItem:[]},
            showContext = false;

    vm.update();

    var vmData = vm.getModelData();
    var projectsListHtml = Mustache.to_html(this.getTemplate('projects'), vmData);

    document.title = 'Grundini';

    if (vmData.client) {
      showContext = true;
      
      context.contextItem.push({
        title : 'Clients',
        value : '#!/client',
        seperator : '&nbsp;/'
      });

      context.contextItem.push({
        title : vmData.client.title,
        value : '#!/client/' + vmData.client.slug
      });
    }

    $('.stage').html(projectsListHtml);

    this.setTheme('theme-standard');
    navView.setProjectView(hb, context, showContext);
    navView.showStage();

    if(window.grundini.isMobile){
      setTimeout(function () {
        $('.stage').css('height', '115%');
        window.scrollTo(0, 1);
      }, 10);
    }



  };

  return ProjectsView;
}); 