define(function (require) {
	var $ = require('jquery');
	var View = require('modules/View');
	var ui = require('text!./tmpl/HomePage.html');
	var control = "<li class='ui-HomePage-tab-li'><div class='ui-HomePage-tab-clickTab'></div><a class='ui-HomePage-tab-a'>{{text}}</a></li>";
	require('util/addStyle')(require('text!./style/HomePage.css'));

	var MainView = View.extend({
		events: {
			'click .ui-HomePage-tab-clickTab': 'homePage_TabClick',
		},
		template: ui,
		initHook: function () {
			var self = this;
			this.$el.html(this.template);
			var widthProcent = (1 / this._option.tabs.length) * 100 + '%';
			$.each(this._option.tabs, function (i, oneItem) {
				$(self.$el.find('.ui-HomePage-tab-ul')[0]).append(_.template(control)(oneItem));
			});
			this.$el.find('.ui-HomePage-tab-li').css('width', widthProcent);
			this.nextRender(this.$el.find('.ui-HomePage-tab-content')[0]);
		},
		render: function (index) {
			if (isNaN(index)) {
				index = 0;
			}
			var $a = this.$el.find('.ui-HomePage-tab-li').eq(index);

			$a.parent().find('.ui-HomePage-tab-li.selected').removeClass('selected');
			$a.addClass('selected');

		},
		homePage_TabClick: function (sender) {
			var $a = $(sender.currentTarget);
			if ($($a.parent()).hasClass('selected')) {
				return;
			}
			this.fire(this._action, {
				index: $($a.parent()).index()
			});

		},
	});
	return MainView;
});