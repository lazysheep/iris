define(function(require) {
	var request = require('modules/requestTool');
	var globe = require('config/globe');
	var cacheRequest = require('modules/cacheRequest');
	var $ = require('jquery');
	var handler = function(path, param, cb, context) {
		var id;
		switch (path) {

			default:
				id = request(path, param, cb, context);
		}
		return id;
	};
	handler.cancelRequest = function(id) {
		request.cancelRequest(id);
	};
	return handler;
});