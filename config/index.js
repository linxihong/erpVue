// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8110,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            "/api": {
                //target:'http://192.168.7.173:8480',//铝型材
                //target:'http://61.145.105.82:8780',
                //target:'http://192.168.11.103:8780',//铝型材
                target:'http://192.168.11.200:8780',//内网
                //target:'http://192.168.11.214:8780',//俊斌
                //target:'http://192.168.11.210:8780',//陈倩
                //target:'http://192.168.11.73:8780',//威
                //target:'http://192.168.7.166:8480',//铝型材
                //target:'http://192.168.11.164:8780',//阿金
              // target:'http://192.168.11.172:8780',//尚斌
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            "/weather": {
                target: 'https://weatherapi.market.xiaomi.com/wtr-v3/weather/',
                changeOrigin: true,
                pathRewrite: {
                    '^/weather': ''
                }
            }
        },
        _port: 8111,
        _proxyTable: {
            "/api": {
                target:'http://192.168.11.200:8780',//内网
               // target:'http://192.168.11.214:8780',//俊斌
                //target:'http://192.168.11.210:8780',//陈倩
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            "/weather": {
                target: 'https://weatherapi.market.xiaomi.com/wtr-v3/weather/',
                changeOrigin: true,
                pathRewrite: {
                    '^/weather': ''
                }
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}
