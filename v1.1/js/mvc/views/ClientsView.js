define(['js/core/core',
  'js/mvc/views/mvc.View'], function(core, mvcView) {

  function ClientsView(viewModel) {
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

  core.inherit(ClientsView, mvcView);

  ClientsView.prototype.render = function() {
    var vm = this.getViewModel(), vmData, clientsListHtml,
            navView = this.getNavView().navView,
            that = this,
            hb = this.getHashbang();

    vm.update();

    vmData = vm.getModelData();
    clientsListHtml = this.buildClientsHtml(vmData);

    //TODO: code smell - in a rush to get this in, not the right place to put it should go in the view model or the model...

    function alphaSortFn() {
      vmData = vm.getModelData();
      vmData.clients.sort(function(a, b) {

        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        }

        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        }

        return 0;
      });

      clientsListHtml = that.buildClientsHtml(vmData);
      $('.stage').html(clientsListHtml);
    }

    function dateSortFn() {
      vmData = vm.getModelData();
      //TODO: SHOULD BE IN THE VIEW MODEL
      vmData.clients = vmData.clients.sort(function(a, b) {

        if (a.order < b.order) {
          return -1;
        }

        if (a.order > b.order) {
          return 1;
        }

        return 0;
      });
      clientsListHtml = that.buildClientsHtml(vmData);
      $('.stage').html(clientsListHtml);
    }

    this.setTheme('theme-standard');

    $('.stage').html(clientsListHtml);
    navView.setClientView(hb, 'Grundini', alphaSortFn, dateSortFn);

    navView.showStage();
  };

  ClientsView.prototype.buildClientsHtml = function(vmData) {
    return Mustache.to_html(this.getTemplate('clients'), vmData);
  };

  return ClientsView;


}); 