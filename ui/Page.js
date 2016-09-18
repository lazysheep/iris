define(function(require) {
	var View = require('modules/View');
	require('util/addStyle')(require('text!./style/Page.css'));
	var MainView = View.extend({
		template: '<div class="ui-Page"></div>',
		render: function() {
			this.$el.html(this.template);
			this.$childCt = this.$('.ui-Page');
			if (this._option.css) {
				this.$childCt.css(this._option.css);
			}
			this.nextRender(this.$childCt[0]);
		}
	});
	return MainView;
});