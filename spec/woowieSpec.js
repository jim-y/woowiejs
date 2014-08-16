
/* global describe, it, expect, w, woowie, console, jQuery, $, beforeEach, afterEach */

describe('Woowie', function() {
  'use strict';

  /**
   * globals
   */
  describe('globals existence', function() {
    it('w should be defined', function() {
      expect(w).toBeDefined();
    });
    it('woowie should be defined', function() {
      expect(woowie).toBeDefined();
    });
    it('jQuery should be defined', function() {
      expect(jQuery).not.toBe(undefined);
    });
  });

  /**
   * static methods
   */
  describe('static methods existence', function() {
    it('woowie.each() should be defined', function() {
      expect(woowie.each).toBeDefined();
    });
    it('woowie.ajax() should be defined', function() {
      expect(woowie.ajax).toBeDefined();
    });
    it('woowie.version should be defined', function() {
      expect(woowie.version).toBeDefined();
    });
  });

  /**
   * entry points
   */
  describe('entry points', function() {
    beforeEach(function() {
      jQuery('<div id="singleton" class="singleton">Woowie test</div>').appendTo('body');
      jQuery('<p class="woowie">One</p><p class="woowie">Two</p>').appendTo('body');
    });
    afterEach(function() {
      jQuery('#singleton').remove();
      jQuery('.woowie').remove();
    });
    describe('w()', function() {
      it('should select dom element by id', function() {
        var elem = w('#singleton'),
          elems = w('.woowie');
        expect(elem).not.toBeNull();
        expect(elem[0].id).toEqual('singleton');
      });

      it('should select dom elements by class', function() {
        var elem = w('#singleton'),
          elems = w('.woowie');
        expect(elems).not.toBeNull();
        expect(elems.length).toEqual(2);
      });
    });
    describe('woowie()', function() {
      it('should select dom element by id', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elem).not.toBeNull();
        expect(elem[0].id).toEqual('singleton');
      });

      it('should select dom elements by class', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elems).not.toBeNull();
        expect(elems.length).toEqual(2);
      });
    });
  });

  /**
   * instance methods
   */
  describe('instance methods', function() {
    beforeEach(function() {
      jQuery('<div id="singleton" class="singleton">Woowie test</div>').appendTo('body');
      jQuery('<p class="woowie">One</p><p class="woowie">Two</p>').appendTo('body');
    });
    afterEach(function() {
      jQuery('#singleton').remove();
      jQuery('.woowie').remove();
    });
    describe('hasClass()', function() {
      it('should return true for a single element', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elem.hasClass('singleton')).toBeTruthy();
      });

      it('should return true for an elementList, if all elements have the class', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elems.hasClass('woowie')).toBeTruthy();
      });

      it('should return false, if the element doesnt have the class', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elem.hasClass('none')).toBeFalsy();
      });

      it('should return false, if at least one element in an elementList doesnt have the class', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elems.hasClass('none')).toBeFalsy();
      });
    });
    describe('addClass()', function() {
      it('should add a new class', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        elem.addClass('newClass');
        expect(elem.hasClass('newClass')).toBeTruthy();
      });

      it('should not add a new class, if class already present', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        elem.addClass('newClass');
        expect(elem[0].classList.length).toBe(2);
      });

      it('should return a woowie object', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');

        var woowieObj = elem.addClass('newClass'),
          isWoowieObj = woowieObj.length && woowieObj.selector;
        expect(isWoowieObj).toBeTruthy();
      });
    });
    describe('removeClass()', function() {
      it('should remove an existing class', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elem.removeClass('singleton').hasClass('singleton')).toBeFalsy();
      });
      it('should remove all classes in an elementList', function() {
        var elem = woowie('#singleton'),
          elems = woowie('.woowie');
        expect(elems.removeClass('singleton').hasClass('singleton')).toBeFalsy();
      });
      it('should not affect classList when removing non-existent class', function() {
        var elem = woowie('#singleton'),
          classNumBeforeRemoval = elem[0].classList.length;

        elem.removeClass('none');
        
        var classNumAfterVoidRemoval = elem[0].classList.length;
        expect(classNumBeforeRemoval).toEqual(classNumAfterVoidRemoval);
      });
    });
  });

});