var PORT = 7010;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');
var httpProxy = require('http-proxy');
var history = require('connect-history-api-fallback');
var connect = require('connect');

var _targets=[
    'http://192.168.11.200:8780',
    'http://192.168.11.172:8480',
    'http://localhost:8088',
    'http://1w799160d6.iok.la',
    'http://139.196.210.147:8080',
    'http://192.168.1.104:8080',
    'http://localhost:18080',
    'http://192.168.1.103:8380',
    'http://192.168.1.107:8380',
]

var _targetsindex=0;

var proxy = httpProxy.createProxyServer({
    target: _targets[_targetsindex]
});

function access(request, response, next){
    var pathname = url.parse(request.url).pathname;
    if(pathname.indexOf("undefined")){
        pathname=pathname.split("undefined").join("");
    }
    if(pathname=="/"){
        pathname="/index.html";
    }
    var realPath = path.join("./", pathname);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    //console.log('/apilogin',/\/api.*$/.test("/apilogin"))
    if(/\/api.*$/.test(pathname)){
        request.url=request.url.replace("/api","");//:8380
        console.log('api==>',JSON.stringify(proxy.options.target),request.url)
        proxy.web(request, response);
        return;
    }
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}
var app = connect()
    .use(history())
    .use(access);
http.Server(app).listen(PORT);
console.log("Server runing at port: " + PORT + ".");
