define(function (require) {
	var listener = require('modules/listener');
	var request = require('modules/request');
	var decodeUrlParams = require('util/decodeUrlParams');
	var render = require('modules/render');
	var Spinner = require('spin');
	var noDataTmp = require('text!../ui/tmpl/NoData.html');
	require('util/addStyle')(('text!../ui/style/Loading.css'));
	var View = Backbone.View.extend({
		initialize: function () {
			this._option = this.model._option || {};
			this._children = this.model._children || [];
			this._next = this.model._next;
			this._route = this.model._route;
			this._globe = this.model._globe;
			this._listener = listener;
			this._action = this.model._action;
			this._router = this.model._router;
			this._childrenViews = [];
			this._routebinds = [];
			this._renderids = [];
			this._noDataView = noDataTmp;
			this._class = this.model._class;
			this.initHook && this.initHook();

			this.initRoute();
		},
		destroy: function () {
			this.cancelRenderRequest();
			var me = this;
			$.each(this._childrenViews, function (i, view) {
				view && view.destroy();
			});
			this.deleteHook && this.deleteHook();
			if (this._route) {
				var route = this._route;
				var router = this._router;
				this._onRoutePath && router.offRoute(this._onRoutePath, this._onRouteChange_, this);
				if (this._requestId_) {
					request.cancelRequest(this._requestId_);
				}
			}

			this.undelegateEvents();
			this.model.destroy();
			this._option = null;
			this._children = null;
			this._next = null;
			this._route = null;
			this._globe = null;
			this._childrenViews = null;
			this._renderids = null;
			this.$el.empty();
			this.stopListening();
		},
		initRoute: function () {
			var hash = this._router.currentRoute;
			var route = this.model._route;
			var changes, base;
			if (route && (route.change || route.path)) {
				this.routeBind();
				this._args_ = this._router.getCurrentChange(this._onRoutePath);
				if (route.ajaxData) {
					this._requestData_();
					return;
				}
				this.render.apply(this, this._args_);
			} else if (route && route.ajaxData) {
				this._args_ = [];
				this._requestData_();
				return;
			} else {
				this.render();
			}
		},
		routeBind: function () {
			if (this._route.base) {
				var base = this._route.base;
				var change = this._route.change;
				if (base.slice(-1) === '/') {
					base = base.slice(0, -1);
				}
				if (change.slice(0) === '/') {
					change = change.slice(1);
				}
				var path = base === '' ? change : base + '/' + change; console.log('path', path);
			} else if (this._route.path) {
				var path = this._route.path;
			}

			this._onRoutePath = path;
			this._router.onRoute(path, this._onRouteChange_, this);
		},
		nextRender: function (el) {
			var opts = this._children;
			var me = this;
			if ($.isArray(opts)) {
				$.each(opts, function (i, opt) {
					opt.el = el;
					me.next(opt);
				});
			}
		},
		next: function (opt, index) {

			var me = this;
			var id = render(opt, function (view) {
				me.cancelRenderRequest(id);
				if (!isNaN(index)) {
					me._childrenViews[+index] = view;
					return;
				}
				me._childrenViews.push(view);
			}, this._router);
			this._renderids.push(id);
		},
		cancelRenderRequest: function (id) {
			if (typeof id === 'string') {
				render.cancelRequest(id);
			} else {
				$.each(this._renderids, function (i, rid) {
					render.cancelRequest(rid);
				});
			}
		},
		_ajaxCb_: function (data) {


			if (arguments.length === 1) {
				if (data._error) {
					if (!this._option || (this._option && !this._option.notDataError)) {
						this.showRequestError();
						return;
					}

				} else if (data._nodata) {
					if (!this._option || (this._option && !this._option.notNoData)) {
						this.showNoData();
						return;
					}
				}
				this._ajaxdata_ = data;
				this._args_.push(data);
			}


			this.render.apply(this, this._args_);
		},
		_onRouteChange_: function (args) {

			var cl = (this._route.change || this._route.path).split('/').length;
			var args = args.slice(0, cl);
			this._args_ = args;
			if (this._route && this._route.ajaxData) {
				this._requestData_();
			} else {
				this.render.apply(this, args);
			}
		},
		fire: function (action, e) {
			actions = action.split(/\s/);
			action = actions[0];
			param = actions[1];
			if (param) {
				try {
					param = decodeUrlParams(_.template(param)(e));
				} catch (e) {
					throw new Error('请检查action：' + action + '是否正确');
				}

			} else {
				param = e;
			}
			this._listener.trigger(action, param);
		},
		_requestData_: function () {
			if (!this._option || !this._option.notLoading) {
				this.showLoading();
			}
			var str = this._route.ajaxData.slice();
			var changeObj = this.getChangeObj(this._route.change || this._route.path, this._args_);
			str = _.template(str)(changeObj);
			var t = str.split('?');
			var path = t[0];
			var param = t[1];
			param = param && decodeUrlParams(param) || '';
			var isRequest = false;
			if (param) {
				for (var k in changeObj) {
					if (k in param) {
						isRequest = true;
					}
				}
			} else {
				isRequest = true;
			}
			if (isRequest) {
				this._requestId_ = request(path, param, this._ajaxCb_, this)
			} else {
				this.render.apply(this, this._args_.concat([this._ajaxdata_]));
			}
		},
		getChangeObj: function (change, args) {
			change = change || (this._route && (this._route.change || this._route.path)) || '';
			args = args || this._args_ || [];
			var obj = {};
			var arr = change.split('/');
			for (var i = 0, j = 0; i < arr.length; i++) {
				if (arr[i].slice(0, 1) === ':') {
					var key = arr[i].slice(1);
					var value = args[j];
					obj[key] = value;
					j++;
				}

			}
			return obj;
		},
		showRequestError: function () {
			var $pDiv = this.$el;
			$pDiv.html(_.template(this._noDataView)({ noData: '接口异常' }));
			$pDiv.find('.nodata').css('height', $pDiv.height() + 'px');
			$pDiv.find('.nodata').css('line-height', $pDiv.height() + 'px');

			var self = this;
			setTimeout(function () {
				self._listener.trigger('ui:maskHide');
			}, 500);
		},
		showNoData: function () {
			var $pDiv = this.$el;
			$pDiv.html(_.template(this._noDataView)({ noData: '暂无数据' }));
			$pDiv.find('.nodata').css('height', $pDiv.height() + 'px');
			$pDiv.find('.nodata').css('line-height', $pDiv.height() + 'px');

			var self = this;
			setTimeout(function () {
				self._listener.trigger('ui:maskHide');
			}, 500);
		},
		showLoading: function () {
			this.$el.html('<div class="ui-Loading"></div>');
			var $loadingDiv = this.$el.find('.ui-Loading');
			var h = this._option.loadingH || this.$el.height();
			$loadingDiv.css('min-height', h);
			this._spinner_ = new Spinner({
				color: '#fff',
				radius: 8,
				width: 2
			}).spin($loadingDiv[0]);
			this.initLoading = true;
		},
		destroyLoading: function () {
			if (this.initLoading && this._spinner_) {
				this._spinner_ = null;
				this.$el.empty();
			}
		}
	});

	return View;
});