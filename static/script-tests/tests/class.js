/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ClassTest = AsyncTestCase('Class');

    this.ClassTest.prototype.setUp = function() {
    };

    this.ClassTest.prototype.tearDown = function() {
    };

    this.ClassTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/class'], function(Class) {

            assertEquals('Class should be a function', 'function', typeof Class);
            assertEquals('Class should have an extend static method', 'function', typeof Class.extend);

        });
    };

    this.ClassTest.prototype.testExtend = function(queue) {
        expectAsserts(4);

        queuedRequire(queue, ['antie/class'], function(Class) {

            var ExtendedClass = Class.extend({
                init: function(value) {
                    this._variable = value;
                },
                returnMethodString: function() {
                    return 'method';
                },
                overridableFunction: function() {
                    return 'base';
                },
                pie: 3.1415
            });

            var obj = new ExtendedClass('value');
            assert('Object should be an instance of ExtendedClass', obj instanceof ExtendedClass);
            assert('Object should be an instance of Class', obj instanceof Class);

            assertEquals('Example method returns expected value', 'method', obj.returnMethodString());
            assertEquals('Constructor sets expected value', 'value', obj._variable);
        });
    };

    this.ClassTest.prototype.testDoubleExtend = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/class'], function(Class) {

            var ExtendedClass = Class.extend({
                init: function(value) {
                    this._variable = value;
                },
                returnMethodString: function() {
                    return 'method';
                },
                overridableFunction: function() {
                    return 'base';
                },
                pie: 3.1415
            });
            var ExtendedTwiceClass = ExtendedClass.extend({
                overridableFunction: function() {
                    return 'subclass';
                }
            });

            var obj2 = new ExtendedTwiceClass();

            assertEquals('Instance of subclass calls non-overridden method in base class', 'method', obj2.returnMethodString());
            assertEquals('Instance of subclass calls overridden method in subclass', 'subclass', obj2.overridableFunction());

        });
    };

    this.ClassTest.prototype.testTripleExtend = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/class'], function(Class) {

            var ExtendedClass = Class.extend({
                init: function(value) {
                    this._variable = value;
                },
                returnMethodString: function() {
                    return 'method';
                },
                overridableFunction: function() {
                    return 'base';
                },
                pie: 3.1415
            });
            var ExtendedTwiceClass = ExtendedClass.extend({
                overridableFunction: function() {
                    return 'subclass';
                }
            });
            var ExtendedThriceClass = ExtendedTwiceClass.extend({
                overridableFunction: function overridableFunction () {
                    return overridableFunction.base.call(this);
                }
            });

            var obj3 = new ExtendedThriceClass();

            assertEquals('base method executes overridden method in super class', 'subclass', obj3.overridableFunction());
        });
    };

})();
