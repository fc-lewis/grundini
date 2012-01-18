define(['js/core/core','js/mvc/models/FlickrProxy'],

        function(core, flickrProxy) {

          function GrundiniAppModel() {
            var clients, projects, tags, tagGroups;
            var onReadyListeners = [];

            var selectedProject, selectedIllustrations,
                    selectedClient, selectedIllustration, selectedIllstIndex,  illustrationState,
                    selectedTag, selectedTagGroup;

            this.listeners = {};


            this.load = function() {
              var that = this;

              doGetAllProjects(that, function() {
                doGetClients(that, function() {
                  doGetTags(that, function() {

                    for (var i = 0; i < onReadyListeners.length; i++) {
                      onReadyListeners[i]();
                    }

                  })
                })
              });
            };

            this.isReady = function() {
              return projects && clients && tags;
            };

            this.onReady = function(cb) {
              onReadyListeners.push(cb);
            };

            this.getClients = function() {
              return clients;
            };
            this.setClients = function(val) {
              clients = val;
            };

            this.getProjects = function() {
              return projects;
            };
            this.setAllProjects = function(val) {
              projects = val;
            };

            this.getTags = function() {
              return tags;
            };
            this.setTags = function(val) {
              tags = val;
            };

            this.getTagGroups = function() {
              if (tagGroups) {
                return tagGroups;
              }

              var tags = this.getTags(),
                      tagGroups = [],
                      groupVal,
                      tgExists;

              if (tags) {

                tags.forEach(function(tagVal, tagIndex, tagsArr) {
                  groupVal = tagVal.group;
                  if (groupVal) {
                    tgExists = tagGroups.some(function(tagGroupVal, tagGroupIdx, TagGroupsArr) {
                      return tagGroupVal.slug === tagVal.group;
                    });

                    if (!tgExists) {
                      tagGroups.push({
                        "slug": core.strings.toSlug(tagVal.group),
                        "value" : tagVal.group
                      });
                    }
                  }
                });

              }

            };

            this.getSelectedClient = function() {
              return selectedClient;
            };
            this.setSelectedClient = function(client) {
              selectedClient = client;
            };

            this.getSelectedProject = function() {
              return selectedProject;
            };
            this.setSelectedProject = function(project) {
              selectedProject = project;
            };

            this.getSelectedIllustrations = function() {
              return selectedIllustrations;
            };
            this.setSelectedIllustrations = function(ills) {
              selectedIllustrations = ills;
            };

            this.getSelectedIllustration = function() {
              return selectedIllustration;
            };
            this.setSelectedIllustration = function(val) {
              selectedIllustration = val;
            };

            this.getSelectedIllustrationIndex = function() {
              var illSlug, ills, index;

              if (!this.getSelectedIllustration()) {
                //throw 'no illustration selected when trying to find index';
                return 0; // default
              }

              illSlug = this.getSelectedIllustration().slug;
              ills = this.getSelectedIllustrations();
              index = -1;

              for (var i = 0; i < ills.length; i++) {
                if (ills[i].slug === illSlug) {
                  index = i;
                  break;
                }
              }

              return index;
            };

            this.getIllustrationState = function(val) {
              return illustrationState;
            };
            this.setIllustrationState = function(val) {
              illustrationState = val;
            };

            this.getSelectedTagGroup = function() {
              return selectedTagGroup;
            };
            this.setSelectedTagGroup = function(tagGroupSlug) {
              selectedTagGroup = findTagGroupBySlug();
            };

            this.getSelectedTag = function() {
              return selectedTag;
            };
            this.setSelectedTag = function(tag) {
              selectedTag = tag;
            };

          }

          var gamP = GrundiniAppModel.prototype;

          gamP.setTagsForGroup = function(group, allTags) {
          };

          gamP.getIllustrationsForProject = function(project, fn) {
            var that = this;

            if (!project.slug || !project.flickrId) {
              throw "specified project is not a valid project [missing a slug value or a flickr id]";
            }

            flickrProxy.getIllustrations(function(response) {

              if (checkResult(response) && response.data.illustrations) {
                that.setSelectedIllustrations(response.data.illustrations);

                if (fn) {
                  fn(response.data.illustrations);
                }
                return;
              }

              throw "flickr response failed while getting illustrations";

            }, project.flickrId);
          };

          gamP.getIllustrationsForTag = function(tag, fn) {
            var that = this;

            if (!tag || !tag.slug) {
              throw "specified project is not a valid project [missing a slug value or a flickr id]";
            }

            flickrProxy.getIllustrationsForTag(function(response) {

              if (checkResult(response) && response.data.illustrations) {
                that.setSelectedIllustrations(response.data.illustrations);

                if (fn) {
                  fn(response.data.illustrations);
                }
                return;
              }

              throw "flickr response failed while getting illustrations";

            }, tag.content);

          };

          gamP.getIllustration = function(illustrationSlug, fn) {
            var illBrief, that = this;
            if (!illustrationSlug) {
              throw "no illustrationSlug specified when trying to get Illustration [GrundiniAppModel.getIllustration]";
            }

            illBrief = this.findIllustrationBySlug(illustrationSlug, this.getSelectedIllustrations());

            if (!illBrief) {
              throw "no illustration could be found within the current set with a slug value of " + illustrationSlug;
            }

            if (!illBrief.flickrId) {
              throw "the selected illustration doesnt have an associated Id: " + illustrationSlug;
            }

            flickrProxy.getIllustration(function(response) {
              if (checkResult(response) && response.data.illustration) {
                that.setSelectedIllustration(response.data.illustration);

                if (fn) {
                  fn(response.data.illustration);
                }
                return;
              }

              throw "flickr response failed while getting a single illustration";
            }, illBrief.flickrId);
          };

          gamP.findProjectBySlug = function(projectSlug, projects) {
            //http://www.tutorialspoint.com/javascript/array_map.htm
            // ecmascript reference page 136
            var ps = projects.filter(function(val, i, array) {
              return val && val.slug && val.slug === projectSlug;
            });

            if (ps.length === 1) {
              return ps[0];
            }

            if (ps.length > 1) {
              throw "more than one project found with a slug value of: " + projectSlug;
            }

            return null;
          };

          gamP.findTagBySlug = function(tagSlug, tags) {
            //http://www.tutorialspoint.com/javascript/array_map.htm
            // ecmascript reference page 136
            var ts = tags.filter(function(val, i, array) {
              return val && val.slug && val.slug === tagSlug;
            });

            if (ts.length === 1) {
              return ts[0];
            }

            if (ts.length > 1) {
              throw "more than one project found with a slug value of: " + tagSlug;
            }

            return null;
          };

          gamP.findIllustrationBySlug = function(illustrationSlug, illustrations) {
            //TODO : not DRY : see above
            var ils;

            ils = illustrations.filter(function(val, i, array) {
              return val && val.slug && val.slug === illustrationSlug;
            });

            if (ils.length === 1) {
              return ils[0];
            }

            if (ils.length > 1) {
              throw "more than one illustration found with a slug value of: " + illustrationSlug;
            }

            return null;
          };

          gamP.findClientBySlug = function(clientSlug, clients) {
            var client;

            for (var i = 0; i < clients.length; i++) {
              if (clients[i].slug && clients[i].slug === clientSlug) {
                client = clients[i];
                break;
              }
            }

            return client;
          };

          gamP.getNextIllustration = function() {
            var i, ills;
            ills = this.getSelectedIllustrations();
            i = this.getSelectedIllustrationIndex() || 0;

            if (i !== ills.length - 1) {
              return ills[i + 1];
            }

            return undefined;
          };

          gamP.getPreviousIllustration = function() {
            var i, ills;
            ills = this.getSelectedIllustrations();
            i = this.getSelectedIllustrationIndex() || 0;

            if (i !== 0) {
              return ills[i - 1];
            }

            return undefined;
          };

          gamP.getFullProjectsForClient = function(client) {
            //TODO: inefficient - needs refactoring.
            var projs = [];

            for (var i = 0; i < client.projects.length; i++) {
              projs.push(this.findProjectBySlug(client.projects[i].slug, this.getProjects()));
            }

            return projs;
          };

          return GrundiniAppModel;

// ************************************************** private functions          
          function checkResult(response) {
            return response.result &&
                    response.result === 'success' &&
                    response.data;
          }

          function doGetAllProjects(gaMdl, fn) {
            flickrProxy.getAllProjects(function(val) {
              if (checkResult(val) && val.data.allProjects) {
                //allProjects = val.data.allProjects;
                gaMdl.setAllProjects(val.data.allProjects);
                if (fn) {
                  fn();
                }
              }
              else {
                throw "An error occurred while getting all of the projects";
              }
            });
          }

          function doGetClients(gaMdl, fn) {
            flickrProxy.getClients(function(val) {
              if (checkResult(val) && val.data.clients) {
                //clients = val.data.clients;
                gaMdl.setClients(val.data.clients);
                if (fn) {
                  fn();
                }

              }
              else {
                throw "An error occurred while loading - getting clients";
              }
            });
          }

          function doGetTags(gaMdl, fn) {
            flickrProxy.getTags(function(val) {
              if (checkResult(val) && val.data.tags) {
                gaMdl.setTags(val.data.tags);
                //tags = val.data.tags;
                if (fn) {
                  fn();
                }
                return;
              }
              else {
                throw "An error occurred while loading - getting tags";
              }

            });
          }


        }

);