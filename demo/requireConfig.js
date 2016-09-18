require.config({
    baseUrl:'demo',
    paths: {
        // Core Libraries
        "jquery": "../lib/zepto.min",
        //"jquery": "../lib/jquery.min",
        "underscore": "../lib/underscore",
        "backbone": "../lib/backbone",
        "text": "../lib/text",
        "json": "../lib/json",
        "css": "../lib/css.min",
        "Mustache": "../lib/mustache.min",
        "spin": "../lib/spin",
        "swiper": "../lib/swiper.min",
        "fastclick": "../lib/fastclick",
        "ui": "../ui",
        "util": "../util",
        "echarts": "../echarts",
        "zrender": "../zrender",
        "modules/View": "../xdj/View",
        "modules/render": "../xdj/render",
        "modules/Route": "../xdj/Route",
        "modules/VirtualRoute": "../xdj/VirtualRoute",
        "modules/routerBase": "../xdj/routerBase",
        "modules/attention": "../modules/attention",
        "modules/listener": "../modules/listener",
        "modules/requestTool": "../modules/requestTool",
        "modules/cacheRequest": "../modules/cacheRequest",
        "modules/setConfig": "../modules/setConfig",
        "modules/preloadImg": "../modules/preloadImg",
        "action": "../action",
        "dataParse": "../dataParse",
        "data": "../data"
    },
    shim: {
        "backbone": {
              "deps": [ "jquery", "underscore" ],
              "exports": "Backbone"  //attaches "Backbone" to the window object
        },
        "jquery": {
            "exports": "Zepto"
        }
    }
});