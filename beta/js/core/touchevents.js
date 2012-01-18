define([], function() {
  
  //hack to ignore older version of ie
  if (!document.addEventListener){
    return;
  }
  
  var elmStore = {};
  var threshold = 0.5;

  //Touch Target
  function TT(elms, selector) {

    this.getElms = function() {
      return elms;
    };

    this.getSelector = function() {
      return selector;
    };

    regElmsInStore(elms, selector);
  }

  
  TT.prototype.isSupported = function(){
    return document.querySelectorAll && document.body.addEventListener;
  };
  
  TT.prototype.on = function(event, fn) {

    var elms = this.getElms();
    for (var i = 0; i < elms.length; i++) {

      addTouchListener(elms[i], event, fn);
    }

    return this;
  };

  TT.prototype.off = function(event, fn) {
    var elms = this.getElms();
    for (var i = 0; i < elms.length; i++) {
      removeTouchListener(elms[i], event, fn);
    }

    return this;
  };

  TT.prototype.clear = function(event) {
    var elms = this.getElms();
    for (var i = 0; i < elms.length; i++) {
      clearTouchListeners(elms[i], event);
    }

    return this;
  };


  function tt(selector) {
    var elms = document.querySelectorAll(selector),
            ttElms;

    if (elms && elms.length) {
      elms = regElmsInStore(elms, selector);
      ttElms = new TT(elms, selector);
    }
    

    return ttElms;
  }

  function regElmsInStore(elms, selector) {
    var ts, elmRef, thisTtId;

    if (elms.length > 0) {
      for (var i = 0; i < elms.length; i++) {
        if (!elms[i]._ttid) {

          ts = new Date().getTime();
          thisTtId = getTtId(ts, i);

          if (elmStore[thisTtId]) {
            throw ['element with id ', thisTtId, ' already found in touch targets store'].join('');
          }

//          elmRef = { elm : elms[i], selectors : [], ttid : ts};
          elmRef = { selectors : [], ttid : ts};
          elmRef.selectors.push(selector);
          elms[i]._ttid = thisTtId;
          elmStore[thisTtId] = elmRef;

          elms[i].addEventListener('touchstart', onTouchStart, false);
          elms[i].addEventListener('touchend', onTouchEnd, false);
//TODO: add touchmove support
//          elms[i].addEventListener('touchmove', onTouchEnd, false);
        }
        else {
          elmRef = elmStore[elms[i]._ttid]

          if (!elmRef) {
            throw ['could not find element reference in touch target store with ID ', elms[i]._ttid].join('');
          }

          //TODO : check for event listeners and add if they've been removed.

          if (!elmRef.selectors.indexOf(selector)) {
            elmRef.selectors.push(selector);
          }
        }
      }
    }


    return elms;
  }

//  window.tt = tt;
  return tt;

// -------------------------------------------- private functions

  function getTtId(id, index) {
    return ['ttid_',id, '_' + index].join('');
  }

  function setDirectionX(t) {
    t.distance = t.distance || {};
    t.direction = t.direction || {};

    t.distance.x = t.end.x - t.start.x;
    t.direction.x = 'static';

    if (t.distance.x > 1) {
      t.direction.x = 'east';
    } else if (t.distance.x < 0) {
      t.direction.x = 'west';
    }
  }

  function setDirectionY(t) {
    t.distance = t.distance || {};
    t.direction = t.direction || {};

    t.distance.y = t.end.y - t.start.y;
    t.direction.y = 'static';

    if (t.distance.y > 1) {
      t.direction.y = 'south';
    } else if (t.distance.y < 0) {
      t.direction.y = 'north';
    }
  }

  function onTouchStart(event) {
    var tParams = {};
    tParams.target = {};
    tParams.target.width = event.target.offsetWidth;
    tParams.target.height = event.target.offsetHeight;

    tParams.start = {};
    tParams.start.ts = new Date().getTime();


    event.target.touchParams = tParams;

    if (event.touches.length === 1) {
      var touch = event.touches[0];

      tParams.start.x = touch.pageX;
      tParams.start.y = touch.pageY;
    }
  }

  function onTouchEnd(event) {
    var tParams = event.target.touchParams;
    tParams.end = {};
    tParams.end.ts = new Date().getTime()

    if (event.changedTouches.length === 1) {
      var touch = event.changedTouches[0];

      tParams.end.x = touch.pageX;
      tParams.end.y = touch.pageY;

      setDirectionX(tParams);
      setDirectionY(tParams);
    }

    tParams.end.ts = new Date().getTime();
    tParams.duration = tParams.end.ts - tParams.start.ts;

    tParams.velocity = {};
    tParams.velocity.x = tParams.distance.x / tParams.duration;
    tParams.velocity.y = tParams.distance.y / tParams.duration;

    handleTouchEvent(this, tParams)
  }

  function handleTouchEvent(elm, tPs) {

    if (tPs.velocity.x > threshold || (tPs.velocity.x * -1) > threshold) {
      fireTouchEvent(elm, 'flick', tPs);
    }
    else if (tPs.velocity.y > threshold || (tPs.velocity.y * -1) > threshold) {
      fireTouchEvent(elm, 'flick', tPs);
    } else {
      fireTouchEvent(elm, 'drag', tPs);
    }
  }

  function displayTouchType(type) {
    clearOutput();
    output(type);
  }

  function addTouchListener(elm, event, fn) {
    var eventName = 'ontouch' + event;

    elmStore[elm._ttid][eventName] = elmStore[elm._ttid][eventName] || new Array();
    elmStore[elm._ttid][eventName].push(fn);
  }

  function removeTouchListener(elm, event, fn) {
    var eventName = 'ontouch' + event;

    for (var i = 0; i < elmStore[elm._ttid][eventName].length; i++) {
      if (fn == elmStore[elm._ttid][eventName][i]) {
        delete elmStore[elm._ttid][eventName][i];
      }
    }
  }

  function clearTouchListeners(elm, event) {
    var eventName = 'ontouch' + event;
    elmStore[elm._ttid][eventName] = [];
  }

  function fireTouchEvent(elm, event, tParams) {
    var eventName = 'ontouch' + event;

    for (var i = 0; i < elmStore[elm._ttid][eventName].length; i++) {
      elmStore[elm._ttid][eventName][i](tParams);
    }
  }

});

