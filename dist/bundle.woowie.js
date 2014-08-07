(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/* globals module, require, console */

(function(global, undefined) {

  'use strict';

  var version = '0.0.1',
    arr = [],
    document = global.document,
    push = arr.push,
    each = arr.forEach,
    adnEach,
    w = function(selector) {
      return new Woowie(selector).result;
    };

  var Promise = require('mpromise');

  function Woowie(selector, obj) {

    var isClassSelector = selector.indexOf('.') > -1 && selector.indexOf('.') === 0,
      isIdSelector = selector.indexOf('#') > -1 && selector.indexOf('#') === 0;

    if (isClassSelector) {
      //this.result = queryAll(selector);
      this.result = document.querySelectorAll(selector);
    }
    else if (isIdSelector) {
      this.result = document.querySelector(selector);
    }
    else if (selector !== '') {
      this.result = document.querySelectorAll(selector);
    }

    if (obj) {
      this.result = obj;
    }
  }

  w.each = function(adnobj, callback) {
    each.call(adnobj.result, callback);
  };

  w.version = function() {
    return version;
  };

  w.to = function(item) {
    return new Woowie('', item);
  };

  w.ajax = function(options) {
    var url = options.url,
      type = options.type,
      contentType = options.contentType || 'text',
      data = options.data,
      //success = options.success,
      //error = options.error,
      request;

    var promise = new Promise();

    request = new XMLHttpRequest();

    try {
      request.open(type, url, true);
    }
    catch(openError) {
      console.log('openError');
      promise.reject(openError);
    }

    request.setRequestHeader('Content-Type', contentType);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        promise.fulfill(request.responseText);
        //success(request.responseText);
      }
      else {
        console.log('Error');
        promise.reject(new Error('There was an error'));
        //error(new Error('There was an error'));
      }
    };

    request.onerror = function() {
      console.log('Connection Error');
      promise.reject(new Error('Connection error'));
      //error(new Error('Connection error'));
    };

    try {
      request.send();
    }
    catch(networkError) {
      console.log('networkError');
      promise.reject(new Error(networkError));
      //error(networkError);
    }

    return promise;

  };

  Woowie.prototype = {
    constructor: Woowie,
    selector: "",
    length: 0,
    each: function(callback) {
      each.call(this.result, callback);
    },
    text: function(text) {
      if (text) {
        this.result.textContent = text;
        return;
      }

      return this.result.textContent;
    }
  };

  window.w = w;

  return w;

}(window, undefined));

},{"mpromise":4}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],4:[function(require,module,exports){
module.exports = exports = require('./lib/promise');

},{"./lib/promise":5}],5:[function(require,module,exports){
(function (process){
'use strict';

/*!
 * Module dependencies.
 */

var slice = function (arr, start, end) {
  return Array.prototype.slice.call(arr, start, end)
};
var EventEmitter = require('events').EventEmitter;

/**
 * Promise constructor.
 *
 * _NOTE: The success and failure event names can be overridden by setting `Promise.SUCCESS` and `Promise.FAILURE` respectively._
 *
 * @param {Function} back a function that accepts `fn(err, ...){}` as signature
 * @inherits NodeJS EventEmitter http://nodejs.org/api/events.html#events_class_events_eventemitter
 * @event `reject`: Emits when the promise is rejected (event name may be overridden)
 * @event `fulfill`: Emits when the promise is fulfilled (event name may be overridden)
 * @api public
 */

function Promise(back) {
  EventEmitter.call(this);

  this.emitted = {};
  this.ended = false;
  if ('function' == typeof back)
    this.onResolve(back);
}

/*!
 * event names
 */

Promise.SUCCESS = 'fulfill';
Promise.FAILURE = 'reject';

/*!
 * Inherits from EventEmitter.
 */

Promise.prototype.__proto__ = EventEmitter.prototype;

/**
 * Adds `listener` to the `event`.
 *
 * If `event` is either the success or failure event and the event has already been emitted, the`listener` is called immediately and passed the results of the original emitted event.
 *
 * @param {String} event
 * @param {Function} callback
 * @return {Promise} this
 * @api public
 */

Promise.prototype.on = function (event, callback) {
  if (this.emitted[event])
    callback.apply(this, this.emitted[event]);
  else
    EventEmitter.prototype.on.call(this, event, callback);

  return this;
}

/**
 * Keeps track of emitted events to run them on `on`.
 *
 * @api private
 */

Promise.prototype.emit = function (event) {
  // ensures a promise can't be fulfill() or reject() more than once
  var success = this.constructor.SUCCESS;
  var failure = this.constructor.FAILURE;

  if (event == success || event == failure) {
    if (this.emitted[success] || this.emitted[failure]) {
      return this;
    }
    this.emitted[event] = slice(arguments, 1);
  }

  return EventEmitter.prototype.emit.apply(this, arguments);
}

/**
 * Fulfills this promise with passed arguments.
 *
 * If this promise has already been fulfilled or rejected, no action is taken.
 *
 * @api public
 */

Promise.prototype.fulfill = function () {
  var args = slice(arguments);
  return this.emit.apply(this, [this.constructor.SUCCESS].concat(args));
}

/**
 * Rejects this promise with `reason`.
 *
 * If this promise has already been fulfilled or rejected, no action is taken.
 *
 * @api public
 * @param {Object|String} reason
 * @return {Promise} this
 */

Promise.prototype.reject = function (reason) {
  if (this.ended && !this.hasRejectListeners()) throw reason;
  return this.emit(this.constructor.FAILURE, reason);
}

/**
 * Resolves this promise to a rejected state if `err` is passed or
 * fulfilled state if no `err` is passed.
 *
 * @param {Error} [err] error or null
 * @param {Object} [val] value to fulfill the promise with
 * @api public
 */

Promise.prototype.resolve = function (err, val) {
  if (err) return this.reject(err);
  return this.fulfill(val);
}

/**
 * Adds a listener to the SUCCESS event.
 *
 * @return {Promise} this
 * @api public
 */

Promise.prototype.onFulfill = function (fn) {
  if (!fn) return this;
  if ('function' != typeof fn) throw new TypeError("fn should be a function");
  return this.on(this.constructor.SUCCESS, fn);
}

Promise.prototype.hasRejectListeners = function () {
  return this.listeners(this.constructor.FAILURE).length > 0;
};
/**
 * Adds a listener to the FAILURE event.
 *
 * @return {Promise} this
 * @api public
 */

Promise.prototype.onReject = function (fn) {
  if (!fn) return this;
  if ('function' != typeof fn) throw new TypeError("fn should be a function");
  return this.on(this.constructor.FAILURE, fn);
}

/**
 * Adds a single function as a listener to both SUCCESS and FAILURE.
 *
 * It will be executed with traditional node.js argument position:
 * function (err, args...) {}
 *
 * @param {Function} fn
 * @return {Promise} this
 */

Promise.prototype.onResolve = function (fn) {
  if (!fn) return this;
  if ('function' != typeof fn) throw new TypeError("fn should be a function");

  this.on(this.constructor.FAILURE, function (err) {
    fn.apply(this, [err]);
  });

  this.on(this.constructor.SUCCESS, function () {
    var args = slice(arguments);
    fn.apply(this, [null].concat(args));
  });

  return this;
}

/**
 * Creates a new promise and returns it. If `onFulfill` or
 * `onReject` are passed, they are added as SUCCESS/ERROR callbacks
 * to this promise after the next tick.
 *
 * Conforms to [promises/A+](https://github.com/promises-aplus/promises-spec) specification. Read for more detail how to use this method.
 *
 * ####Example:
 *
 *     var p = new Promise;
 *     p.then(function (arg) {
 *       return arg + 1;
 *     }).then(function (arg) {
 *       throw new Error(arg + ' is an error!');
 *     }).then(null, function (err) {
 *       assert.ok(err instanceof Error);
 *       assert.equal('2 is an error', err.message);
 *     });
 *     p.complete(1);
 *
 * @see promises-A+ https://github.com/promises-aplus/promises-spec
 * @param {Function} onFulFill
 * @param {Function} [onReject]
 * @return {Promise} newPromise
 */

Promise.prototype.then = function (onFulfill, onReject) {
  var self = this
    , retPromise = new Promise;

  if ('function' == typeof onReject) {
    self.onReject(handler(retPromise, onReject));
  } else {
    self.onReject(retPromise.reject.bind(retPromise));
  }
  if ('function' == typeof onFulfill) {
    self.onFulfill(handler(retPromise, onFulfill));
  } else {
    self.onFulfill(retPromise.fulfill.bind(retPromise));
  }

  return retPromise;
};


function handler(retPromise, fn) {
  return function handler() {
    var args = arguments;
    process.nextTick(
      function in_the_handler() {
        if (retPromise.domain && retPromise.domain !== process.domain) retPromise.domain.enter();
        var x;

        try {
          x = fn.apply(undefined, args);
        } catch (err) {
          return retPromise.reject(err);
        }

        resolve(retPromise, x);
        return;
      }
    );
  }
}

function resolve(promise, x) {
  var then;
  var type;
  var done;
  var reject_;
  var resolve_;

  type = typeof x;
  if ('undefined' == type) {
    return promise.fulfill(x);
  }

  if (promise === x) {
    return promise.reject(new TypeError("promise and x are the same"));
  }

  if (null != x) {

    if ('object' == type || 'function' == type) {
      try {
        then = x.then;
      } catch (err) {
        return promise.reject(err);
      }

      if ('function' == typeof then) {
        try {
          resolve_ = function () {var args = slice(arguments); resolve.apply(this, [promise].concat(args));};
          reject_ = promise.reject.bind(promise);
          done = false;
          return then.call(
            x
            , function fulfill() {
              if (done) return;
              done = true;
              return resolve_.apply(this, arguments);
            }
            , function reject() {
              if (done) return;
              done = true;
              return reject_.apply(this, arguments);
            })
        } catch (err) {
          if (done) return;
          done = true;
          if (promise.ended) throw err;
          return promise.reject(err);
        }
      }
    }
  }

  promise.fulfill(x);
}

/**
 * Signifies that this promise was the last in a chain of `then()s`: if a handler passed to the call to `then` which produced this promise throws, the exception will go uncaught.
 *
 * ####Example:
 *
 *     var p = new Promise;
 *     p.then(function(){ throw new Error('shucks') });
 *     setTimeout(function () {
 *       p.fulfill();
 *       // error was caught and swallowed by the promise returned from
 *       // p.then(). we either have to always register handlers on
 *       // the returned promises or we can do the following...
 *     }, 10);
 *
 *     // this time we use .end() which prevents catching thrown errors
 *     var p = new Promise;
 *     var p2 = p.then(function(){ throw new Error('shucks') }).end(); // <--
 *     setTimeout(function () {
 *       p.fulfill(); // throws "shucks"
 *     }, 10);
 *
 * @api public
 * @param {Function} [onReject]
 * @return {Promise} this
 */

Promise.prototype.end = function (onReject) {
  this.onReject(onReject);
  this.ended = true;
  return this;
};


/**
 * A debug utility function that adds handlers to a promise that will log some output to the `console`
 *
 * ####Example:
 *
 *     var p = new Promise;
 *     p.then(function(){ throw new Error('shucks') });
 *     setTimeout(function () {
 *       p.fulfill();
 *       // error was caught and swallowed by the promise returned from
 *       // p.then(). we either have to always register handlers on
 *       // the returned promises or we can do the following...
 *     }, 10);
 *
 *     // this time we use .end() which prevents catching thrown errors
 *     var p = new Promise;
 *     var p2 = p.then(function(){ throw new Error('shucks') }).end(); // <--
 *     setTimeout(function () {
 *       p.fulfill(); // throws "shucks"
 *     }, 10);
 *
 * @api public
 * @param {Promise} p
 * @param {String} name
 * @return {Promise} this
 */

Promise.trace = function (p, name) {
  p.then(
    function () {
      console.log("%s fulfill %j", name, slice(arguments));
    }
    ,
    function () {
      console.log("%s reject %j", name, slice(arguments));
    }
  )
};


Promise.prototype.chain = function (p2) {
  var p1 = this;
  p1.onFulfill(p2.fulfill.bind(p2));
  p1.onReject(p2.reject.bind(p2));
  return p2;
};


Promise.deferred = function () {
  var p = new Promise;
  return {
    promise: p,
    reject: p.reject.bind(p),
    fulfill: p.fulfill.bind(p),
    callback: p.resolve.bind(p)
  }
};


/*!
 * Module exports.
 */

Promise.prototype.all = function (promiseOfArr) {
  var pRet = new Promise;
  this.then(promiseOfArr).then(
    function (promiseArr) {
      var count = 0;
      var ret = [];
      var errSentinel;
      if (!promiseArr.length) pRet.resolve();
      promiseArr.forEach(function (promise, index) {
        if (errSentinel) return;
        count++;
        promise.then(
          function (val) {
            if (errSentinel) return;
            ret[index] = val;
            --count;
            if (count == 0) pRet.fulfill(ret);
          },
          function (err) {
            if (errSentinel) return;
            errSentinel = err;
            pRet.reject(err);
          }
        );
      });
      return pRet;
    }
    , pRet.reject.bind(pRet)
  );
  return pRet;
};


Promise.hook = function(arr) {
  var p1 = new Promise;
  var pFinal = new Promise;
  var signalP = function () {
    --count;
    if (count == 0)
      pFinal.fulfill();
    return pFinal;
  };
  var count = 1;
  var ps = p1;
  arr.forEach(function (hook) {
    ps = ps.then(
      function () {
        var p = new Promise;
        count++;
        hook(p.resolve.bind(p), signalP);
        return p;
      }
    )
  });
  ps = ps.then(signalP);
  p1.resolve();
  return ps;
};
module.exports = Promise;

}).call(this,require("JkpR2F"))
},{"JkpR2F":3,"events":2}]},{},[1]);