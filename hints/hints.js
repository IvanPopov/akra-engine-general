/**
 * Define constant.
 * @param {Identifier} constant
 * @param {ExpressionStatament} value
 */
function Define(constant, value) {}

/**
 * Define function macro.
 * @param {CallExpression} call
 * @param {FunctionDeclaration} macro
 */
function Define(call, macro) {}

/**
 * Define accessor.
 * @param {MemberExpression} accessor
 * @param {MemberExpression} replacer
 */
function Define(accessor, replacer) {}
function If() {}
function Ifdef() {}
function Endif() {}
function Elseif() {}
function Enum() {}


/**
 * Include file/directory.
 * @param {String} path
 */
function Include(path) {}

/**
 * @example Enum([CONSTANT = 1], CONSTANTS);
 * @param {Array} keys
 * @param {Identifier} name
 * @param {MemberExpression} location
 */
function Enum(keys, name, location){}

/**
 * Extends class.
 * @param {Identifier} class_name
 */
function EXTENDS (class_name, parent1, parent2, parent3) {}

/**
 * Locked calling.
 * @param {Identifier} class_name
 * @param {Identifier} method
 */
function DISMETHOD(class_name, method) {}

/**
 * Locked calling.
 * @param {Identifier} class_name
 * @param {Identifier} property
 */
function DISPROPERTY(class_name, property) {}

/**
 * Define property (getter/setter).
 * @param {Identifier} class_name
 * @param {String} property
 * @param {Function} getter
 * @param {Function} setter
 */
function PROPERTY(class_name, property, getter, setter) {}
function GETTER(class_name, property, getter) {}
function SETTER(class_name, property, setter) {}
/**
 * Setup static variable for class.
 * @param class_name
 * @param name
 * @param value
 */
function STATIC(class_name, name, value) {}
/**
 * Setup static variable in constructor or method.
 * @param name
 * @param value
 */
function STATIC(name, value) {}

/**
 * debug assert.
 * @param {Boolean} cond
 * @param {String} message
 */
function debug_assert(cond, message) {}

/**
 * debug error.
 * @param {String} message
 */
function debug_error(message) {}


/**
 * Test bit.
 * @param {Int} value Value for test.
 * @param {Uint} bit Number of bit.
 */
function TEST_BIT(value, bit) {}

/**
 * console.log() alise...
 */
function trace()  {}

var SHADER_PROGRAM_STATUS;