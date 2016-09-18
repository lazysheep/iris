define(function(require) {
	var Backbone = require('backbone');
	var _ = require('underscore');
	var obj = {};
	_.extend(obj, Backbone.Events);
	return obj;
});