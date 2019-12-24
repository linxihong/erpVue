// 引入 axios
import axios from 'axios'
import Vue from 'vue'

var baseurl = _baseurl();

export function _baseurl() {
    var baseurl='';
    if (process.env.NODE_ENV != "development") {
        /(localhost.*$)/.test(location.hostname) ||
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(location.hostname)?
            baseurl = location.protocol + "//" + location.hostname + ":"+location.port+"/api"  :
            baseurl = location.protocol + "//" + location.hostname + "/api" ;
    } else {
        baseurl = "/api"
    }
    return baseurl
}

//http://blog.csdn.net/zhaohaixin0418/article/details/68488136

axios.defaults.baseURL = baseurl;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const _setheaders = (key,val) => {
    sessionStorage.getItem('_au')?axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('_au'):'';
}

const _iflogin = (url) => {
    var _whitelist = {
        '/uaa/oauth/token':true
    }

    if(sessionStorage.getItem('_au')==undefined&&_whitelist[url]!=true){
        return false
    }else{
        return true
    }
}
const _setbaseurl = (url) => {
    var _whiteUrls={
        '/oauth/token':'/api',
        '/uaa/oauth/token':'/api'
    };
    if(_whiteUrls[url]==undefined){
        //url = "/sys" + url;
    }
    return url;
}

export function _fetch(url, params, config) {
    _setheaders();
    return _iflogin(url)&&axios.post(url, params, config).then(response => {
        return response.data;
    }).catch((err) => {
        if(err && err.response) {
            return {msg:err.response.data,status:err.response.status};
        }else {
            return {msg:err,status:err};
        }
    })
}
export function _getAjax(url, config) {
    _setheaders();
    return _iflogin(url)&&new Promise((resolve, reject) => {
        axios.get(url,config)
            .then(response => {
                resolve(response.data);
            })
            .catch((error) => {
                if(error && error.response) {
                    resolve({msg:error.response.data,status:error.response.status,});
                }else {
                    resolve({msg:error,status:error});
                }
            })
    })
}
export function _putAjax(url, params, config) {
    _setheaders();
    return axios.put(url, params, config).then(response => {
        return response.data;
    }).catch((err) => {
        return {msg:err.response.data,status:err.response.status,};
    })
}
export function _deleteAjax(url, config) {
    _setheaders();
    return new Promise((resolve, reject) => {
        axios.delete(url,config)
            .then(response => {
                resolve(response.data)
            })
            .catch((error) => {
                resolve({msg:error.response.data,status:error.response.status,});
            })
    })
}

// 添加一个请求拦截器
axios.interceptors.request.use( (config) => {
    // Do something before request is sent
    ////console.log('request',config,this);//this.$store.state.systemid
    ////console.log('request',config);//this.$store.state.systemid
    return config;
}, function (error) {
    // Do something with request error
    ////console.log('request error',error);//this.$store.state.systemid
    return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use((response)=> {
    // Do something with response data
    ////console.log('response',response);//this.$store.state.systemid
    return response;
}, function (error) {
    // Do something with response error
    ////console.log('response error',error);//this.$store.state.systemid
    return Promise.reject(error);
});
