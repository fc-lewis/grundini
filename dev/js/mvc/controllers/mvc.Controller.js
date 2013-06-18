define(['core/core'], function(core) {

  function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.registeredViews = {};
  }

  Controller.prototype.getHrefParts = function(anc) {
    return $(anc).attr('href').split('/');
  };

  Controller.prototype.getLastHrefPart = function(anc) {
    var parts = this.getHrefParts(anc);
    var len = parts.length;
    return parts[len - 1];
  };

  Controller.prototype.setView = function(uniqueName, view, cfg, hooks) {
    if (this.registeredViews[uniqueName]) {
      this.view = this.registeredViews[uniqueName];
    } else {

      this.view = new view(cfg);
      if (hooks) {
        this.view.bind(hooks);
      }

      this.registeredViews[uniqueName] = this.view;
    }
  };

  core.register('mvc', 'Controller', Controller);

  return Controller;

});

