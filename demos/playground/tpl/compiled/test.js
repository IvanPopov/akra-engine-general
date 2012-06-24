// This file was automatically generated from test.tpl.
// Please don't edit this file by hand.

goog.provide('examples.simple');

goog.require('soy');
goog.require('soy.StringBuilder');


examples.simple.helloName = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append((! opt_data.greetingWord) ? '<h1>Hello ' + soy.$$escapeHtml(opt_data.name) + '!</h1>' : soy.$$escapeHtml(opt_data.greetingWord) + ' ' + soy.$$escapeHtml(opt_data.name) + '!');
  return opt_sb ? '' : output.toString();
};
