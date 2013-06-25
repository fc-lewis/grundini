define(['core/core',
  'mvc/views/ContentView',
  'libs/grundini-homepage-tags'], function (core, ContentView, TagsLoader) {


  var contentHeight,
      pageHeight,
      index = 0,
      lastScrollPos = 0,
      reachedEnd = false;

  var tags;


function HomeView(viewModel, navView) {
    contentHeight = 800;
    pageHeight = document.documentElement.clientHeight;
    index = 1,
    lastScrollPos = 0,
    reachedEnd = false;

    ContentView.call(this, viewModel, navView);

    this.addEventHandlers();

    tags = new TagsLoader({
      tags : viewModel.getModel().getTags(),
      pageSize: 2
    });

  }

  core.inherit(HomeView, ContentView);

  var homeViewProto = HomeView.prototype;

  homeViewProto.getTagsHtml = function (tags) {
    var i = 0, html = '';
    for (i; i < tags.length; i++) {
      html += '<a href="#!/thumbs/tagged/' + tags[i].slug + '" class="square no-img">' +
        '<span class="text-container">' + tags[i].content + '</span>' +
        '</a>';
    }

    return html;
  };

  homeViewProto.getScrollDirection = function (thisScrollPos, lastScrollPos) {
    return thisScrollPos > lastScrollPos ? 'down' : 'up';
  };

  homeViewProto.onScrollDown = function () {
    //console.log('document.height = %s', document.height);
    var thisScrollPos = $(window).scrollTop(),
      currentPage = [];

    if (this.getScrollDirection(thisScrollPos, lastScrollPos) === 'down') {
      if ((contentHeight - pageHeight - thisScrollPos) < 235) {
        currentPage = tags.getPage(index);

        if (!currentPage.length || currentPage.length === 0) {
          reachedEnd = true;
          $('.grid').append('<span>END</span>');

          $(document).off('scroll.addtags');
        } else {
          $('.grid').append(this.getTagsHtml(currentPage));
          index += 1;
        }
      }
    }
  };

  homeViewProto.addEventHandlers = function () {
    var that = this;

    $(document).on('scroll.addtags', function () {
      that.onScrollDown()
    });
  };

  return HomeView;
});