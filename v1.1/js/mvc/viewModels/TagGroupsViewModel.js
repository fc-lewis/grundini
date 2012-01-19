define([], function() {
  
  function TagGroupsViewModel(model, selectedGroup){
    var viewModelData = {};
    
    this.getModelData = function() {
      return viewModelData;
    };

    this.sortTagsBy = function(tags, attribute, desc){
     var asc = desc ? 1 : -1;

     tags = tags.sort(function(a, b) {

        if (a[attribute] < b[attribute]) {
          return asc;
        }

        if (a[attribute] > b[attribute]) {
          return asc * -1;
        }

        return 0;
      });
    };
    
    this.update = function(){
      viewModelData.selectedGroup = selectedGroup;
      viewModelData.groups = model.getTagGroups();
      viewModelData.tags = model.getTags();
      viewModelData.tagsForGroup = this.getTagsForGroup(selectedGroup);

      if(selectedGroup === 'year'){
        this.sortTagsBy(viewModelData.tagsForGroup, 'value', true);
      }
    };
    
    this.getTagsForGroup = function(group){
      if(!viewModelData.tags){
        return [];
      }
      
      return viewModelData.tags.filter(function(val, i, arr){
        return val.group === group;
      }); 
    };
  }
  
  var tgvmP = TagGroupsViewModel.prototype;

  return TagGroupsViewModel;
}); 