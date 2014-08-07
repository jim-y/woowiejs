/* woowie - v0.1.0 - 2014-08-07
 * https://github.com/jim-y/woowiejs
 * Copyright (c) 2014 Attila Kling; Licensed MIT 
 */

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
