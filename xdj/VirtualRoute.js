define(function(require) {
	var Backbone = require('backbone');
	var Route = require('modules/Route');
	var globe = require('config/globe');
	var routerBase = require('modules/routerBase');
	var _ = require('underscore');
	var obj = _.extend({}, routerBase, {
		// navi: function(route, option) {
		// 	option = _.extend({}, this.option, option);
		// 	route = this.setDefault(route);
		// 	if (route === this.currentRoute) { // repeat route
		// 		return; 
		// 	}

		// },
		toNavi: function(route, option) {
			if (option && option.trigger) {
				var args = this.makeArgs(route);
				this.change.apply(this, args);				
			}

		},
		defaultConfig: globe.maskRoute,
		replaceConfig: globe.routeReplace,
		makeArgs: function(route) {
			var arr = route.split('/');
			var page = '';
			var path = '';
			if (arr.length) {
				page = arr[0];
				if (arr.length > 1) {
					path = arr.slice(1).join('/');
				}
			}
			var args = [page, path];
			return args;	
		},
		initialize: function() {

			this.history = [];
			this._routeEvents = [];
		},
		start: function() {
			var route = this.setDefault('');
			this.change.apply(this, this.makeArgs(route));
		}
	});
	var VirtualRoute = Backbone.Model.extend(obj);
	return VirtualRoute;
});