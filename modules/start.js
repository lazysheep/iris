define(function(require) {
	var start = require('modules/action');
	var _ = require('underscore');
	var FastClick = require('fastclick');

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g
	};
	FastClick.ins = FastClick.attach(document.body);
	

	document.body.onselectstart = function(e) {
	    return false;
	};
	return function() {
		start();
	}
});