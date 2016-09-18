define(function(require) {
	var $ = require('jquery');
	var View = require('modules/View');
	require('util/addStyle')(require('text!./style/SlidePage.css'));
	var MainView = View.extend({
		template: '<div class="ui-SlidePage"><div class="ui-SlidePage-slide"></div><div class="ui-SlidePage-mainct"><div class="ui-SlidePage-main"></div><div class="ui-SlidePage-mainMask"></div></div></div>',
		events: {
			'click .ui-SlidePage-mainMask': 'maskClick'
		},
		initHook: function() {
			this.status = 0;
			this.width = +this._option.slideWidth || 230;
			this.widthRem = this.width/16;
			this.$el.html(this.template);
			this.$slide = this.$el.find('.ui-SlidePage-slide');
			this.$main = this.$el.find('.ui-SlidePage-mainct');
			this.setAniTime();
			this.drawMain();
			this.isDrawSlide = false;
		},
		setAniTime: function() {
			if (this._option && this._option.animateTime) {
				var at = this._option.animateTime;
				this.$slide.css({
				    '-webkit-transition-duration': at,
    				'transition-duration': at
				});
				this.$main.css({
				    '-webkit-transition-duration': at,
    				'transition-duration': at				
				});
			}
		},
		drawSlide: function() {
			var opt = this._children[0];
			opt.el = this.$slide[0];
			this.next(opt, 0);
			this.isDrawSlide = true;	
		},
		drawMain: function() {
			var opt = this._children[1];
			opt.el = this.$main.find('.ui-SlidePage-main')[0];
			this.next(opt, 1);				
		},
		render: function(status) {
			switch(status) {
				case '0':
				case 0: 
					this.close();
					break;
				case '1':
				case 1:
					!this.isDrawSlide && this.drawSlide();
					this.open();
					break;				
			}
		},
		close: function() {
			if (this.status === 0) {
				return;
			}
			this.$main.css({
				transform: 'translateX(0)',
				'-webkit-transform': 'translateX(0)'
			});
			this.$slide.css({
				transform: 'translateX(0)',
				'-webkit-transform': 'translateX(0)'
			});
			this.$el.find('.ui-SlidePage-mainMask').hide();
			this.status = 0;
		},
		open: function() {
			if (this.status === 1) {
				return;
			}
			this.$main.css({
				transform: 'translateX('+this.widthRem+'rem)',
				'-webkit-transform': 'translateX('+this.widthRem+'rem)'
			});
			this.$slide.css({
				transform: 'translateX('+this.widthRem+'rem)',
				'-webkit-transform': 'translateX('+this.widthRem+'rem)'
			});
			this.$el.find('.ui-SlidePage-mainMask').show();
			this.status = 1;
		},
		maskClick: function() {
			this._option && this._option.maskAction && this._listener.trigger(this._option.maskAction,this);
		}
	});
	return MainView;
});