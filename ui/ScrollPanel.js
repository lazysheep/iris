define(function(require) {
	var $ = require('jquery');
	var View = require('modules/View');
	require('util/addStyle')(require('text!./style/ScrollPanel.css'));
	var MainView = View.extend({
		template: '<div class="ui-ScrollPanel"><div class="ui-ScrollPanel-ct"></div></div>',
		render: function() {
			this.$el.html(this.template);
			this.childCt = this.$el.find('.ui-ScrollPanel-ct')[0];
			if(this._option&&this._option.cssStyle){
				this.$el.find('.ui-ScrollPanel').css(this._option.cssStyle);
			}
			this.nextRender(this.childCt);
		}
	});
	return MainView;
});