define(['core/core'], function(core) {

  function View() {
    this.renderFn = null;
    this.templateCache = {};
    this.elCache = {};
    this.viewModel = null;
  }

  //could be overriden
  View.prototype.appRootClass = 'body';

  View.prototype.declareElms = function(elms) {
    if (elms) {
      //declare elements
      for (var i = 0; i < elms.length; i++) {
        if (elms[i].name && elms[i].selector) {//duck typing
          this.setElm(elms[i].name, elms[i].selector)
        }
      }
    }
  };

  View.prototype.setViewClas = function(cls){
    this.navView.setViewClass(cls);
  };

  View.prototype.setRenderFn = function(fn) {
    this.renderFn = fn;
  };

  View.prototype.setViewModel = function(vm) {
    this.viewModel = vm;
  };

  View.prototype.render = function() {
    if (!this.renderFn) {
      throw new ['no render function specified for ', this.constructor].join('');
    }

    this.renderFn();
  };

  View.prototype.getTemplate = function(name, fresh) {
    //TODO : jquery dependency :  remove ? 
    if (!this.templateCache[name] || fresh) {
      this.templateCache[name] = $(['script[type="text/x-mustache-template"]#', name].join('')).html();
    }

    return this.templateCache[name];
  };

  View.prototype.getElm = function(name, fresh) {
    //TODO : jquery dependency :  remove ?

    if (!this.elCache[name]) {
      throw ['element with name ', name, ' not found'].join('')
    }

    if (fresh) {
      this.elCache[name].el = $(this.elCache[name].selector);
    }

    return this.elCache[name].el;
  };

  View.prototype.setElm = function(name, selector) {
    this.elCache[name] = {  name : name,
      selector : selector,
      el : $(selector)};

    return this.elCache[name].el;
  };

  View.prototype.findByHref = function(hashbang, parent){
    var els  = null;
    parent = parent || $(document);
    els = $(parent).find('a[href="'+hashbang+'"]');

    return els;
  };

  View.prototype.bind = function(hooks) {
    /*
     [{
     elmName : 'myel',
     events  : ['click']
     , fn      : functionX
     }]
     */
    //TODO - not sure about the View.bind function -
    // it's using the live() jQuery call and it can get 'added twice'
    for (var i = 0; i < hooks.length; i++) {
      if (this.elCache[hooks[i].name].el) {
        for (var ii = 0; ii < hooks[i].events.length; ii++) {
          //TODO : look at .on in jquery 1.7
          $(this.elCache[hooks[i].name].el).live(hooks[i].events[ii], hooks[i].fn)
        }
      }
    }
  };

  View.prototype.getHashbang = function(){
   return window.location.hash;
  };

  View.prototype.updateHashbang = function(hashbang){
    window.location.hash = hashbang;
  };

  View.prototype.setTheme = function(cls){
    $(this.appRootClass).removeClass();
    $(this.appRootClass).addClass(cls);
  };

  
  core.register('mvc', 'View', View);

  return View;
  
});

