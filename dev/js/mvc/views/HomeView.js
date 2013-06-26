define(['core/core',
  'mvc/views/ContentView',
  'libs/grundini-homepage-tags',
  'libs/grundini-utils'],
  function (core, ContentView, TagsLoader, utils) {


  var contentHeight,
      pageHeight,
      index = 0,
      lastScrollPos = 0,
      reachedEnd = false,
      tags,
      devicePageSize = utils.isMobile ? 6 : 10;


function HomeView(viewModel, navView) {
    contentHeight = $(document).outerHeight();
    pageHeight = document.documentElement.clientHeight;
    index = 1,
    lastScrollPos = 0,
    reachedEnd = false;

    ContentView.call(this, viewModel, navView);

    this.addEventHandlers();

    tags = new TagsLoader({
      tags : viewModel.getModel().getTags(),
      pageSize: devicePageSize
    });

  }

  core.inherit(HomeView, ContentView);

  var homeViewProto = HomeView.prototype;

  homeViewProto.getTagsHtml = function (tags) {
    var i = 0, html = '';
    for (i; i < tags.length; i++) {
      html += '<a href="#!/thumbs/tagged/' + tags[i].slug + '" class="square no-img fade noopacity">' +
        '<span class="text-container">' + tags[i].content + '</span>' +
        '</a>';
    }

    return html;
  };

  homeViewProto.getScrollDirection = function (thisScrollPos, lastScrollPos) {
    return thisScrollPos > lastScrollPos ? 'down' : 'up';
  };

  homeViewProto.getScrollDistance = function (thisScrollPos, lastScrollPos) {
    var distance = lastScrollPos - thisScrollPos;

    return distance < 0 ? distance * -1 : distance;
  };


  homeViewProto.onScrollDown = function () {
    var thisScrollPos = $(window).scrollTop(),
      currentPage = [],
      contentHeight = $(document).outerHeight(),
      $newTags;

    if (this.getScrollDirection(thisScrollPos, lastScrollPos) === 'down') {
      if ((contentHeight - pageHeight - thisScrollPos) < 200) {

        currentPage = tags.getPage(index);

        if (!currentPage.length || currentPage.length === 0) {
          reachedEnd = true;
          $('.grid').append('<span class="square no-img grundini-blue">END!</span>');

          $(document).off('scroll.addtags');
        } else {
          $newTags = $(this.getTagsHtml(currentPage));

          $('.grid').append($newTags);

          setTimeout(function(){
            $newTags.removeClass('noopacity');
          }, 1);

          index += 1;
        }
      }
    }

    lastScrollPos = thisScrollPos;
  };

  homeViewProto.addEventHandlers = function () {
    var that = this;

    $(document).on('scroll.addtags', function () {
      that.onScrollDown()
    });
  };

  return HomeView;
});