define(function(require) {
	var globe = require('config/globe');
	var optionFilter = require('modules/optionFilter');
	var prefix = 'render';
	var num = 0;
	var cbs = [];
	var notCanceled = function(id) {
		return _.indexOf(cbs, id) > -1;
	};

	var parseView = function(mainOpt, cb, router, id) {
		return function(View) {
			if (!notCanceled(id)) {
				return;
			}
			var model = new Backbone.Model();
			model._option = mainOpt.option;
			model._children = mainOpt.children;
			model._route = mainOpt.route;
			model._action = mainOpt.action;
			model._router = router;
			model._globe = globe;
			model._class = mainOpt.type;
			model._listen = mainOpt.listen;
			mainOpt.model = model;
			var view = new View(mainOpt);
			(typeof cb === 'function') && cb(view, View, mainOpt);
		};
	};
	var draw = function(opt, cb, router, id) {
		if (opt.require_config) {
			require([opt.require_config], function(json) {
				if (!notCanceled(id)) {
					return;
				}
				json.el = opt.el;
				draw(json, cb, router, id);
			});
		} else if (opt.type) {
			require([opt.type], parseView(opt, cb, router, id));	
		}
		
	};
	var handle = function(opt, cb, router) {
		var id = prefix+num++;
		cbs.push(id);
		if (typeof opt.optionFilter === 'string') {
			optionFilter[opt.optionFilter](opt, function(opt) {
				if (!notCanceled(id)) {
					return;
				}
				draw(opt, cb, router, id);
			});
		} else {
			draw(opt, cb, router, id);
		}
		return id;
	};
	handle.cancelRequest = function(id) {
		var index = _.indexOf(cbs, id);
		if (index > -1) {
			cbs.splice(index,1);
		}
	};
	return handle;
});