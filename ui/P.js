define(function(require) {
	var View = require('modules/View');
    require('util/addStyle')(require('text!./style/P.css'));
	var MainView = View.extend({
		template: '<div class="ui-P"></div>',
        tmplItem: '<h1 class="ui-P-t">{{h1}}</h1><p>{{p}}</p>',
		render: function(tabs, data) {
			this.$el.html(this.template);
            $.each(data, $.proxy(function(i, d) {
                this.$('.ui-P').append(_.template(this.tmplItem)(d));
            }, this));
		}
	});
	return MainView;
});