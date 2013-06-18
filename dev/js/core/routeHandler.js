define(['libs/routemap'], function() {

  function routeHandler(routes){
    var url = document.location.href.replace(/\/?#!\//, '/');
    if(_gaq){
      _gaq.push(['_trackPageview', url]);
    }

    routes.handler();
  }

  function mapRoutes(grundiniApp, callback) {

    var routes = window.RouteMap, rules, rule;

    routes.prefix('#!');

    rules = {
      "default"                             :      {route: '/', method: 'displayHome'},
      "home"                                :      {route: '/home', method: 'displayHome'},
      "about"                               :      {route: '/about', method: 'displayAbout'},
      "contact"                             :      {route: '/contact', method: 'displayContact'},
      "downloads"                           :      {route: '/downloads', method: 'displayDownloads'},
      
      "browseProjects"                      :      {route: '/projects/', method: 'listProjects'},
      "browseClients"                       :      {route: '/client/', method: 'listClients'},
      "browseProjectsForClient"             :      {route: '/client/:client', method: 'listProjects'},
      "browseTagsByTagGroup"                :      {route: '/grouped-by/:group', method: 'listTagsForGroup'},

      "browseIllustrationsByClientProject"  :      {route: '/client/:client/:project/:illustration?', method: 'displayProjectIllustrationBrowser'},
      "browseIllustrationsByProject"        :      {route: '/project/:project/:illustration?', method: 'displayProjectIllustrationBrowser'},
      "projectIllustrationThumbs"           :      {route: '/thumbs/project/:project', method: 'displayThumbnailsForProject'},
      "clientProjectIllustrationThumbs"     :      {route: '/thumbs/client-project/:client/:project', method: 'displayThumbnailsForProject'},
      "browseIllustrationsByTag"            :      {route: '/tagged/:tag/:illustration?', method: 'displayTagIllustrationBrowser'},
      "taggedIllustrationThumbs"            :      {route: '/thumbs/tagged/:tag', method: 'displayThumbnailsForTag'}      
    };

    routes.context(grundiniApp.routeHandler);

    for (rule in rules) {
      if (rules.hasOwnProperty(rule)) {
        routes.add(rules[rule]);
      }
    }

    $(window).bind('hashchange', function(){routeHandler(routes);});

    //calls the route on the current url
    routes.handler();
    
    if(callback){
      callback();  
    }
    
  }

  return mapRoutes;
});

