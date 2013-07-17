define(['core/core',
<<<<<<< HEAD
  'mvc/views/mvc.View'], function(core, mvcView) {
=======
  'mvc/views/mvc.View'
], function(core, mvcView) {
>>>>>>> parent of 89e1a2e... incorrect commit!

  var loadDelayMs = 400;
  var maxIllWidth = 1000;
  var vpWidth;
  var preloadedFsImage;

  function IllustrationBrowserView(viewModel) {
    var that = this, partialViews;

    console.log(viewModel);

    this.loadingIll = false;

    this.getViewModel = function() {
      return viewModel;
    };
    this.getNavView = function() {
      return partialViews.navView;
    };
    this.setPartialViews = function(val) {
      partialViews = val;
    };

    this.$next = $('#app>div.controls .button.next');
    this.$prev = $('#app>div.controls .button.previous');

    this.$illustrations = $('.illustrationBrowser .illustrations');

    //hooks
    function nextClickHandler(e) {
      e.preventDefault();
      that.onNextClick($(this).attr('href'), $(this));
    }

    function previousClickHandler(e) {
      e.preventDefault();
      that.onPreviousClick($(this).attr('href'), $(this));
    }

    function flickHandler(tps, e) {
      if (tps.direction.x === 'west') {
        that.$next.trigger('click');
      } else if (tps.direction.x === 'east') {
        that.$prev.trigger('click');
      }
    }

    $('.fullsize-image .loading-container').off('click');
    $('.fullsize-image .loading-container').on('click', function(e) {
      e.preventDefault();
      $('.stage').fadeIn('fast');
      $('.fullsize-image').fadeOut('fast');
    });

    //reinstate handlers
    this.$next.off('click');
    this.$prev.off('click');
    this.$next.on('click', nextClickHandler);
    this.$prev.on('click', previousClickHandler);

    this.setTouchEvents = function() {
      this.getNavView().addTouchEventHandler(flickHandler)
    };

    $(document).off('keydown');
    $(document).on('keydown', function(e) {
      var vmdl = that.getViewModel();
      //TODO: override if we are in a text box, or somewhere that requires text entry 

      switch (e.keyCode) {
        case 37://previous
          if (vmdl.getPos() > 0) {
            e.preventDefault();
            that.$prev.trigger('click');
          }
          break;
        case 39://next
          if (vmdl.getPos() < vmdl.getModelData().illustrations.length - 1) {
            e.preventDefault();
            that.$next.trigger('click');
          }
          break;
        default:
          return true;
      }
    });
    $(window).off('resize');
    $(window).off('resizeEnd');

    $(window).resize(function() {
      if (!that.getNavView().reloadOnResize) {
        return;
      }

      $('.stage').hide();
      if (this.resizeTO) {
        clearTimeout(this.resizeTO);
      }

      this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
      }, 750);
    });

    $(window).on('resizeEnd', function() {
      that.render();
      console.log($(window).width());
      $('.stage').show('fast');

      setTimeout(function(){
        // Hide the address bar!
        window.scrollTo(0, 1);
      }, 1000);

    });
  }





  core.inherit(IllustrationBrowserView, mvcView);

  var ibvP = IllustrationBrowserView.prototype;

  ibvP.updateLinks = function() {
    var nextLink, prevLink, pos, vmd;
    vmd = this.getViewModel().getModelData();
    pos = this.getViewModel().getPos();

    if (pos > 0) {
      prevLink = ['!/',vmd.viewSlug,'/',vmd.sectionSlug,'/',vmd.illustrations[pos - 1].slug].join('');
    }

    if (pos < vmd.illustrations.length - 1) {
      nextLink = ['!/',vmd.viewSlug,'/',vmd.sectionSlug,'/',vmd.illustrations[pos + 1].slug].join('');
    }

    this.$next.attr('href', nextLink);
    this.$prev.attr('href', prevLink);
  };

  ibvP.onNextClick = function(link, $nxt) {
    this.updateHashbang(link);
  };

  ibvP.onPreviousClick = function(link, $prev) {
    this.updateHashbang(link);
  };

  ibvP.moveToPos = function(xpos, cb) {
    if (cb) {
      $('.illustrationBrowser .illustrations').animate({left : xpos}, 250, 'swing', cb);
      //css transitions>
//      $('.illustrationBrowser .illustrations').css('left', xpos + 'px');
//      clearTimeout(loadTO);
//      loadTO = setTimeout(cb, 260);
    }
    else {
      $('.illustrationBrowser .illustrations').animate({left : xpos}, 250, 'swing');
      //css transitions>
//      $('.illustrationBrowser .illustrations').css('left', xpos + 'px');
    }

  };

  ibvP.moveToItem = function(pos) {
<<<<<<< HEAD
    var that = this, tagsHtml;
    var navView = this.getNavView();
    var ills = this.getViewModel().getModelData().illustrations;
    var illLen = ills.length;
    var fullsizeSrc = $('.illustrationBrowser .illustrations li:eq(' + pos + ') a').attr('data-fullsize');
=======
    var that, tagsHtml, navView, ills, illLen, fullsizeSrc;
    that = this
    navView = this.getNavView();
    ills = this.getViewModel().getModelData().illustrations;
    illLen = ills.length;
    fullsizeSrc = $('.illustrationBrowser .illustrations li:eq(' + pos + ') a').attr('data-fullsize');
    
>>>>>>> parent of 89e1a2e... incorrect commit!
    //set the image src for this image and each one either side

    if (pos > 0) {
      $('.illustrationBrowser .illustrations li:eq(' + (pos - 1) + ') img').attr('src', ills[pos - 1].toFit);
    }

    $('.illustrationBrowser .illustrations li:eq(' + pos + ') img').attr('src', ills[pos].toFit);
    $('.controls a.zoomimage').attr('href', $('.illustrationBrowser .illustrations li:eq(' + pos + ') img').attr('data-fullsize'));


    if (pos < illLen - 1 && ills[pos + 1]) {
      $('.illustrationBrowser .illustrations li:eq(' + (pos + 1) + ') img').attr('src', ills[pos + 1].toFit);
    }

    //TODO: SHOW SOME LOADING INFO
    $('.position .current').text(pos + 1);

    //$('.title-bar').slideDown('fast').text('loading...');
//    navView.showTitleBar();
    navView.setTitle('...');

    //HACK: not sure why there is a need for an extra 4 pixels.
    this.moveToPos((pos * (vpWidth + 4) ) * -1, function() {

      if (that.loadIllTO) {
        clearTimeout(that.loadIllTO);
      }

      that.loadIllTO = setTimeout(function() {
        that.getViewModel().getCurrentIllustration(function(ill) {
          tagsHtml = Mustache.to_html(that.getTemplate('tags'), ill);
          $('.footer-bar .tags').html(tagsHtml);

          document.title = 'Grundini :' + ill.title;
          navView.setTitle(ill.title);

          updateShareButtons(window.location.href, ill.title, ill.imageUrl.small);

        });
      }, loadDelayMs);
    });
  };

  ibvP.onZoomClick = function(e) {
    var src, href, that = this;
    e.preventDefault();

    $('.loading-container').removeClass('loaded');
    src = $('.fullsize-image img').attr('src');
    href = $(this).attr('href');

    $('.stage').fadeOut('fast');
    $('.fullsize-image').fadeIn('fast');

    if (src !== href) {
      $('.fullsize-image img').hide();
      preloadedFsImage = new Image();
      preloadedFsImage.src = href;
      preloadedFsImage.onload = function() {
        $('.fullsize-image img').attr('src', $(that).attr('href'));
        $('.fullsize-image img').show();
        $('.loading-container').addClass('loaded');
        return;
      };
    }
    else {
      $('.loading-container').addClass('loaded');
    }
  };

  ibvP.render = function() {
    //TODO: a lot of this should be in the view model :(
    var stageX = Math.round($(window).width() * 0.8), stageY = Math.round($(window).height() * 0.8);
//    var stageX = Math.round($('.stage').width()), stageY = Math.round($('.stage').height());

    var stageMin;
    var navView = this.getNavView();
    var hb = this.getHashbang();
    var context = {contextItem:[]};

    stageMin = stageX < stageY ? stageX : stageY;

    var viewModel, vmData, browserHtml, that = this, illBrwsrWidth, xMargin, pos;

    viewModel = this.getViewModel();

    viewModel.setImageSizeToLoad(stageMin);
    viewModel.update();
    vmData = viewModel.getModelData();

    if (vmData.viewType === 'TAG') {
      if (vmData.tag.group) {
        context.contextItem.push({
          title : vmData.tag.group.pluralize(),
          value : ['#!/grouped-by/', vmData.tag.group].join(''),
           seperator : '&nbsp;/'
        });
      }

      context.contextItem.push({
        title : vmData.tag.value,
        value : ['#!/thumbs/tagged/', vmData.tag.slug].join('')
      });
    }

    if (vmData.viewType === 'PROJECT') {

      if (vmData.client) {

        context.contextItem.push({
          title : 'Clients',
          value : '#!/client',
          seperator : '&nbsp;/'
        });

        context.contextItem.push({
          title : vmData.client.title,
          value : '#!/client/' + vmData.client.slug,
          seperator : '&nbsp;/'
        });
      } else {
        context.contextItem.push({
          title : 'Projects',
          value : '#!/projects',
          seperator : '&nbsp;/'
        });
      }

      if (vmData.project) {
        if (vmData.client) {
          context.contextItem.push({
            title : vmData.project.title,
            value : ['#!/thumbs/client-project/', vmData.client.slug,'/', vmData.project.slug].join('')
          });
        }
        else {
          context.contextItem.push({
            title : vmData.project.title,
            value : ['#!/thumbs/project/', vmData.project.slug].join('')
          });
        }
      }
    }

    vpWidth = $(window).width();
    xMargin = vpWidth - maxIllWidth;
    pos = viewModel.getPos();

    this.setTheme('theme-light');

    navView.setBrowserView(hb, context, viewModel.getPos() + 1, vmData.illustrations.length);

    $('.sprite.overview').attr('href', context.contextItem[context.contextItem.length -1].value);

//    imagePreLoader(vmData.srcs, function() {
    browserHtml = Mustache.to_html(that.getTemplate('illustration-browser'), vmData);

    $('.stage').html(browserHtml);

    illBrwsrWidth = getIllustrationsWidth(vmData, vpWidth);

    $('.illustrationBrowser .illustrations').dequeue();
    $('.illustrationBrowser .illustrations').css('width', [illBrwsrWidth.toString(), 'px'].join(''));
    $('.illustrationBrowser .illustrations li').css('width', vpWidth + 'px');
    $('.illustrationBrowser.off').removeClass('off');
    $('.illustration.off').removeClass('off');

    that.updateLinks();
    that.toggleNextPrevious(that.$next, that.$prev, pos, vmData.illustrations.length);

    that.moveToItem(pos);

    $('.fullsize-link').off('click');
    $('.fullsize-link').on('click', that.onZoomClick);

    $('.footer-bar').show();
    $('#app>.controls.off').removeClass('off');

    that.setTouchEvents();

    navView.showStage();

    setTimeout(function () {
      window.scrollTo(0, 1);
    }, 1000);

    $('.stage').css('height', '100%');
//    }, 3);
  };

  ibvP.toggleNextPrevious = function($nxt, $prev, pos, illsLen) {

    if (pos < illsLen - 1) {
      $nxt.removeClass('off');
    }
    else {
      $nxt.addClass('off');
    }

    if (pos > 0) {
      $prev.removeClass('off');
    }
    else {
      $prev.addClass('off');
    }
  };

  return IllustrationBrowserView;

// ****************************************************** private functions
  function imagePreLoader(srcArray, onLoadedCb, threshold) {
    var images = [],
            img,
            loaded = 0,
            loadThreshold,
            loadEventFired = false;

    if (!threshold || threshold > srcArray.length - 1) {
      loadThreshold = srcArray.length - 1;
    }
    else {
      loadThreshold = threshold;
    }

    function imageLoaded(e) {
      loaded += 1;
      if (loaded >= loadThreshold && !loadEventFired) {
        loadEventFired = true;
        onLoadedCb(images);
      }
      if (loaded >= loadThreshold && !loadEventFired) {
        loadEventFired = true;
        onLoadedCb(images);
      }
    }

    for (var i = 0; i < srcArray.length; i++) {
      img = new Image();
      img.src = srcArray[i];
      img.onload = imageLoaded;

      images.push(img);
    }
  }

  function getIllustrationsWidth(vmData, vpWidth) {
    //HACK - not sure why I need to add on the 500 - thinking its box model stuff extra padding etc
    return (vmData.illustrations.length * vpWidth) + 500;
  }

  function updateShareButtons(location, title, imgsrc) {
    $('.share').hide();
    $('.sharethis').html('');

    var services = [
      {type : 'facebook',
        image : './css/img/social-facebook.png'},
      {type : 'twitter',
        image : './css/img/social-twitter.png'},
      {type : 'email',
        image : './css/img/social-email.png'},
      {type : 'sharethis',
        image : './css/img/social-more.png'}
    ];
    var svc, elm;

    for (var i = 0; i < services.length; i++) {
      svc = services[i];
      elm = $(['<span class="st_',svc.type,'_custom" st_url="',location,'" st_title="Grundini : ',title,': " st_image="',imgsrc,'"><span class="sharethis-item ',services[i].type,'"></span></span>'].join(''));

      $('.sharethis').append(elm);
    }

    stButtons.locateElements();

    $('.share').show();
  }
});