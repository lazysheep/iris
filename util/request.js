define(function(require) {
	var $ = require('jquery');
	var globe = require('config/globe');
	var request = function(url, param, cb, context) {
		url = globe.urlBase+url;
		$.ajax({
			type: 'GET',
			url: url,
			data: param,
			success: function(data) {
				cb.call(context, data);
			},
			error: function(e) {
				//cb.call(context, null, e);
			}
		});
	};


	return function(url, param, cb, context) {
		if ($.isArray(url)) {
			var max = url.length;
			context = cb;
			cb = param;
			var readyNum = 0;
			var datas = [];
			var cbF = function(index, max, cb, context) {
				var done = function(data) {
					readyNum++;
					datas[index] = data;
					if (readyNum === max) {
						cb.call(context, datas);
					}
				};
				return done;	
			};
			$.each(url, function(i, obj) {
				request(obj.url, obj.param, cbF(i, max, cb, context), null);
			});
		} else {
			request(url, param, cb, context);
		}

	}
});