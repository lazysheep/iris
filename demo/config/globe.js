define({
	urlBase: '',
	route: {
		"$$": "0",
		"0": {
			"$$": "{{demo}}"
		},
		"1": {
			"$$": "{{demo2}}",
			"{{demo2}}": {
				"$$": "aaa"
			}
		}
	},
	routeReplace: {
		demo: "demo",
		demo2: "demo2"
	},
	maskRoute: {
		"$$": "-1",
		"-1": null,
		"0": null
	}
});