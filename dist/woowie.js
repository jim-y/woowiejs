/* woowie - v0.1.0 - 2014-08-11
 * https://github.com/jim-y/woowiejs
 * Copyright (c) 2014 Attila Kling; Licensed MIT 
 */

(function(global, undefined) {

  'use strict';

  var _version = '0.0.1',
      document = global.document,
      woowie = function( selector ) {
        return new Woowie( selector );
      };

  var Promise = require( 'mpromise' );

  /**
   * The main Woowie constructor.
   * If `selector` is a string, we use querySelectorAll to get all dom elements.
   * If selector has a length property, it is a NodeList.
   * Otherwise, its a single element.
   * @param {string|NodeList} selector
   */
  function Woowie( selector ) {

    var elements;

    if ( typeof selector === "string" ) {
      elements = document.querySelectorAll( selector );
    }
    else if ( selector.length ) {
      elements = selector;
    }
    else {
      elements = [selector];
    }

    for( var i = 0; i < elements.length; ++i ) {
      this[i] = elements[i];
    }

    this.length = elements.length;

  }

  /**
   * Prototype method for woowie.each()
   * @param  {Woowie}   obj
   * @param  {Function} callback
   * @return {void}
   */
  function _each( obj, callback ) {
    [].forEach.call( obj, callback );
  }

  /**
   * Prototype method for woowie.ajax()
   * @return {[type]}
   */
  function _ajax( options ) {

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
  }

  /**
   * Static methods and properties. Can be called as w.methodName()
   */
  woowie.each = _each;
  woowie.ajax = _ajax;
  woowie.version = _version;


  /**
   * Instance methods and properties. Can be called as w(selector).methodName()
   */
  Woowie.prototype.selector = "";
  Woowie.prototype.length = 0;
  
  /**
   * each instance method
   * @param  {Function} callback
   * @return {void}
   */
  Woowie.prototype.each = function( callback ) {
    _each( this, callback );
    return this;
  };

  /**
   * map instance method
   * @param  {Function} projection
   * @return {array}
   */
  Woowie.prototype.map = function( projection ) {

    var results = [],
        currentValue,
        index,
        arrayToIterateOn = this;

    for( var i = 0; i < this.length; ++i ) {
      currentValue = this[i];
      index = i;
      results.push( projection.call( this, currentValue, index, arrayToIterateOn ) );
    }

    return results;   
  };
  
  /**
   * text instance method
   * @param  {String|undefined} text
   * @return {String|array<String>|Woowie}
   */
  Woowie.prototype.text = function( text ) {

    var result;

    if ( typeof text !== "undefined" ) {
      result = this.each(function( element ) {
        element.textContent = text;
      });
    }
    else {
      result = this.map(function( element ) {
        return element.textContent;
      });
    }

    return result.length > 1 ? result : result[0];
  };

  /**
   * hasClass instance method to check if the element(s) has the class {classSelector}
   * @param  {String}  classSelector
   * @return {Boolean}
   */
  Woowie.prototype.hasClass = function( classSelector ) {

    var result;
    
    this.each(function( element ) {

      var isElementNode = element.nodeType === 1;
      
      if ( isElementNode && element.className.match( new RegExp( '(\\s|^)' + classSelector + '(\\s|$)' ) ) ) {
        result = true;    
      }
      else {
        result = false || !isElementNode;
      }

    });
    
    return result; 
  };

  /**
   * Setting globals
   */
  global.woowie = global.w = woowie;

  return woowie;

}(window));
