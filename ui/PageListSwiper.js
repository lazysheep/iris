define(function(require) {
	var Backbone = require('backbone');
	var $ = require('jquery');
	var PageList = require('ui/PageList');
	require('util/addStyle')(require('text!./style/PageListSwiper.css'));
	var Swiper = require('swiper');
	var MainView = PageList.extend({
		initDraw: function() {
			var $page = null, opt;
			this.$el.find('.ui-PageList').append('<div class="ui-PageList-container swiper-container"><div class="ui-PageList-wrapper swiper-wrapper"></div></div>');
			var $wrapper = this.$el.find('.ui-PageList-wrapper');
			for (var i = 0,l=this._children.length;i<l;i++) {
				$page = $('<div class="ui-PageList-page swiper-slide"></div>');
				$wrapper.append($page);
			}
			this.swiper = new Swiper(this.$el.find('.ui-PageList-container')[0], {
				onSlideChangeEnd: $.proxy(this.onSlideChange, this),
				onlyExternal: this._option.notTouchSwiper?true:false,
			});
		},
		draw: function() {
			this.swiper.slideTo(this.pageNum);
			var $page = this.$el.find('.ui-PageList-page').eq(this.pageNum);
			if (!$page.data('rendered')) {
				var me = this;
				var opt = me._children[this.pageNum];
				opt.el = $page[0];
				me.next(opt);
				$page.data('rendered', 1);
			}

		},
		onSlideChange: function(swiper) {
			this._listener.trigger(this._action, {
				index: swiper.activeIndex
			})
		},
		deleteHook: function() {
			this.swiper && this.swiper.destroy();
		}
	});
	return MainView;
});