define([], function() {

  function ClientsViewModel(modelData) {
    var viewModelData;

    this.update = function() {
      viewModelData = {clients : modelData};
    };
    
    this.getModelData = function(){
      return viewModelData;
    }    
  }

  var cvmp = ClientsViewModel.prototype;

  return ClientsViewModel;
}); 