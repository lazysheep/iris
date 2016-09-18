define(function(require) {
	return function() {
		return {
			maxL: 5,
			keys: [],
			list: {},
			add: function(key, data) {
				if (typeof this.list[key] !== 'undefined' && this.list[key] !== null) {
					this.list[key] = data;
					for (var i = 0, l = this.keys.length; i < l; i++) {
						if (this.keys[i] === key) {
							this.keys.push(this.keys.splice(i, 1));
							break;
						}
					}
					return;
				}
				if (this.keys.length === this.maxL) {
					var delK = this.keys.shift();
					this.list[delK] = null;
				}
				this.list[key] = data;
			},
			get: function(key) {
				return this.list[key];
			},
			has: function(key) {
				var d = this.list[key];
				return typeof d !== 'undefined' && d !== null;
			},
			remove: function(key) {
				this.list[key] = null;
				for (var i = 0, l = this.keys.length; i < l; i++) {
					if (this.keys[i] === key) {
						this.keys.splice(i, 1);
						break;
					}
				}
			}
		};
	};
});