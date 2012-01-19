define([], function() {

  function IllustrationBrowserViewModel(model, viewType, client) {
    var viewModelData = {};
    var pos = 0;

    this.illustrationCache = [];
    this.ready = false;
    imageSizeToLoad = getImageSizeToLoad(200);

    this.getModel = function() {
      return model;
    };

    this.getViewType = function() {
      return viewType;
    };

    this.getPos = function() {
      return pos;
    };
    this.setPos = function(val) {
      pos = val;
    };

    this.getClient = function(){
      return client;
    };

    this.getImageSizeToLoad = function() {
      return imageSizeToLoad;
    };

    this.setImageSizeToLoad = function(smallestScreenDimension) {
      imageSizeToLoad = getImageSizeToLoad(smallestScreenDimension);
    };

    this.getModelData = function() {
      return viewModelData;
    };

    this.updateIllustration = function() {
      viewModelData.illustration = model.getSelectedIllustration();
    };
  }

  var ibvmP = IllustrationBrowserViewModel.prototype;

  ibvmP.getViewSlug = function() {
    if (this.getViewType() === 'TAG') {
      return 'tagged'
    }

    return 'project';
  };

  ibvmP.getSectionSlug = function() {
    //TODO: rafactor and tidy!

    vmd = this.getModelData();

    if (this.getViewType() === 'PROJECT') {
      return vmd.project.slug;
    }

    return vmd.tag.slug
  };

  ibvmP.setPosBySlug = function(slug) {
    if (this.ready) {
      this.updateIllustration();
    } else {
      this.update();
    }

    var pos = findPosBySlug(this.getModelData().illustrations, slug);
    if (pos > -1) {
      this.setPos(pos);
    }
  };

  ibvmP.getCurrentIllustration = function(cb) {
    var pos = this.getPos(),
            that = this,
            model = this.getModel(),
            viewModelData = this.getModelData(),
            parts;

    if (this.illustrationCache[pos]) {
      cb(this.illustrationCache[pos]);
      return;
    }

    var illstr = model.getIllustration(viewModelData.illustrations[pos].slug, function(selectedIllstr) {
      for (var i = 0; i < selectedIllstr.tag.length; i++) {
        selectedIllstr.tag[i].link = '/#!/thumbs/tagged/' + selectedIllstr.tag[i].slug;

        if(selectedIllstr.tag[i].content.indexOf('|') > -1){
          parts = selectedIllstr.tag[i].content.split('|');
          selectedIllstr.tag[i].content = parts[1];
        }

      }

      that.illustrationCache[pos] = selectedIllstr;

      cb(selectedIllstr);
    });
  };

  ibvmP.update = function() {
    var viewModelData = this.getModelData(),
            model = this.getModel(),
            src;


    viewModelData.viewType = this.getViewType();

    if (viewModelData.viewType === 'PROJECT') {
      viewModelData.project = model.getSelectedProject();
      viewModelData.client = this.getClient();
      viewModelData.illustrations = removePictorgramFromIllustrations(model.getSelectedIllustrations(),
              viewModelData.project.primaryId);
    } else {
      viewModelData.tag = model.getSelectedTag();
      viewModelData.illustrations = model.getSelectedIllustrations();
    }

    this.illustrationCache = new Array(viewModelData.illustrations.length);
    this.updateIllustration();
    viewModelData.srcs = [];

    for (var i = 0; i < viewModelData.illustrations.length; i++) {
      src = viewModelData.illustrations[i].imageurl[this.getImageSizeToLoad()];
      viewModelData.illustrations[i].toFit = src;
      viewModelData.srcs.push(src);
    }

    viewModelData.viewSlug = this.getViewSlug();
    viewModelData.sectionSlug = this.getSectionSlug();

    this.ready = true;
  };

  return IllustrationBrowserViewModel;

// **************************************** private functions
  function removePictorgramFromIllustrations(ills, pictogramId) {
    return ills.filter(function(val, i, arr) {
      return val.flickrId !== pictogramId;
    })
  }

  function findPosBySlug(ills, iSlug) {
    var ipos = -1;
    for (var i = 0; i < ills.length; i++) {
      if (ills[i].slug === iSlug) {
        ipos = i;
        break;
      }
    }
    return ipos;
  }

  function getImageSizeToLoad(smallestStageDimension) {
    if (smallestStageDimension < 400) {
      return 'small';
    }

    if (smallestStageDimension < 600) {
      return 'medium500'
    }

    if (smallestStageDimension < 800) {
      return 'medium640'
    }

    return 'large';
  }
}); 