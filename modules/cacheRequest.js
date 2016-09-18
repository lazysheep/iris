define(function(require) {
	var request = require('modules/requestTool');
	var cache = require('util/cache')();
	var  _ = require('underscore');
	var cacheFun = function(path, param, cb, context) {
		var id = cacheFun.getId(path, param);
		var key = path+'?'+$.param(param);
		if (cache.has(id)) {
			cb.call(context, cache.get(id));
			return;
		} else {
			if (id in cacheFun.cbs) {
				cacheFun.cbs[id].push([cb, context]);
			} else {
				id = request(path, param, function(data) {
					if (data._error) {
						cb.call(context, data);
						return;
					}
					cache.add(id, data);
					_.each(cacheFun.cbs[id], function(a, i) {
						a[0].call(a[1], data);
					});
					cacheFun.cbs[id] = null;
					delete cacheFun.cbs[id];
				});

				cacheFun.keys[path] = cacheFun.keys[path] || [];
				cacheFun.keys[path].push([id, param]);
				cacheFun.cbs[id] = [[cb, context]];
			}

		}
		return id;
	};
	cacheFun.keys = {};
	cacheFun.cbs = {};
	cacheFun.getId = function(path, param) {
		var arr = cacheFun.keys[path];
		if (_.isArray(arr)) {
			for (var i = 0,l = arr.length; i < l; i++) {
				var p = arr[i][1];
				var id = arr[i][0];
				if (_.isEqual(param, p)) {
					return id;
				}				
			}

		}
		return '';
	};
	cacheFun.removeCache = function(path, param) {
		var id = cacheFun.getId(path, param);
		cache.remove(id);
	};
	cacheFun.cancelRequest = function(id) {
		request.cancelRequest(id);
		if (id in cacheFun.cbs) {
			var deleteId = id;
			delete cacheFun.cbs[id];
			$.each(cacheFun.keys,function(path, array){
				var index = -1;
				for (var i = 0; i < array.length; i++) {
					if(array[i] == deleteId){
						index = i;
					}
				}
				array.splice(index,1);
			});
		}
	};
	return cacheFun;
});