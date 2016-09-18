define(function(require) {
	return function(e, globe, filtersData) {
		var code = globe.unitGroup.result[e.index].code;
		switch(globe.unitGroup.result[e.index].unittype){
			case '1':
				filtersData.get('benchmarkingIndexs').list[0].sub = filtersData.get('benchmarkingIndexs').list[0].sub1;
				break;
			case '2':
				filtersData.get('benchmarkingIndexs').list[0].sub = filtersData.get('benchmarkingIndexs').list[0].sub2;
				break;
			default:
				filtersData.get('benchmarkingIndexs').list[0].sub = filtersData.get('benchmarkingIndexs').list[0].sub0;
				break;
		}

		var orgCode = globe.routeReplace.code;
		globe.routeReplace.benchmarkingUnitCodeIndex = e.index
		globe.routeReplace.benchmarkingUnitCode = code;
		var canFindCodeInData = false;
		var codeIndex = 0;
		for (var i = 0; i < filtersData.get('benchmarkingIndexs').list[0].sub.length; i++) {
			var item = filtersData.get('benchmarkingIndexs').list[0].sub[i];
			if(item.value == globe.routeReplace.benchmarkingCode){
				canFindCodeInData = true;
				codeIndex = i;
				break;
			}
		}
		if(canFindCodeInData){
			filtersData.get('benchmarkingIndexs').list[0].sub[0].selected = '';
			filtersData.get('benchmarkingIndexs').list[0].sub[codeIndex].selected = 'selected';
		}else{
			globe.routeReplace.benchmarkingCode = 'GEN';
		}
	}	
});