define([
  'mvc/models/GrundiniAppModel',
  'mvc/controllers/BrowseIllustrationsController',
  'mvc/partialViews/NavigationMenuView',
  'mvc/controllers/ContentController',
  'mvc/views/ContentView',
  'libs/grundini-utils.js'
], function (GrundiniModel, BrowseIllsCtrlr, NavMenuView, ContentCtrlr, ContentVw, utils) {
  var controllerCtx,
    modelCtx = new GrundiniModel();

  modelCtx.load();

  var GrundiniApp = {};

  var partialViews = {
    "navView": new NavMenuView(
      { elms: [
        {
          name: 'root',
          selector: '.illustration-nav'}
      ]})
  };

  GrundiniApp.routeHandler = {

    /*  editorial - probably replaced with static pages  */
    "displayHome": function (args) {

      function doDisplayHome() {
        controllerCtx.displayHome(partialViews.navView);
      }

      actionRequest(ContentCtrlr, doDisplayHome);

    },

    "displayAbout": function (args) {

      function doDisplayAbout() {
        controllerCtx.displayAbout(partialViews.navView);
      }

      actionRequest(ContentCtrlr, doDisplayAbout);

    },

    "displayContact": function (args) {

      function doDisplayContact() {
        controllerCtx.displayContact(partialViews.navView);
      }

      actionRequest(ContentCtrlr, doDisplayContact);
    },

    "displayDownloads": function (args) {

      function doDisplayDownloads() {
        controllerCtx.displayDownloads(partialViews.navView);
      }

      actionRequest(ContentCtrlr, doDisplayDownloads);
    },

    /*  browse  */
    "listProjects": function (args) {
      function doDisplayProjects() {
        controllerCtx.displayProjects(partialViews.navView, args.client);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayProjects);
    },

    "listClients": function (args) {

      function doDisplayClients() {
        controllerCtx.displayClients(partialViews.navView);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayClients);
    },

    "listTagsForGroup": function (args) {
      function doDisplayTagsForGroup() {
        controllerCtx.displayTagsForGroup(partialViews.navView, args.group);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayTagsForGroup);

    },

    "displayThumbnailsForProject": function (args) {

      function doDisplayThumbs() {
        controllerCtx.displayThumbnailsForProject(partialViews.navView, args.project, args.client);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayThumbs);

    },

    "displayThumbnailsForTag": function (args) {
      function doDisplayThumbs() {
        controllerCtx.displayThumbnailsForTag(partialViews.navView, args.tag);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayThumbs);
    },

    "displayProjectIllustrationBrowser": function (args) {

      function doDisplayBrowser() {
        controllerCtx.displayProjectIllustrationBrowser(partialViews.navView, args.project, args.illustration, args.client);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayBrowser);

    },

    "displayTagIllustrationBrowser": function (args) {
      function doDisplayBrowser() {
        controllerCtx.displayTagggedIllustrationsBrowser(partialViews.navView, args.tag, args.illustration);
      }

      actionRequest(BrowseIllsCtrlr, doDisplayBrowser);
    }
  };

  return GrundiniApp;
  //*************************************** private functions

  function actionRequest(ControllerType, cb, skipClearingEvents) {

    if (!controllerCtx || controllerCtx.constructor !== ControllerType) {
      controllerCtx = new ControllerType(modelCtx);
      controllerCtx.setPartialViews(partialViews);
    }

    //setup the site for devices < 481px wide
    if(window.grundini.isMobile){
      $('#workSubMenuMobile').append($('.illustration-nav').removeClass('displaynone'));
      $('#workSubMenuMobile').addClass('closed');

      //close the nav if it's open
      $('.main-nav> ul').addClass('closed');
    }

    setTimeout(function () {
      //if (!pageYOffset)
      window.scrollTo(0, 1);
    }, 1000);

    if (modelCtx.isReady()) {
      cb();
    }
    else {
      modelCtx.onReady(cb);
    }
  }

});