# erp系统简介

### 1.erp的依赖
<ol>
<li>erp是基于vue 2.x 开发的系统</li>
<li>modules: vue+webpack+axios+fontawesome+element+less...</li>
</ol>

### 2.erp项目目录

```
├── dist                # 项目打包代码目录
├── build               # 项目构建(webpack)相关代码
├── config              # 项目开发环境配置相关代码
├── src                 # 开发目录
    ├── assets              # 资源目录 
    ├── components          # 组件
    ├── global              # 项目全局函数，组件，过滤器，工具类等
    ├── page                # 项目页面
    ├── router              # 前端路由
    ├── utils               # 工具类
    ├── App.vue             # 页面入口文件
    └── main.js             # 程序入口文件
├── static                # 静态文件
├── .editorconfig         # 定义代码格式
├── .babelrc              # ES6语法编译配置
├── .gitignore            # git上传需要忽略的文件格式
├── index.html          # 入口页面
├── package.json        # 项目基本信息
└── README.md           # 项目说明
```

### 3. 开发环境配置

步骤:

1. 安装[node.js](http://nodejs.cn/download/)
2. 安装CNPM: `npm install -g cnpm --registry=https://registry.npm.taobao.org`
3. 进入yunerp目录下，执行`cnpm i`安装必须的依赖
4. 启动: `npm run dev`