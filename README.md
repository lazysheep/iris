# iris
* 业务逻辑也是一种数据，将业务逻辑用数据的形式抽离出来，写更具复用价值代码，做更易修改的单页应用。
## 开始使用
* 开发时grunt server，
* 打包grunt,
* 打包后文件out/demo/dist
## 代码示例
* 具体示例代码见demo文件夹
* 业务逻辑见demo/config/main.json
* 初始化state数据与路由默认补全配置见demo/config/globe.js
```json
{
    "type": "ui/Page",
    "option": {
        "css": {
            "box-sizing": "border-box",
            "padding": "20px"
        }
    },
    "children": [
        {
            "type": "ui/TopLeft",
            "option": {
                "topTitle": "数据驱动单页应用",
                "leftTitle": "介绍"
            },
            "route": {
                "ajaxData": "data/introduce.json"
            },
            "children": [
                {
                    "type": "ui/HomePage",
                    "action": "route path={{index}}",
                    "option": {
                        "tabs": [
                            {
                                "text": "配置数据"
                            },{
                                "text": "UI组件"
                            },{
                                "text": "路由默认配置"
                            }, {
                                "text": "事件"
                            }
                        ]
                    },
                    "route": {
                        "path": ":tabs"
                    },
                    "children": [
                        {
                            "type": "ui/PageList",
                            "route": {
                                "path": ":tabs"
                            },
                            "children": [
                                {
                                    "type": "ui/P",
                                    "route": {
                                        "path": ":tabs",
                                        "ajaxData": "data/{{tabs}}.json"
                                    }
                                },  {
                                    "type": "ui/P",
                                    "route": {
                                        "path": ":tabs",
                                        "ajaxData": "data/{{tabs}}.json"
                                    }
                                },  {
                                    "type": "ui/P",
                                    "route": {
                                        "path": ":tabs",
                                        "ajaxData": "data/{{tabs}}.json"
                                    }
                                },   {
                                    "type": "ui/P",
                                    "route": {
                                        "path": ":tabs",
                                        "ajaxData": "data/{{tabs}}.json"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```
