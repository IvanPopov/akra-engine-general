// This file was automatically generated from main-scene.tpl.
// Please don't edit this file by hand.

goog.provide('a.ui.messagebox');

goog.require('soy');
goog.require('soy.StringBuilder');


a.ui.messagebox.error = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<h1>', soy.$$escapeHtml(opt_data.content), '!</h1>');
  return opt_sb ? '' : output.toString();
};
