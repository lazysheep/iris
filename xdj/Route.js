define(function(require){
	var Backbone = require('backbone');
	var _ = require('underscore');
	var globe = require('config/globe');
	var routerBase = require('modules/routerBase');
	var obj = _.extend({},routerBase,{
		routes: {
			":page(/*path)": "change"
		},
		defaultConfig: globe.route,
		replaceConfig: globe.routeReplace,
		start: function() {
			var hash = location.hash?location.hash.slice(1):'';
			//location.hash = '';
			Backbone.history.start();
			this.navi(hash, {
				trigger: true,
				replace: false
			});
		},
		back: function() {
			if (this.history.length === 1) {
				this.history = [];
				this.navi(this.homePage,{replace:false});
				return;
			} else {
				this.navi(this.history[this.history.length-2],{
					isBack:true
				});
			}
			//history.back();
		},
		toNavi: function(route, option) {
			var option = _.extend({},this.option,{
				replace: true
			});
			this.navigate(route, option);
		}
	});
	var Workspace = Backbone.Router.extend(obj);
	return Workspace;
});