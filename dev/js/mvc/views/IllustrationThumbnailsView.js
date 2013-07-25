define(['core/core',
  'mvc/views/mvc.View',
  'mvc/mixins/sharing'], function(core, mvcView, sharing) {

  function IllustrationThumbnailsView(viewModel) {
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

  core.inherit(IllustrationThumbnailsView, mvcView);

  var itvP = IllustrationThumbnailsView.prototype;

  itvP.onAlphabeticalOrderClick = function() {
  };
  itvP.onDateOrderClick = function() {
  };

  itvP.render = function() {
    var viewModel, vmData, thumnailsHtml,
            navView = this.getNavView().navView, title,
            hb = this.getHashbang(),
            context = { contextItem : []};

    viewModel = this.getViewModel();
    viewModel.update();
    vmData = viewModel.getModelData();

    thumnailsHtml = Mustache.to_html(this.getTemplate('thumbnails'), vmData.container);

    $('.stage').html(thumnailsHtml);

    if (vmData.viewType === 'PROJECT') {
      title = vmData.container.title;

      if(vmData.client){
        context.contextItem.push({
          title : vmData.client.title,
          value : '#!/client/' + vmData.client.slug,
          seperator : '&nbsp;/'
        });
      }else{
        context.contextItem.push({
          title : 'Projects',
          value : '#!/projects',
          seperator : '&nbsp;/'
        });
      }

      context.contextItem.push({
        title : vmData.container.title,
        value : ['#!/thumbs/project/', vmData.container.slug].join('')
      });
    }

    if (vmData.viewType === 'TAG') {
      title = vmData.container.value;
      document.title = 'Grundini :' + title;

      if(vmData.container.group){
        context.contextItem.push({
          title : vmData.container.group.pluralize(),
          value : ['#!/grouped-by/', vmData.container.group].join(''),
          seperator : '&nbsp;/'
        });
      }

      context.contextItem.push({
        title : vmData.container.value,
        value : ['#!/thumbs/tagged/', vmData.container.slug].join('')
      });
    }

    this.setTheme('theme-light');
    $('.illustration-thumbnails').removeClass('off');

    updateShareButtons(window.location.href, title, vmData.container.illustrations[0].thumbnail);

    navView.setThumbnailsView(hb, context);
    navView.showStage();

  };

  $.extend(IllustrationThumbnailsView, sharing);

  IllustrationThumbnailsView.bindSharing({
    toggleSelector : '#shareControls .sharethis-toggle',
    menuSelector: '#shareControls',
    toggleClass : 'open'
  });

  return IllustrationThumbnailsView;

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