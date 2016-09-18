define(function(require) {
	var $ = require('jquery');
	var globe = require('config/globe');
	var prefix = 'request';
	var num = 0;
	var cbs = {};
	var request = function(url, param, cb, context) {
		var key = url+'?'+$.param(param);
		url = globe.urlBase+url;
		$.ajax({
			type: 'GET',
			url: url,
			data: param,
			cache: false,
			success: function(data) {
				if (!data) {
					cb.call(context, {_error: true});
					return;
				}
				cb.call(context, data);
			},
			error: function(e) {
				cb.call(context, {_error: true});
				console.log('error:'+key);
			}
		});
	};


	var handler = function(url, param, cb, context) {
		var id = prefix+num++;
		var cbsFun = function() {
			var arr = cbs[id];
			if ($.isArray(arr)) {
				arr[0].apply(arr[1], arguments);
			} else {
				console.log('canceled', id);
			}
		};
		if ($.isArray(url)) {
			var max = url.length;
			context = cb;
			cb = param;
			cbs[id] = [cb, context];
			var readyNum = 0;
			var datas = [];
			var cbF = function(index, max, cb, context) {
				var done = function(data) {
					readyNum++;
					datas[index] = data;
					if (readyNum === max) {
						//cb.apply(context, datas);
						cbsFun.apply(null, datas);
					}
				};
				return done;	
			};
			$.each(url, function(i, obj) {
				request(obj.url, obj.param, cbF(i, max, cb, context), null);
			});
		} else {
			cbs[id] = [cb, context];
			//request(url, param, cb, context);
			request(url, param, cbsFun);
		}
		return id;
	};
	handler.cancelRequest = function(id) {
		cbs[id] = null;
		delete cbs[id];
	};
	return handler;
});