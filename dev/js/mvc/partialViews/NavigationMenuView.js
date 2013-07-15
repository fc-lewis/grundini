define(['core/core',
  'core/touchevents',
  'mvc/views/mvc.View'], function (core, touch, mvcView) {

  function NavigationMenuView(cfg) {
    var that = this,
      dateSortFn, alphaSortfn, disableYScroll;

    this.renderFn = null;
    this.templateCache = {};
    this.elCache = {};
    this.viewModel = null;
    this.visible = false;
    this.shareThisMenuState = 'CLOSED';
    this.root = $('.illustration-nav');

    this.getDateSortFn = function () {
      return dateSortFn;
    };
    this.setDateSortFn = function (val) {
      dateSortFn = val;
    };

    this.getAlphaSortFn = function () {
      return alphaSortfn;
    };
    this.setAlphaSortFn = function (val) {
      alphaSortfn = val;
    };

    this.resetSortFns = function () {
      alphaSortfn = undefined;
      dateSortFn = undefined;
    };

    this.setDisableYScroll = function (val) {
      disableYScroll = val;
    };

    this.reloadOnResize = false;

    $('.sorting-controls .alphabetical').on('click', function (e) {
      e.preventDefault();
      var sortAlphaFn = that.getAlphaSortFn();
      if (sortAlphaFn) {
        sortAlphaFn();
      }
      $('.sorting-controls a').removeClass('active');
      $(this).addClass('active');
    });

    $('.sorting-controls .chronological').on('click', function (e) {
      e.preventDefault();
      var sortDateFn = that.getDateSortFn();
      if (sortDateFn) {
        sortDateFn();
      }
      $('.sorting-controls a').removeClass('active');
      $(this).addClass('active');
    });

    $('.click-plate').on('click', function () {
      that.toggleIllustrationNav();
    });

    $('.sharethis-menu-toggle').on('click', function (e) {
      e.preventDefault();
      that.toggleShareThisMenu();
    });

    if (window.grundini.isMobile) {

      $('#mainNavSwitch').on('click', function (e) {
        e.preventDefault();
        $('.main-nav > ul').toggleClass('closed');
      });

      $('#workNavSwitch').on('click', function (e) {
        e.preventDefault();
        $('#workSubMenuMobile').toggleClass('closed');
        $('#workNavSwitch .left-arrow').toggleClass('open');
      });

      if (document.body.addEventListener) {
        document.body.addEventListener('touchmove', function (event) {
          if (disableYScroll) {
            event.preventDefault();
          }
        }, false);
      }
    }
  }

  core.inherit(NavigationMenuView, mvcView);

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  NavigationMenuView.prototype.hidePageLoading = function () {
    $('.page-loading').hide();
  };

  NavigationMenuView.prototype.showTitleBar = function () {
    $('.title-bar').slideDown(250);
  };

  NavigationMenuView.prototype.hideTitleBar = function () {
    $('.title-bar').slideUp(250);
  };

  NavigationMenuView.prototype.showContext = function () {
    $('.context-bar').slideDown(250);
  };

  NavigationMenuView.prototype.hideContext = function () {
    $('.context-bar').slideUp(300);
  };

  NavigationMenuView.prototype.hidePosition = function () {
    $('.context-bar .position').hide();
  }

  NavigationMenuView.prototype.showPosition = function () {
    $('.context-bar .position').show();
  }

  NavigationMenuView.prototype.hideIllustrationNav = function (fn) {
    $('.illustration-nav').slideUp(250, fn);
 };

  NavigationMenuView.prototype.showIllustrationNav = function (fn) {
    $('.illustration-nav').slideDown(100, fn);
    //$('.illustration-nav').removeClass('up').one($.support.transition.end, fn);
  };

  NavigationMenuView.prototype.hideSortBar = function () {
    $('header .sorting-controls').slideUp(250);
  };

  NavigationMenuView.prototype.showSortBar = function () {
    $('header .sorting-controls').slideDown(100);
  };

  NavigationMenuView.prototype.hideNextPreviousButtons = function () {
    //$('.controls .nextPrevious').fadeOut(250);
    $('.controls .position').fadeOut(250);
  };

  NavigationMenuView.prototype.showNextPreviousButtons = function () {
    //$('.controls .nextPrevious').fadeIn(250);
    $('.controls .position').fadeIn(250);

  };

  NavigationMenuView.prototype.hideShareControls = function () {
    $('.controls .share').fadeOut(250);
  };

  NavigationMenuView.prototype.showShareControls = function () {
    $('.controls .share').fadeIn(100);
  };

  NavigationMenuView.prototype.openShareThisMenu = function () {
    $('.share .sharethis-buttons-container').animate({left: '0px'});
    this.shareThisMenuState = 'OPEN';
  };

  NavigationMenuView.prototype.closeShareThisMenu = function () {
    $('.share .sharethis-buttons-container').animate({left: '500px'}, 250);
    this.shareThisMenuState = 'CLOSED';
  };

  NavigationMenuView.prototype.toggleShareThisMenu = function () {
    if (this.shareThisMenuState === 'OPEN') {
      this.closeShareThisMenu();
    } else {
      this.openShareThisMenu();
    }
  };

  NavigationMenuView.prototype.hideFooter = function () {
    $('footer').fadeOut(250);
  };

  NavigationMenuView.prototype.showFooter = function () {
    $('footer').fadeIn(250);
  };

  //--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---





  NavigationMenuView.prototype.setActiveItem = function (elm) {
    this.clearIllstrItem();
    $(elm).addClass('active');
  };

  NavigationMenuView.prototype.clearIllstrItem = function (elm) {
    this.root.find('li').removeClass('active');
  };

  NavigationMenuView.prototype.setActiveItemByHash = function (hash) {
    this.clearIllstrItem();
    if (window.location.hash) {
      var els = this.findByHref(hash, this.root);
      if (els && els[0]) {
        this.setActiveItem($(els[0]).parent());
        return;
      }

      this.setActiveItem($(els).parent());
    }
  };

  //TODO: the following methods are messy -- could do with tidying :(

  NavigationMenuView.prototype.setCrumbsForClient = function (client) {
    addClientCrumb(client, this);
  };

  NavigationMenuView.prototype.setCrumbsForProject = function (project, client) {

    addProjectCrumb(this, project, client);
  };

  NavigationMenuView.prototype.setCrumbsForTag = function (tag) {
    var container = $('.title-bar');
    var tagCrumbHtml = Mustache.to_html(this.getTemplate('tag-crumb'), tag);

    $('.title-bar .tag-crumb').remove();
    container.append(tagCrumbHtml);
  };

  NavigationMenuView.prototype.deleteCrumbs = function () {
    $('.title-bar .crumb').remove();
  };

  NavigationMenuView.prototype.showTitleBar = function () {
    $('.title-bar').slideDown(250);
  };

  NavigationMenuView.prototype.hideTitleBar = function () {
    $('.title-bar').slideUp(250);
  };

  NavigationMenuView.prototype.setTitle = function (title) {
    $('.title-bar .title-text').text(title);
  };

  NavigationMenuView.prototype.clearMainSelection = function () {
    $('.main-nav li').removeClass('active');
  };

  NavigationMenuView.prototype.setMainSelection = function (itemCls) {
    $('.main-nav' + itemCls).addClass('active');
  };

  NavigationMenuView.prototype.update = function () {
    //this.setToggleLink();
  };

  NavigationMenuView.prototype.setFilterByHashbang = function (hb) {
    this.clearIllstrItem();
    //HACK: written rather quickly, for user-testing
    var re = /\//gi;
    var matches = hb.match(re);

    if (hb.indexOf('all-work') > -1) {
      this.findByHref('#!/all-work', $('.illustration-nav')).parent().addClass('active');
      return;
    }

    if (hb.indexOf('client') > -1) {
      this.findByHref('#!/client', $('.illustration-nav')).parent().addClass('active');
      return;
    }

    if (hb.indexOf('project') > -1) {
      this.findByHref('#!/all-work', $('.illustration-nav')).parent().addClass('active');
      return;
    }

    if (hb.indexOf('tagged') > -1) {
      var parts = hb.split('/');
      var tagparts = parts[2];
      var grouptag = tagparts.split('-');


      this.findByHref('#!/grouped-by/' + grouptag[0], $('.illustration-nav')).parent().addClass('active');
      return;
    }

    if (hb.indexOf('grouped-by') > -1) {
      var parts = hb.split('/');
      var tagGroup = parts[2];

      this.findByHref('#!/grouped-by/' + tagGroup, $('.illustration-nav')).parent().addClass('active');
    }

  };

  NavigationMenuView.prototype.setContext = function (context) {
    //context-items
    var contextHtml = Mustache.to_html(this.getTemplate('context-items'), context);
    $('.context-bar').html(contextHtml);
  };

  NavigationMenuView.prototype.setStageTopPos = function (val) {
    //$('.stage').css('top', val);
  };

  NavigationMenuView.prototype.setViewClass = function (stageClass) {
    $('#app').removeClass('loading');
    $('.stage').removeClass('stage-taggroupsview stage-thumbsview stage-projectview stage-browserview stage-clientview stage-defaultview');
    $('.stage').addClass(stageClass);
  };


  NavigationMenuView.prototype.showStage = function () {
    //if (parseInt($('.stage').css('opacity')) !== 0) {
      this.hidePageLoading();
      $('.stage').animate({opacity: 1}, 500)
      $('.stage').css('min-height', '100%');
    //}
  };

  NavigationMenuView.prototype.addTouchEventHandler = function (fn) {
    if (touch) {
      touch('body').on('flick', fn);
    }

  };

  //HACK
  NavigationMenuView.prototype.clearTouchEventHandlers = function () {
    if (touch) {
      touch('body').clear('flick');
    }
  };


//-------- VIEW SETTINGS
  NavigationMenuView.prototype.clearViewClasses = function(){
    $('#app').removeClass('contentView projectsView clientsView browserView thumbsView tagsGroupView');
  }

  NavigationMenuView.prototype.setProjectView = function (hashbang, context, showContext) {
    var that = this;

    this.clearViewClasses();
    $('#app').addClass('projectsView');

    this.reloadOnResize = false;
    this.setViewClass('stage-projectview');
    this.hideTitleBar();
    this.hideSortBar();
    this.hideNextPreviousButtons();
    this.hideShareControls();
    this.hideFooter();
    this.clearMainSelection();
    this.setMainSelection('.work');
    this.hidePosition();

    if (showContext) {
      if(window.grundini.isMobile){
        that.setContext(context);
        that.showContext();
      }else{
        this.hideIllustrationNav(function() {
          that.setContext(context);
          that.showContext();
        });
      }
    } else {
      this.showIllustrationNav(function() {
        that.hideContext()
      });
    }

    this.setFilterByHashbang(hashbang);
    this.setDisableYScroll(false);
    this.clearTouchEventHandlers();
  };

  NavigationMenuView.prototype.setClientView = function (hashbang, title, alphaSortFn, dateSortFn) {
    var that = this;

    this.clearViewClasses();
    $('#app').addClass('clientsView');

    this.reloadOnResize = false;
    //this.setStageTopPos('96px');
    this.setViewClass('stage-clientview');
    this.hideTitleBar();
    this.hideNextPreviousButtons();
    this.hideShareControls();
    //this.showShareControls();

    this.hideFooter();
    this.clearMainSelection();
    this.hidePosition();

    this.showIllustrationNav(function () {
      that.hideContext();
      that.showSortBar();

      that.setMainSelection('.work');
      that.setAlphaSortFn(alphaSortFn);
      that.setDateSortFn(dateSortFn);
      that.setFilterByHashbang(hashbang);
      that.setDisableYScroll(false);
      that.clearTouchEventHandlers();
    });


  };

  NavigationMenuView.prototype.setBrowserView = function (hashbang, context, pos, total) {
    var that = this;

    this.clearViewClasses();
    $('#app').addClass('browserView');

    if(window.grundini.isMobile){
      this.reloadOnResize = false;
    }else{
      this.reloadOnResize = true;
    }

    //this.setStageTopPos('96px');
    this.setViewClass('stage-browserview');
    this.showNextPreviousButtons();
    this.showShareControls();
    this.showFooter();
    this.clearMainSelection();
    this.setMainSelection('.work');

    var fn = function () {
      that.showTitleBar();
      that.hideSortBar();
      that.setContext(context);
      that.showPosition();

      $('.context-bar .position .current').text(pos);
      $('.context-bar .position .total').text(total);
      that.showContext();

      that.setFilterByHashbang(hashbang);
      that.setDisableYScroll(true);
    };

    if (window.grundini.isMobile) {
      fn();
    }
    else {
      this.hideIllustrationNav(fn);
    }
  };

  NavigationMenuView.prototype.setThumbnailsView = function (hashbang, context) {
    var that = this;

    this.clearViewClasses();
    $('#app').addClass('thumbsView');

    this.reloadOnResize = false;
    //this.setStageTopPos('64px');
    this.setViewClass('stage-thumbsview');
    this.hideNextPreviousButtons();
    //this.showShareControls();
    this.hideShareControls();
    this.hideFooter();
    this.clearMainSelection();
    this.setMainSelection('.work');

    var fn = function () {
      that.hideSortBar();
      that.setContext(context);
      that.hidePosition();
      that.showContext();

      that.hideTitleBar();
      that.setFilterByHashbang(hashbang);
      that.setDisableYScroll(false);
      that.clearTouchEventHandlers();
    };

    if (window.grundini.isMobile) {
      fn();
    }
    else {
      this.hideIllustrationNav(fn);
    }


  };

  NavigationMenuView.prototype.setTagGroupsView = function (hashbang) {
    var that = this;

    this.clearViewClasses();
    $('#app').addClass('tagsGroupView');

    this.reloadOnResize = false;
    //this.setStageTopPos('64px');
    this.setViewClass('stage-taggroupsview');
    this.hideNextPreviousButtons();
    this.hideShareControls();
    this.hideFooter();
    this.clearMainSelection();
    this.setMainSelection('.work');
    this.showIllustrationNav(function () {
      that.hideTitleBar();
      that.hideSortBar();
      that.hideContext();
      that.hidePosition();

      that.setFilterByHashbang(hashbang);
      that.setDisableYScroll(false);
      that.clearTouchEventHandlers();
    });

  };


  return NavigationMenuView;
// ************************************************************************ private functions

  function addClientCrumb(client, vw) {
    var container = $('.title-bar');

    if ($('.title-bar .client-crumb').length && $('.title-bar .client-crumb').length > 0) {
//      $('.title-bar .client-crumb').replace($(clientCrumbHtml));

      $('.title-bar .client-crumb a').text(client.title);
    }
    else {
      var clientCrumbHtml = Mustache.to_html(vw.getTemplate('client-crumb'), client);
      container.append(clientCrumbHtml)
    }


  }

  function addProjectCrumb(vw, project, client) {
    var container = $('.title-bar');
    var projectCrumbHtml;

    if (client) {
      projectCrumbHtml = Mustache.to_html(vw.getTemplate('client-project-crumb'), {client: client, project: project});
    } else {
      projectCrumbHtml = Mustache.to_html(vw.getTemplate('project-crumb'), project);
    }

    if ($('.title-bar .project-crumb').length && $('.title-bar .project-crumb').length > 0) {
      $('.title-bar .project-crumb a').text(project.title);
    }
    else {
      container.append(projectCrumbHtml);
    }

  }

  function addTagCrumb(tag) {
    var container = $('.title-bar .active');
    var tagCrumbHtml = Mustache.to_html(this.getTemplate('tag-crumb'), tag);

    container.append(tagCrumbHtml);
  }

});