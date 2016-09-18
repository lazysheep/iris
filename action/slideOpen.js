define(function(require) {
	var slideOpen = function(e, globe, FastClick, cacheRequest) {
		var slideOpenV = globe.routeReplace.slideOpen;
		globe.routeReplace.slideOpen = slideOpenV = (slideOpenV === '0')?'1':'0';
		if(slideOpenV == '1'){
			cacheRequest.removeCache('orgList/getUserAttendOrgList.do',{USERID: globe.userInfo.userId});
		}
		if (slideOpenV == '1') {
			FastClick.ins&&FastClick.ins.destroy();
		} else {
			FastClick.ins = FastClick.attach(document.body);
		}
		return slideOpenV;
	};
	return slideOpen;
});