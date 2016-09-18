define(function(require) {
	return function(globe, listener, router) {
		return function(e) {
			//e.orgName = encodeURIComponent(e.orgName);
			var thisStationType = globe.routeReplace.stationType;
			var slideOpen = globe.routeReplace.slideOpen;
			globe.routeReplace.slideOpen = slideOpen = (slideOpen === '0'||slideOpen === '2')?'1':'0';
			//listener.trigger('ui:slidePageChange', slideOpen);

			globe.routeReplace.code = e.code;
			globe.routeReplace.stationType = e.stationType;
			globe.routeReplace.orgType = e.orgType;
			globe.routeReplace.orgName = e.orgName;
			globe.routeReplace.station =  e.station;
			listener.trigger('loadFactoryUnitList');
			router.historyClear();
			if(e.orgType == '0'){
				router.navi('16/'+e.code, {replace:false});
			}
			else if (e.orgType == '1') {
				router.navi('10/'+e.code, {replace:false});
			} else {
				if(e.stationType == '1'){
					globe.routeReplace.mainPageType = '0';	
				} 
				else if (e.stationType == '3' || e.stationType == '4'){
					globe.routeReplace.mainPageType = '1';
				} else if (e.stationType == '2') {
					globe.routeReplace.mainPageType = '2';
				}
				router.navi('0/0/0/0',{replace:false});				
			}


		}		
	}

});