define(function(require) {
	return function(globe, listener, router) {
		return function(e) {
			var id = e.id;
			var stationType = e.stationType;
			var orgType = e.orgType;
			var orgName = e.orgName;//encodeURIComponent(e.orgName);
			var orgCode = e.orgCode;
			var station = e.station;
			var arr = id.split(',');
			var type = arr[0];
			var thisStationType = globe.routeReplace.stationType;
			router.historyClear();
			if (stationType == '1') { // 火电
				globe.routeReplace.mainPageType = '0';
				switch(type) {
					case 'main':
						globe.routeReplace.code = arr[1];
						globe.routeReplace.orgName = orgName;
						globe.routeReplace.stationType = stationType;
						globe.routeReplace.station = station;
						router.navi('0/0/0/0/0/'+arr[1], {replace:false});
						break;
				}
			} else if (stationType == '3' || stationType == '4') { // 风电 或 光伏
				globe.routeReplace.mainPageType = '1';
				switch(type) {
					case 'main':
						globe.routeReplace.code = arr[1];
						globe.routeReplace.orgName = orgName;
						globe.routeReplace.stationType = stationType;
						globe.routeReplace.station = station;
						router.navi('0/0/0/0/1/'+arr[1]+'/'+stationType, {replace:false});
						break;
					case 'unit':
						globe.routeReplace.unitCode = arr[1];
						globe.routeReplace.orgName = orgName;
						globe.routeReplace.stationType = stationType;
						globe.routeReplace.code = orgCode;
						globe.routeReplace.station = station;
						router.navi('6/0/'+arr[1]+'/'+orgCode+'/'+stationType, {replace:false});
						break;
					case 'product':
						globe.routeReplace.code = arr[1];
						globe.routeReplace.orgName = orgName;
						globe.routeReplace.stationType = stationType;
						globe.routeReplace.station = station;
						router.navi('7/0/0/', {replace:false});
						break;
				}
			} else if (stationType == '2') {
				globe.routeReplace.mainPageType = '2';
				switch(type) {
					case 'main':
						globe.routeReplace.code = arr[1];
						globe.routeReplace.orgName = orgName;
						globe.routeReplace.stationType = stationType;
						globe.routeReplace.station = station;
						router.navi('0/0/0/0/2/'+arr[1]+'/'+stationType+'/'+station, {replace:false});
						break;
				}				
			}
			listener.trigger('loadFactoryUnitList');

		};		
	}

});