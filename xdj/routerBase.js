define({
		option: {
			isBack: false,
			trigger: true,
			replace: true
		},
		defaultConfig: {},
		defaultFlag: '$$',
		oldFlag: '$$$',
		startFlag: '$$$$',
		triggerFlag: '$$',
		replaceConfig: {},
		useOldData: false, // 路由补全时时候用上次值，是用上次值，否用默认值
		initialize: function() {
			//var route = this.setDefault('');
			//location.hash = '#'+route;
			this.currentRoute = '';//route;
			this.history = [];
			this.isBack = false;
			this.replace = !!this.option.replace;
			this._routeEvents = [];
		},
		change: function() {
			var page = arguments[0],
				path = arguments[1];
			var args = [page];
			if (path) {
				args = args.concat(path.split('/'));
			}
			var hash = args.join('/');
			if (!this.inited) {
				this.isBack = true;
				this.trigger(this.startFlag, hash);
				this.inited = true;
				this.history.push(hash);
			} else if (this.isBack) {
				this.setDefault(hash);
				this.triggerHandle(this.currentRoute, hash, true);
				this.history.pop();
			} else {
				this.isBack = true;
				this.triggerHandle(this.currentRoute, hash);
				if (!this.replace) {
					this.history.push(hash);
				}
			}

			this.currentRoute = hash;
		},
		setDefault: function(hash, option) {
			hash = hash || (hash === '') ? hash : (location.hash ? location.hash.slice(1) : '');
			var def = this.defaultConfig;
			var arr = hash.split('/');
			var newArr = [];
			this._circle(def, arr, newArr, 0, option);
			return newArr.join('/');
		},
		_circle: function(obj, arr, newArr, i, option) {
			var v = this._eachDef(obj, arr[i], newArr, option);
			//v && newArr.push(v);
			i++;
			if (obj[v] && typeof obj[v] === 'object') {
				this._circle(obj[v], arr, newArr, i, option);
			} else { // 默认值未配的值追加上
				for (;i<arr.length;i++) {
					newArr.push(arr[i]);
				}
				return newArr;
			}
		},
		_eachDef: function(obj, v, newArr, option) {
			var re = /^\{\{([\s\S]+)\}\}$/;
			var istmp = re.test(obj[this.defaultFlag]);
			var def = obj[this.defaultFlag];
			var old = obj[this.oldFlag];
			var tmp, 
				realv;
			if (typeof v === 'undefined' || v=== '') {
				if (istmp) {
					realv = _.template(def)(this.replaceConfig);
				} else if (this.useOldData && typeof obj[this.oldFlag] !== 'undefined' && (!option.replace)) {
					realv = old;
				} else {
					realv = def;
				}
			} else if (v === this.defaultFlag) {
				if (typeof old !== 'undefined') {
					realv = old;
				} else if(istmp){
					realv = _.template(def)(this.replaceConfig);
				} else {
					realv = def;
				}
			} else {
				realv = decodeURIComponent(v);
				if (istmp) {
					this.replaceConfig[RegExp.$1] = realv;		
				}
			}
			if (istmp) {
				tmp = def;
			} else {
				tmp = realv;
			}
			obj[this.oldFlag] = decodeURIComponent(realv);
			newArr.push(realv);
			return tmp;

		},
		navi : function(route, option) {
			option = _.extend({}, this.option, option);
			route = this.setDefault(route, option);
			if (route === this.currentRoute) { // repeat route
				return; 
			}
			if (option.trigger) {
				this.isBack = option.isBack;
				this.replace = !!option.replace;
			}
			if (option.historyReplaceCurrent === true) {
				this.historyReplaceCurrent(route);
				this.replace = true;
			}
			this.toNavi(route, option);
		},

		isVaildBase: function(base) {
			return this.currentRoute.indexOf(base) === 0;
		},
		addDiagonal: function(str) {
			if (str && str.slice(-1) !== '/') {
				str += '/';
			}
			return str;
		},

		triggerHandle: function(his, cur, isBack) {
			var hisArr = his.split('/');
			var curArr = cur.split('/');
			var evts = this._routeEvents;
			var changes;
			var isTrigger;
			for (var i=0;i<evts.length;i++) { // 在之前的遍历中可能已有一些事件解绑,所以每次遍历都获取evts.length
				var ev = evts[i];
				if (!ev) {
					return; 
				}
				var re = new RegExp(ev.re);
				var matches = re.exec(cur);
				if (matches !== null) {
					changes = [];
					isTrigger = false;
					for (var j=0,len=ev.changeIndex.length;j<len;j++) {
						var index = ev.changeIndex[j];
						changes.push(curArr[index]);
						if (curArr[index] !== hisArr[index]) {
							isTrigger = true;
						}
					}
					isTrigger && ev.cb.call(ev.context, changes, isBack);
				}
			}
		},
		onRoute: function(key, cb, context) {
			var pre = this.triggerFlag;
			var obj = {
				key: key,
				cb: cb,
				context: context,
				re: '', // 路由匹配正则
				changeIndex:[]
			};
			var changeIndex = [];
			var re = this.getBindRe(key, changeIndex);
			obj.re = re;
			obj.changeIndex = changeIndex;
			this._routeEvents.push(obj);
		},
		getBindRe: function(key, changeIndex) {
			var pre = this.triggerFlag;
			var re = []; // 路由匹配正则
			var arr = key.split('/');
			for (var i=0,l=arr.length;i<l;i++) {
				var d = arr[i];
				if (d.slice(0,1) === ':') {
					//re.push('(.*?)');
					re.push('([^/]*)')
					changeIndex.push(i);
				} else if (d === pre) {
					re.push('.*?');
				} else {
					re.push(d);
				}
			}
			re = '^'+re.join("/")+'.*';
			return re;
		},
		offRoute: function(key, cb, context) {
			var evts = this._routeEvents;
			for (var i=evts.length-1;i>=0;i--) {
				if (evts[i].key ===key && evts[i].cb === cb && evts[i].context === context) {
					evts.splice(i,1);
					break;
				}
			}
		},
		getCurrentChange: function(key) {
			var restr = this.getBindRe(key, []);
			var re = new RegExp(restr);
			var matches = re.exec(this.currentRoute);
			if (matches === null) {
				throw new Error('routeBase：正则与当前路由不匹配，请检查路由默认设置是否正确');
				return [];
			}
			return matches.slice(1);
		},
		currentContain: function(hash) {
			return this.contain(this.currentRoute, hash);
		},
		contain: function(base, check) {
			if (typeof check !== 'string'|| typeof base !== 'string') {
				throw new Error('routeBase error: contain方法参数错误');
				return;
			}
			if (check.slice(-1) === '/') {
				check = check.slice(-1);
			}
			var re = new RegExp('^'+check+'(\/|$)');
			return re.test(base);
		},
		historyClear: function() {
			this.history = [];
		},
		historyReplaceCurrent: function(hash) {
			if (this.history.length) {
				this.history[this.history.length-1] = hash;
			} else {
				this.history.push(hash);
			}
		}

});