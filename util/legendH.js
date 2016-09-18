define(function(require) {
	var textLength = require('./textLength');
	// 计算图例高度
	function legendH(arr) { // 图例文字用数组传进来
		var h = 25, // 单行高度
			iconW = 25, // 图标宽
			w = 0,
			row = 1, // 行数
			fs = 14, // 字号
			screenW = (window.innerWidth || 320) - 100; // 50图标水平坐标与屏幕边的偏差 
		$.each(arr, function(i, text) {
			var thisw = (textLength(text, fs)+iconW);
			w += thisw;
			if (w > screenW) { // 换行
				w = thisw;
				row ++;
			}
		});
		if (w === 0) {
			return 0;
		}
		return row * h;
	}
	return legendH;
});