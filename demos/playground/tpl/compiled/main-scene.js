// This file was automatically generated from main-scene.tpl.
// Please don't edit this file by hand.

if (typeof a == 'undefined') { var a = {}; }
if (typeof a.ui == 'undefined') { a.ui = {}; }
if (typeof a.ui.messagebox == 'undefined') { a.ui.messagebox = {}; }


a.ui.messagebox.error = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<h1>', soy.$$escapeHtml(opt_data.content), '!</h1>');
  return opt_sb ? '' : output.toString();
};
