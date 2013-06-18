define([], function() {

  function IllustrationThumbsViewModel(model, viewType, client) {
    var viewModelData;

    viewType = viewType || 'PROJECT';
    
    this.update = function() {
      var ills, project, tag, illustrations;

      if(viewType === 'PROJECT'){
        project = model.getSelectedProject();
        ills = removePictorgramFromIllustrations(model.getSelectedIllustrations(), project.primaryId);
        project.illustrations = getThumbnails(ills, project, 'project');

        viewModelData = {container : project, viewType : viewType};

        if(client){
          viewModelData.client = client;
        }
      }
      else{
        tag = model.getSelectedTag();
        ills = model.getSelectedIllustrations();
        tag.illustrations = getThumbnails(ills, tag, 'tagged');
                  
        viewModelData = {container : tag, viewType : viewType};                
      }
    };

    this.getModelData = function() {
      return viewModelData;
    }
  }

  var itvmdl = IllustrationThumbsViewModel.prototype;

  return IllustrationThumbsViewModel;

// **************************************** private functions
  function getThumbnails(is, item, viewString) {
    var thumbs;

    thumbs = is.map(function(val, i, arr) {
      var illThmb = {};

      illThmb.link = ['#!/',viewString,'/',item.slug,'/',val.slug].join('');
      illThmb.thumbnail = val.imageurl.medium500;

      return illThmb;
    });

    return thumbs;
  }

  function removePictorgramFromIllustrations(ills, pictogramId) {
    return ills.filter(function(val, i, arr) {
      return val.flickrId !== pictogramId;
    })
  }

}); 