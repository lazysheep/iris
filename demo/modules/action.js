define(function(require) {
	var $ = require('jquery');
	var Router = require('modules/Route');
	var option = require('json!config/main.json');
	var render = require('modules/render');
	var listener = require('modules/listener');
	var globe = require('config/globe');
	var request = require('modules/request');
	var router, maskRouter;
	var start = function() {
		router = new Router();
		router.homePage = '0';
		router.on('$$$$', function() {
			option.el = $('.page-container')[0];
			render(option, null, router);		
		});
		router.start();

		listener.trigger('all:init');
	};
	listener.on('route', function(e) {
		router.navi(e.path);
	});

	return start;
});

