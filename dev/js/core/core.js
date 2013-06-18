define(function() {

  function register(ns, name, fnOrObj, root) {
    var parts = ns.split('.');
    var ns = root || window;

    for (var i = 0; i < parts.length; i++) {
      ns[parts[i]] = ns[parts[i]] || {};
      ns = ns[parts[i]];
    }

    if(ns[name]){
      throw ['namespace clash for ', name].join('');
    }
    
    ns[name] = fnOrObj;

    return ns;
  }

  var core = register('core', 'register', register);

  function inherit(fn, baseFn) {
    fn.prototype = new baseFn();
    fn.prototype.constructor = fn;

    return fn;
  }

  register('core', 'inherit', inherit);

  function toSlug(s){
    var slug;
    slug = s.replace(/[^a-z0-9A-Z]/g, '-');
    slug = slug.replace(/-+/g, '-').toLowerCase();
    return slug;
  }

  register('core.strings', 'toSlug', toSlug);

  return core;
});

