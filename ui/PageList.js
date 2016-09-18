define(function(require) {
	var Backbone = require('backbone');
	var $ = require('jquery');
	var View = require('modules/View');
	require('util/addStyle')(require('text!./style/PageList.css'));
	var Swiper = require('swiper');
	var MainView = View.extend({
		template: '<div class="ui-PageList"></div>',
		initHook: function() {
			this.$el.html(this.template);
			this.initDraw && this.initDraw();
		},
		render: function(pageNum) {
			if (isNaN(pageNum)) {
				throw new Error('route error, page not number');
				return;
			}
			if (!$.isArray(this._children)) {
				throw new Error('config error, pagelist has not children');
				return;				
			}
			this.pageNum = parseInt(pageNum);
			if (this.pageNum >= this._children.length) {
				throw new Error('route error, 页面索引超过所配子元素个数');
				return;
			}
			this.draw && this.draw();
		},
		draw: function() {
			this.clearOldPage();
			var opt = this._children[this.pageNum];
			opt.el = this.$el.find('.ui-PageList')[0];
			this.next(opt);
		},

		clearOldPage: function() {
			this.cancelRenderRequest();
			if (this._childrenViews.length) {
				this._childrenViews[0].destroy();
				this._childrenViews = [];
			}
		}
	});
	return MainView;
});