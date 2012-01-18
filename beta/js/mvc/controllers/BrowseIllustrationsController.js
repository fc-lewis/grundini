define(['js/core/core',
  'js/mvc/controllers/mvc.Controller',
  'js/mvc/views/ProjectsView',
  'js/mvc/viewModels/ProjectsViewModel',
  'js/mvc/views/ClientsView',
  'js/mvc/viewModels/ClientsViewModel',
  'js/mvc/views/IllustrationThumbnailsView',
  'js/mvc/viewModels/IllustrationThumbsViewModel',
  'js/mvc/views/IllustrationBrowserView',
  'js/mvc/viewModels/IllustrationBrowserViewModel',
  'js/mvc/views/TagGroupsView',
  'js/mvc/viewModels/TagGroupsViewModel'],

        function(core, mvcController, ProjectsVw, ProjectsVM, ClientsVw, ClientsVM, IllustrThumbsVw, IllustrThumbsVM, IllustrBrowserVw, IllustrBrowserVM, TagGroupsVw, TagGroupsVM) {

          var loadTimeOut;

          function BrowseIllustrationsController(model) {

            var view, selectedIllustration, partialViews;

            this.getModel = function() {
              return model;
            };

            this.getView = function() {
              return view;
            };
            this.setView = function(val) {
              view = val;
            };

            this.getSelectedIllustration = function() {
              return selectedIllustration;
            };
            this.setSelectedIllustration = function(val) {
              selectedIllustration = val;
            };

            this.getNavView = function() {
              return partialViews;
            };
            this.setPartialViews = function(val) {
              partialViews = val;
            };
          }

          core.inherit(BrowseIllustrationsController, mvcController);

          var bicP = BrowseIllustrationsController.prototype;

          bicP.displayClients = function(navView) {
            var vw, cvm, cs, mdl = this.getModel();
            cs = mdl.getClients();
            cvm = new ClientsVM(cs);
            vw = new ClientsVw(cvm);
            this.setView(vw);

            vw.setPartialViews(this.getNavView());
            navView.update();

            vw.render();
          };

          bicP.displayProjects = function(navView, clientSlug) {
            var vw, pvm, mdl = this.getModel(), that = this, projects, clients;

            if (clientSlug) {
              clients = mdl.getClients();
              viewModelCtx = pvm = new ProjectsVM(clients, clientSlug, mdl);
              vw = new ProjectsVw(pvm);
              that.setView(vw);
              vw.setPartialViews(this.getNavView());
              vw.render();
            } else {
              projects = mdl.getProjects();
              pvm = new ProjectsVM(projects, clientSlug, mdl);
              vw = new ProjectsVw(pvm);
              that.setView(vw);
              vw.setPartialViews(this.getNavView());
              vw.render();
            }

          };

          bicP.displayTagsForGroup = function(navView, groupSlug) {
            var vw, tgvm, mdl = this.getModel();

            tgvm = new TagGroupsVM(mdl, groupSlug);
            vw = new TagGroupsVw(tgvm);
            this.setView(vw);
            vw.setPartialViews(this.getNavView());

            vw.render();
          };

          bicP.displayThumbnailsForProject = function(navView, projectSlug, clientSlug) {
            var vw, ivm, mdl = this.getModel(), that = this;
            var project, ps, client;

            ps = mdl.getProjects();
            project = mdl.findProjectBySlug(projectSlug, ps);
            mdl.setSelectedProject(project);

            if(clientSlug){
              client = mdl.findClientBySlug(clientSlug, mdl.getClients());
            }

            mdl.getIllustrationsForProject(project, function(illustrations) {
              mdl.setSelectedIllustrations(illustrations);

              ivm = new IllustrThumbsVM(mdl, 'PROJECT', client);
              vw = new IllustrThumbsVw(ivm);
              that.setView(vw);
              vw.setPartialViews(that.getNavView());
              vw.render();

            })

          };

          bicP.displayThumbnailsForTag = function(navView, tagSlug) {
            var vw, ivm, mdl = this.getModel(), that = this;
            var tag;

            ts = mdl.getTags();
            tag = mdl.findTagBySlug(tagSlug, ts);
            mdl.setSelectedTag(tag);

            mdl.getIllustrationsForTag(tag, function(illustrations) {
              mdl.setSelectedIllustrations(illustrations);

              ivm = new IllustrThumbsVM(mdl, 'TAG');
              vw = new IllustrThumbsVw(ivm);
              that.setView(vw);
              vw.setPartialViews(that.getNavView());
              vw.render();
            })

          };

          bicP.displayProjectIllustrationBrowser = function(navView, projectSlug, illustrationSlug, clientSlug) {
            var vw, ivm, mdl = this.getModel(), that = this;
            var project, ps, illustration, pos, viewCtx, viewModelCtx, client;


            if (doLoadView(this, mdl, projectSlug)) {
              ps = mdl.getProjects();
              project = mdl.findProjectBySlug(projectSlug, ps);
              mdl.setSelectedProject(project);

              if (clientSlug) {
                client = mdl.findClientBySlug(clientSlug, mdl.getClients());
                mdl.setSelectedClient(client);
              }

              mdl.getIllustrationsForProject(project, function(illustrations) {
                mdl.setSelectedIllustrations(illustrations);

                if (!illustrationSlug) {
                  illustrationSlug = illustrations[0].slug;
                }

                illustration = mdl.findIllustrationBySlug(illustrationSlug, illustrations);
                mdl.setSelectedIllustration(illustration);

                viewModelCtx = ivm = new IllustrBrowserVM(mdl, 'PROJECT', client);
                if (illustrationSlug) {
                  ivm.setPosBySlug(illustrationSlug);
                }

                vw = new IllustrBrowserVw(ivm);
                that.setView(vw);
                vw.setPartialViews(that.getNavView());
                vw.render();
              })
            }
            else {
              //TODO: tidy up and push into main view
              viewCtx = that.getView();
              viewModelCtx = viewCtx.getViewModel();
              viewModelCtx.setPosBySlug(illustrationSlug);
              pos = viewModelCtx.getPos();
              viewCtx.updateLinks();
              viewCtx.setPartialViews(that.getNavView());
              that.getNavView().navView.hideSortBar();
              viewCtx.toggleNextPrevious(viewCtx.$next,
                      viewCtx.$prev, pos, viewModelCtx.getModelData().illustrations.length);
              viewCtx.moveToItem(pos);
            }
          };

          bicP.displayTagggedIllustrationsBrowser = function(navView, tagSlug, illustrationSlug) {
            var vw, ivm, mdl = this.getModel(), that = this;
            var tag, ts, illustration, illstrs, pos, viewCtx, viewModelCtx;


            if (doLoadViewTags(this, mdl, tagSlug)) {
              ts = mdl.getTags();
              tag = mdl.findTagBySlug(tagSlug, ts);

              if(!tag){
                //TODO: what to do if the tag is not found?
              }

              mdl.setSelectedTag(tag);

              mdl.getIllustrationsForTag(tag, function(illustrations) {
                mdl.setSelectedIllustrations(illustrations);

                if (!illustrationSlug) {
                  illustrationSlug = illustrations[0].slug;
                }

                illustration = mdl.findIllustrationBySlug(illustrationSlug, illustrations);
                mdl.setSelectedIllustration(illustration);
                viewModelCtx = ivm = new IllustrBrowserVM(mdl, 'TAG');
                if (illustrationSlug) {
                  ivm.setPosBySlug(illustrationSlug);
                }

                vw = new IllustrBrowserVw(ivm);
                vw.setPartialViews(that.getNavView());
                that.setView(vw);

                vw.render();
              })
            }
            else {
              //TODO: tidy up and push into main view
              viewCtx = that.getView();
              viewModelCtx = viewCtx.getViewModel();
              viewModelCtx.setPosBySlug(illustrationSlug);
              pos = viewModelCtx.getPos();
              viewCtx.updateLinks();
              viewCtx.toggleNextPrevious(viewCtx.$next,
                      viewCtx.$prev, pos, viewModelCtx.getModelData().illustrations.length);
//              that.getNavView().navView.hideSortBar();
              viewCtx.moveToItem(pos);
            }
          };

          return BrowseIllustrationsController;

//****************************************************** private functions          
          function doLoadView(ctrlr, mdl, projectSlug) {
            var currentProject = mdl.getSelectedProject(),
                    viewCtx;

            viewCtx = ctrlr.getView();

            return (viewCtx === undefined) ||
                    viewCtx.constructor !== IllustrBrowserVw ||
                    currentProject.slug !== projectSlug;
          }

          //TODO: refactor as not DRY
          function doLoadViewTags(ctrlr, mdl, tagSlug) {
            var currentTag = mdl.getSelectedTag(),
                    viewCtx;

            viewCtx = ctrlr.getView();

            return returnVal =  (viewCtx === undefined) ||
                    viewCtx.constructor !== IllustrBrowserVw ||
                    currentTag == undefined ||
                    currentTag.slug !== tagSlug;
            
            
          }

        });