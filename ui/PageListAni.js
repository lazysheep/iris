define(function(require) {
	var $ = require('jquery');
	var PageList = require('ui/PageList');
	require('util/addStyle')(require('text!./style/PageListAni.css'));
	var MainView = PageList.extend({
		initDraw: function() {
			var l = this._children.length, i = 0,$ct = this.$el.find('.ui-PageList');
			for (;i<l;i++) {
				$ct.append('<div class="ui-PageListAni-page"></div>');
			}
		},
		draw: function() {
			var opt = this._children[this.pageNum];
			var $d = this.$el.find('.ui-PageListAni-page').eq(this.pageNum);
			this.$el.find('.ui-PageListAni-page-show').removeClass('ui-PageListAni-page-show');
			$d.addClass('ui-PageListAni-page-show');
			if (!$d.data('rendered')) {
				opt.el = $d[0];
				this.next(opt);
				$d.data('rendered', '1');			
			}

		}
	});
	return MainView;
});