define([
  'mvc/models/GrundiniAppModel',
  'mvc/controllers/BrowseIllustrationsController',
  'mvc/partialViews/NavigationMenuView',
  'mvc/controllers/ContentController',
  'mvc/views/ContentView',
  'libs/grundini-utils'
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

  $.ajaxSetup({
    cache:false
  });

  GrundiniApp.setLoadingState = function(){
    $('#app').addClass('loading');
    $('.stage').removeClass('stage-contentview stage-taggroupsview stage-thumbsview stage-projectview stage-browserview stage-clientview stage-defaultview stage-loading');
  }

  GrundiniApp.routeHandler = {

    /*  editorial - probably replaced with static pages  */
    "displayHome": function (args) {

      function doDisplayHome() {
        controllerCtx.displayHome(partialViews.navView);
      }
      GrundiniApp.setLoadingState();
      actionRequest(ContentCtrlr, doDisplayHome);

    },

    "displayAbout": function (args) {

      function doDisplayAbout() {
        controllerCtx.displayAbout(partialViews.navView);
      }
      GrundiniApp.setLoadingState();
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
      GrundiniApp.setLoadingState();
      actionRequest(ContentCtrlr, doDisplayDownloads);
    },

    /*  browse  */
    "listProjects": function (args) {
      function doDisplayProjects() {
        controllerCtx.displayProjects(partialViews.navView, args.client);
      }
      GrundiniApp.setLoadingState();
      actionRequest(BrowseIllsCtrlr, doDisplayProjects);
    },

    "listClients": function (args) {

      function doDisplayClients() {
        controllerCtx.displayClients(partialViews.navView);
      }
      GrundiniApp.setLoadingState();
      actionRequest(BrowseIllsCtrlr, doDisplayClients);
    },

    "listTagsForGroup": function (args) {
      function doDisplayTagsForGroup() {
        controllerCtx.displayTagsForGroup(partialViews.navView, args.group);
      }
      GrundiniApp.setLoadingState();
      actionRequest(BrowseIllsCtrlr, doDisplayTagsForGroup);

    },

    "displayThumbnailsForProject": function (args) {

      function doDisplayThumbs() {
        controllerCtx.displayThumbnailsForProject(partialViews.navView, args.project, args.client);
      }
      GrundiniApp.setLoadingState();
      actionRequest(BrowseIllsCtrlr, doDisplayThumbs);

    },

    "displayThumbnailsForTag": function (args) {
      function doDisplayThumbs() {
        controllerCtx.displayThumbnailsForTag(partialViews.navView, args.tag);
      }
      GrundiniApp.setLoadingState();
      actionRequest(BrowseIllsCtrlr, doDisplayThumbs);
    },

    "displayProjectIllustrationBrowser": function (args) {

      function doDisplayBrowser() {
        controllerCtx.displayProjectIllustrationBrowser(partialViews.navView, args.project, args.illustration, args.client);
      }

      //GrundiniApp.setLoadingState();
      actionRequest(BrowseIllsCtrlr, doDisplayBrowser);

    },

    "displayTagIllustrationBrowser": function (args) {
      function doDisplayBrowser() {
        controllerCtx.displayTagggedIllustrationsBrowser(partialViews.navView, args.tag, args.illustration);
      }

      //GrundiniApp.setLoadingState();
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
      $('.main-nav> ul .work').removeClass('open');
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