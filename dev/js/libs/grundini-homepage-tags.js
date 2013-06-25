define([], function () {
  var Tags,
    tproto;


  Tags = function (opts) {
    this.init(opts);
  };

  tproto = Tags.prototype;

  tproto.isReady = false;

  tproto.init = function (opts) {
    var that = this;

    this.pageSize = opts.pageSize;
    this.url = opts.url;

    if(opts.tags){
      that.tags = opts.tags;
      that.isReady = true;

      if (opts.onReadyFn) {
        opts.onReadyFn(that);
      }

      return;
    }


    $.getJSON(this.url,
      function (data) {
        that.tags = data.data.tags;
        that.isReady = true;

        if (opts.onReadyFn) {
          opts.onReadyFn(that);
        }

      });
  }

  tproto.getPage = function (pageNo) {
    // 1 = 1 - 10
    // 2 = 11 - 20
    // 3 = 21 - 20
    // ...

    var skip = (pageNo - 1) * this.pageSize;

    if (!this.isReady) {
      return false;
    }

    if (skip > this.tags.length) {
      return [];
    }

    if ((skip + this.pageSize) > this.tags.length) {
      return this.tags.slice(skip);
    }

    return this.tags.slice(skip, (skip + this.pageSize));
  }

  //window.Tags = Tags;
  return Tags;
});
