define(function() {
	function textLength(text, fontSize) {
		var $temp = $('<div>' + text + '</div>').css({
			position: 'absolute',
			left: '-9999px',
			visibility: 'hidden',
			fontSize: fontSize || '13px'
		});
		$('body').append($temp);
		var width = $temp.width();
		$temp.remove();
		return width;
	}
	return textLength;
});