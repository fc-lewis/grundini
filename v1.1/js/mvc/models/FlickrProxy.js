define([],
        function() {

          function FlickrProxy(domain) {
            this.getDomainPfx = function() {
              return ['http://',domain,'/'].join('');
            };
          }

          FlickrProxy.prototype.getClients = function(fn) {
            $.getJSON([this.getDomainPfx(),'grundini/flickr/clients.json?callback=?'].join(''), fn);
          };

          FlickrProxy.prototype.getProjects = function(fn) {
            $.getJSON([this.getDomainPfx(),'grundini/flickr/projects.json?callback=?'].join(''), fn);
          };

          FlickrProxy.prototype.getAllProjects = function(fn) {
            $.getJSON([this.getDomainPfx(),'grundini/flickr/userprojects.json?callback=?'].join(''), fn);
          };

          FlickrProxy.prototype.getTags = function(fn) {
            $.getJSON([this.getDomainPfx(),'grundini/flickr/tags.json?callback=?'].join(''), fn);
          };

          FlickrProxy.prototype.getIllustrations = function(fn, projectId) {
            var url;

            if (projectId) {
              url = [this.getDomainPfx(),'grundini/flickr/illustrations.json?projectflickrid=',projectId,'&callback=?'].join('');
            }
            else {
              url = [this.getDomainPfx(),'grundini/flickr/illustrations.json?callback=?'].join('');
            }

            if (window.cache) {

              var item = window.cache.get(url);

              if (item) {
                fn(item);
                return;
              }
            }
            $.getJSON(url, function(data) {
              if (window.cache) {
                window.cache.put(url, data);
              }
              fn(data)
            });
          };

          FlickrProxy.prototype.getIllustrationsForTag = function(fn, tagSlug) {
            var url;

            url = [this.getDomainPfx(),'grundini/flickr/illustrations.json?tags=',tagSlug,'&callback=?'].join('');

            if (window.cache) {
              var item = window.cache.get(url);

              if (item) {
                fn(item);
                return;
              }
            }
            $.getJSON(url, function(data) {
              if (window.cache) {
                window.cache.put(url, data);
              }
              fn(data)
            });
          };

          FlickrProxy.prototype.getIllustration = function(fn, flickrId) {

            var url = [this.getDomainPfx(),'grundini/flickr/illustration.json?illustrationId=',flickrId,'&callback=?'].join('');

            if (window.cache) {
              var item = window.cache.get(url);
              if (item) {
                fn(item);
                return;
              }
            }
            $.getJSON(url, function(data) {
              if (window.cache) {
                window.cache.put(url, data);
              }
              fn(data)
            });
          };

          var fp = new FlickrProxy(window.location.host+':8111');

          return fp;


        });
