define([], function() {

  function ProjectsViewModel(projectsOrClients, clientSlug, model) {
    var viewModelData, client;

    this.update = function() {
      if(clientSlug){
        //get the projects for the specified client >>>
        client = getClient(clientSlug, projectsOrClients);
        projectsOrClients = model.getFullProjectsForClient(client);
        setLinkToProjectsForClient(projectsOrClients, client);
      }
      else{
        projectsOrClients = model.getProjects();
        setLinkToProjects(projectsOrClients);
      }
      
      viewModelData = {projects : projectsOrClients};
      if(client){
        viewModelData.client = client;
      }
      //throw "PROJECTS VIEW MODEL - UPDATE,  NOT IMPLEMENTED"
    };
    
    this.getModelData = function(){
      return viewModelData;
    }
  }

  var pvmdl = ProjectsViewModel.prototype;

  return ProjectsViewModel;

  //******************************************************** private methods
  
  function getProjectsForClient(clientSlug, md){
    var ps;
    
    for(var i = 0; i < md.length; i++){
      if(md[i].slug === clientSlug){
        ps = md[i].projects;
        break;
      }
    }
    
    return ps;
  }
  
  function getClient(clientSlug, md){
    var client;
    
    for(var i = 0; i < md.length; i++){
      if(md[i].slug === clientSlug){
        client = md[i];
        break;
      }
    }
    
    return client;
  }  
  
  function setLinkToProjectsForClient(projectsOrClients, client){
    for(var i = 0; i < projectsOrClients.length; i++){
      projectsOrClients[i].projectlink = ['/#!/client/',client.slug,'/',projectsOrClients[i].slug].join(''); 
    }
  }
  
  function setLinkToProjects(projectsOrClients, client){
    for(var i = 0; i < projectsOrClients.length; i++){
      projectsOrClients[i].projectlink = ['/#!/project/',projectsOrClients[i].slug].join(''); 
    }
  }  
    
}); 