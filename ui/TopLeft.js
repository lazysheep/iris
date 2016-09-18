define(function(require) {
	var View = require('modules/View');
	require('util/addStyle')(require('text!./style/TopLeft.css'));
	var MainView = View.extend({
		template: require('text!./tmpl/TopLeft.html'),
		render: function(data) {
			this.$el.html(_.template(this.template)(this._option));
			this.$('.ui-TopLeft-text').text(data.text);
			this.nextRender(this.$('.ui-TopLeft-ct')[0]);
		}
	});
	return MainView;
});