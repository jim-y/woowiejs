/* global require, console */

(function(global, undefined) {

  'use strict';

  var _version = '0.0.1',
      document = global.document,
      hasClassList = "classList" in document.createElement("_"),
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

    if ( !selector ) {
      elements = [];
    }
    else if ( typeof selector === "string" ) {
      elements = document.querySelectorAll( selector );
    }
    else if ( selector.length ) {
      elements = selector;
    }
    else {
      elements = [selector];
    }

    for ( var i = 0; i < elements.length; ++i ) {
      this[i] = elements[i];
    }

    this.length = elements.length;
    this.selector = selector;
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
        type = options.type || 'GET',
        content = options.content || 'application/json',
        data = null,
        request,
        promise = new Promise();

    request = new XMLHttpRequest();

    if ( type === 'POST' ) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      data = options.data;
    }
    
    if ("withCredentials" in request){
      try {
        request.open(type, url, true);
      }
      catch(openError) {
        promise.reject(openError);
      }
    } 
    else if (typeof global.XDomainRequest !== "undefined"){
      request = new global.XDomainRequest();
      try {
        request.open(type, url, true);
      }
      catch(openError) {
        promise.reject(openError);
      }
    }
    else {
      request = null;
      promise.reject(new Error('return null'));
    }

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        promise.fulfill(request.responseText);
      }
      else {
        promise.reject(new Error('There was an error'));
      }
    };

    request.onerror = function() {
      promise.reject(new Error('Connection error'));
    };

    try {
      request.send(data);
    }
    catch(networkError) {
      promise.reject(new Error(networkError));
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
   * @param  {String}  cls
   * @return {Boolean}
   */
  Woowie.prototype.hasClass = function( cls ) {

    var result;
    
    this.each(function( element ) {

      var isElementNode = element.nodeType === 1;
      
      if ( isElementNode && hasClassList && element.classList.contains( cls ) ) {
        result = true;
      }
      else if ( isElementNode && element.className.match( new RegExp( '(\\s|^)' + cls + '(\\s|$)' ) ) ) {
        result = true;
      }
      else {
        result = false || !isElementNode;
      }

    });
    
    return result; 
  };

  /**
   * addClass instance method to add class selector to the element node given by the parameter
   * @param {String} cls - the name of the class to add
   * @return {Woowie}    - returning Woowie object
   */
  Woowie.prototype.addClass = function( cls ) {

    this.each(function( element ) {

      var isElementNode = element.nodeType === 1;

      if ( isElementNode && hasClassList && !element.classList.contains( cls ) ) {
        element.classList.add( cls );
      }
      else if ( isElementNode && !woowie( element ).hasClass( cls ) ) {
        element.className += " " + cls;
      }

    });

    return this;
  };

  /**
   * removeClass instance method to remove existing classes from an element
   * @param  {String} cls - the class to be added
   * @return {Woowie}     - returning Woowie object
   */
  Woowie.prototype.removeClass = function( cls ) {
    
    this.each(function( element ) {
      
      var isElementNode = element.nodeType === 1;

      if ( isElementNode && hasClassList && element.classList.contains( cls ) ) {
        element.classList.remove( cls );
      }
      else if ( isElementNode && woowie( element ).hasClass( cls ) ) {
        var reg = new RegExp( '(\\s|^)' + cls + '(\\s|$)' );
        element.className = element.className.replace( reg, ' ' );
      }

    });

    return this;
  };

  /**
   * Setting globals
   */
  global.woowie = global.w = woowie;

  return woowie;

}(window));