define(['js/core/core',
  'js/mvc/controllers/mvc.Controller',
  'js/mvc/views/ContentView',
  'js/mvc/viewModels/ContentViewModel'],
        function(core, mvcController, ContentVw, ContentVM) {

          function ContentController(model) {
            var partialViews;

            this.getModel = function() {
              return model;
            };

            this.getNavView = function() {
              return partialViews;
            };
            this.setPartialViews = function(val) {
              partialViews = val;
            };
          }

          core.inherit(ContentController, mvcController);

          var ccP = ContentController.prototype;

          ccP.displayHome = function(navView) {
            doDisplayContent(this, '/index.html', navView, '.home', 'theme-light')
          };

          ccP.displayAbout = function(navView) {
            doDisplayContent(this, '/about.html', navView, '.about', 'theme-dark', 'About')
          };

          ccP.displayDownloads = function(navView) {
            doDisplayContent(this, '/downloads.html', navView, '.downloads', 'theme-dark', 'Downloads')
          };

          ccP.displayContact = function(navView) {
            doDisplayContent(this, '/contact.html', navView, '.contact', 'theme-dark', 'Contact')
          };

          return ContentController;

//**************************************************** private functions

          function doDisplayContent(ctrlr, url, navView, selectedItem, themeClasses, title) {
            var vw, vm;

            vm = new ContentVM(ctrlr.getModel(), url, selectedItem, themeClasses, title);
            vw = new ContentVw(vm, navView);

            vm.update();
            vw.render();
          }
        });