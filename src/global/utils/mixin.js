/**
 * Created by wxiao on 2017/6/21.
 */
import {_fetch, _getAjax, _putAjax, _deleteAjax, _baseurl} from '$src/utils/api.js'
import {_routes} from '$src/router/'
import Qs from 'qs'
import Vue from 'vue'

import * as cookies from '$src/utils/cookies.js'

const DevType = false;//true;//  false;//

Array.prototype.contains = function (item) {
    return RegExp("\\b" + item + "\\b").test(this);
};

var _contains = (parentEle, childEle) => {
    if (parentEle) {
        if (parentEle === childEle) {
            return true;
        }
        if (parentEle && parentEle.contains) {
            return parentEle.contains(childEle);
        }
        return !!(parentEle.compareDocumentPosition(childEle) & 16);
    } else {
        return false;
    }

}

export default {
    data() {
        return {
            /* 变量 */
            navlist: [],
            orgtypelist: [],
            empTypelist: [],
            statuslist: [],
            provincelist: [],
            nationnalitylist: [],

            marriagelist: [],
            politicalstatuslist: [],
            sexlist: [],
            isregempflaglist: [],

            DevType: DevType,
            als: {},
            contextmenuDialog: {
                position: 'absolute',
                zIndex: '-1',
                data: {},
            },
            multipleSelection: [],
            cTotal: 0,
            cPage: 1,
            cSize: 10,
            //二级导航选中项
            secondnavstatus: this.$route && this.$route.meta && this.$route.meta.secondnavstatus ? this.$route.meta.secondnavstatus : this.$route && this.$route.name ? this.$route.name : '',
            pageReadonly: false,
            /* 函数*/

            /* 静态数据 */
            confirmStatus: [],
            cpageSizes: [10, 20, 50, 100],
            // dateOption: {
            //     shortcuts: [{
            //         text: '最近一周',
            //         onClick(picker) {
            //             const end = new Date();
            //             const start = new Date();
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            //             picker.$emit('pick', [start, end]);
            //         }
            //     }, {
            //         text: '最近一个月',
            //         onClick(picker) {
            //             const end = new Date();
            //             const start = new Date();
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            //             picker.$emit('pick', [start, end]);
            //         }
            //     }, {
            //         text: '最近三个月',
            //         onClick(picker) {
            //             const end = new Date();
            //             const start = new Date();
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            //             picker.$emit('pick', [start, end]);
            //         }
            //     }]
            // }
        }
    },
    created() {

    },
    mounted() {
        //详情页面只读
        this.$handlePageType('detail') == true ? this.pageReadonly = true : '';
        //是否进行了登陆
        this.ifLogin();
    },
    computed: {},
    watch: {},
    methods: {
        // ----------------------------------------------------------------------
        // -------------------------------- 铝型材 -------------------------------
        // @param {Object} queryModel - 查询对象
        // @param {Boolean} isQ - ?
        // @return {String} queryString - 查询字符串
        mixinToQueryString(queryModel, isQ = false) {
            var queryString = '',
                isInit = false;

            this.$lodash.forEach(queryModel, (value, key) => {

                if (value) {
                    if (!isInit) {
                        if (isQ) {
                            queryString += '?'
                        } else {
                            queryString += '&'
                        }
                        isInit = true
                    }

                    if (queryString == '?' || queryString == '&') {
                        queryString += `${key}=${value}`
                    } else {
                        queryString += `&${key}=${value}`
                    }
                }
            })
            return queryString
        },
        mixinIsObjectEmpty(obj) {
            var flag = true;
            this.$lodash.forEach(obj, (value, key) => {
                if (value != '') {
                    // TODO: 字符串''不是唯一的空值
                    flag = false
                }
            })
            return flag
        },
        // @param {Object} res - 后台返回数据对象
        // @param {Function} succ - 成功回调
        // @param {Function} fail - 失败回调
        // @param {Object} config - 配置对象
        // @return {}
        mixinEleMessage(res, succ = () => {
        }, fail = () => {
        }, config = {noSuccMsg: false, noFailMsg: false}) {
            if (res.status == 200) {
                succ(res);
                if (config && !config.noSuccMsg) {
                    this.$message({
                        showClose: true,
                        message: res.message || res.msg.message,
                        type: 'success'
                    });
                }
            } else {
                fail()
                if (config && !config.noFailMsg) {

                    this.$message({
                        showClose: true,
                        message: res.message || res.msg.message,
                        type: 'warning'
                    });
                }

            }
        },
        mixinSetObjectEmpty(obj) {
            this.$lodash.forEach(this.$lodash.cloneDeep(obj), (value, key) => {
                obj[key] = ''
            })
        },
        // ------------------------------ END 铝型材 -----------------------------
        // ----------------------------------------------------------------------
        //  systemid 赋值
        handlesetSystemid() {
            _.each(this.$store.getters.getSideNavlist, (v, k) => {
                if (k == sessionStorage.getItem('sideValue')) {
                    sessionStorage.setItem('systemid', v.systemid)
                    this.$store.state.systemid = v.systemid;
                }
            })
        },
        'ifValue'(a, b) {
            return a == undefined || JSON.stringify(a) == '{}' ? b : a;
        },
        /*
         获取权限数据
         使用方式:
            在需要获取权限数据的mounted周期中添加下面方法
             mounted () {
                this.getAuthlist()
            },
         */
        getAuthlist() {
            var target = this.$store.state.activenavItem.alias;
            sessionStorage.removeItem('_als');
            this.als = {};
            this.getAjax('sys/res/accessAuthority/' + target).then((result) => {
                if (result.status == '200') {
                    sessionStorage.setItem('_als', JSON.stringify(result.data));
                    this.als = result.data;
                }
            })
        },
        /*
        权限控制
        使用方式: v-auth="ifHasAuth('save')" @click="ifHasAuth('save')&&$routeTo('msm_account_add')"
        v-auth目前用于控制样式
        e.g.  <el-button v-auth="ifHasAuth('save')" @click="ifHasAuth('save')&&$routeTo('msm_account_add')">添加</el-button>
        */
        ifHasAuth(val) {
            //默认没有权限
            var ifCloseAuth = true,//false,//为true则不控制权限，页面资源完全展示,方便平时开发
                _result = true,//false,true
                whitelist = {
                    //'zh_add':true,
                },
                _authlist = {},
                value = val ? val.toLowerCase() : '';
            _authlist = this.als;
            if (sessionStorage.getItem('_als') != undefined) {
                _authlist = JSON.parse(sessionStorage.getItem('_als'))//this.als//
            }
            //console.log('_authlist',_.isEmpty(_authlist))
            //使用权限接口的数据进行权限判断
            if (_authlist[value] != undefined && _authlist[value] == true || _.isEmpty(_authlist) == true) {
                _result = true;
            }
            if (_authlist[value] != undefined && _authlist[value] == false) {
                _result = false;
            }
            //使用本地数据进行权限判断
            if (whitelist[value] != undefined) {
                _result = whitelist[value];
            }
            //ifCloseAuth==false?'':_result = true;
            return _result;
        },
        /* Int转String */
        baseurl: _baseurl,
        handletoString(data, opt) {
            //console.log(typeof data,data)
            return data && (typeof data) != 'string' ? data.toString() : data;
        },
        /* 判断权限 */
        loginStatus() {
            return (sessionStorage.getItem('_au') == undefined && this.$route && this.$route.matched[0].path == '/master') == false
        },
        /* 判断权限 */
        ifLogin() {
            if (sessionStorage.getItem('_au') == undefined && this.$route && this.$route.matched[0].path == '/master') {
                this.$routeTo("login");
                //this.$message.warning('请登陆！');
                //console.log('没有登陆，退出到登陆页面!');
            }
        },
        /* 请求函数 */
        fetch(url, params, config) {
            //console.log('fetch',url, params, config)
            config == undefined ? config = {} : "";
            DevType && DevType == true ? config.timeout = 10 : '';
            config.headers == undefined ? config.headers = {} : '';
            //console.log(url,this.$store.state.systemid)
            config.headers.systemid ? '' : config.headers.systemid = this.$store.state.systemid;
            return _fetch(url, params, config).then(result => {
                if( result.reqUrl) {
                    result.reqUrl = url;
                }
                this.afteryAjax(result);
                return result
            })
        },
        getAjax(url, config) {
            config == undefined ? config = {} : "";
            DevType && DevType == true ? config.timeout = 10 : '';
            config.headers == undefined ? config.headers = {} : '';
            config.headers.systemid ? '' : config.headers.systemid = this.$store.state.systemid;
            return _getAjax(url, config).then(result => {
                this.afteryAjax(result);
                return result
            })
        },
        putAjax(url, params, config) {
            config == undefined ? config = {} : "";
            DevType && DevType == true ? config.timeout = 10 : '';
            config.headers == undefined ? config.headers = {} : ''
            config.headers.systemid ? '' : config.headers.systemid = this.$store.state.systemid;

            return _putAjax(url, params, config).then(result => {
                this.afteryAjax(result);
                return result
            })
        },
        deleteAjax(url, config) {
            config == undefined ? config = {} : "";
            DevType && DevType == true ? config.timeout = 10 : '';
            config.headers == undefined ? config.headers = {} : '';
            config.headers.systemid ? '' : config.headers.systemid = this.$store.state.systemid;

            return _deleteAjax(url, config).then(result => {
                this.afteryAjax(result);
                return result
            })
        },
        afteryAjax(result) {
            if (result.status == 401 && result.msg.error == 'invalid_token') {
                let i = 3, intervalid;
                intervalid = setInterval(() => {
                    if (i === 0) {
                        this.$routeTo('login');
                        clearInterval(intervalid);
                        return false;
                    }
                    this.$message.warning(`token过期，${i}秒后跳转至登录页重新登录`);
                    i--;
                }, 1000)
            } else if (result.status === 500) {
                let isZull = ((result.msg && result.msg.exception) || '').indexOf('ZuulException') != -1;
                var msg = '';
                if (isZull) {
                    var reqUrl = result.reqUrl || '';
                    // TODO: 重构
                    var systemName = ''
                    if (reqUrl.startsWith('/oms')) {
                        systemName = '营销管理服务';
                    } else if (reqUrl.startsWith('/crm')) {
                        systemName = '客户管理服务';
                    } else if (reqUrl.startsWith('/basedata')) {
                        systemName = '基础数据服务';
                    }  else if (reqUrl.startsWith('/sys')) {
                        systemName = 'core-sys服务';
                    }
                    msg = '【'+(systemName || '未知服务') +'】' + '正在重启,请稍后再试。。。'
                    this.$message.warning(msg);
                } else if (result && result.msg && result.msg.error) {
                    this.$message.warning(result.msg.error);
                }
            }

        },
        // 用于登陆页面 清理数据
        cleandata: function (data) {
            sessionStorage.clear('_au');
            sessionStorage.clear('_um');
            sessionStorage.removeItem('sidenavlist');
            sessionStorage.removeItem('_u');
            sessionStorage.removeItem('_au');
            sessionStorage.removeItem('_als');

            cookies.deleteItem('_ts');
            cookies.deleteItem('_tk');
            cookies.deleteItem('uname');

            this.$store.state.navtaglist = [];

            sessionStorage.removeItem('sideValue');
            sessionStorage.removeItem('systemid');
            if (!sessionStorage.getItem('_au') && !sessionStorage.getItem('_um')) {
                console.log('Data cleaned!')
            }
        },
        $navCollapse(statue) {
            console.log('$navCollapse', statue)
        },
        /* 过滤没有数据的字段 */
        objfilter(obj) {
            var _result = {}
            var blacklist = [ // 必填字段校验
                // {name: "startDate"},
            ]
            if (obj != undefined) {
                for (var i in obj) {
                    if ((_.isNumber(obj[i]) || obj[i] != '') && !_.isUndefined(obj[i]) && !_.isNull(obj[i])) {
                        _result[i] = obj[i];
                        for (var j in blacklist) {
                            if ((obj[i] == '' || _result[i] == undefined) && i == blacklist[j].name) {
                                delete _result[i]
                            }
                        }
                    }

                }
            }
            return _result
        },
        /* 跳转页面 params */
        $routeTo(name, params, query) {
            if (query) {
                query.systemid = this.$route.query.systemid
            } else {
                query = {systemid: this.$route.query.systemid}
            }
            //console.log(query)
            this.$router.push(this.objfilter({name: name, params: params, query: query}))
        },
        /* 跳转页面 query */
        $routeToWithQuery(name, query) {
            //console.log(query,query==undefined)
            query == undefined ? query = {} : '';
            query.systemid = this.$route.query.systemid;
            this.$router.push(this.objfilter({name: name, query: query}))
        },
        /* 页面类型判断 */
        $handlePageType(type) {
            if (type && this.$route && this.$route.meta && this.$route.meta.pageType) {
                //console.log('PageType',this.$route.meta.pageType,type)
                return this.$route.meta.pageType == type;
            }
        },
        /* 确认密码 */
        validateCheckPsd: (rule, value, callback, check) => {

            //console.log(rule, value,check)

            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== check) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        },
        /*数组校验*/
        validataArrayReq: (rule, value, callback) => {
            //console.log('validataArrayReq',value,rule)
            if (value.length == 0) {
                callback(new Error());
            } else {
                callback();
            }
        },
        /* 汉字校验 */
        validateChar: (rule, value, callback) => {
            var reg = /[^[a-zA-Z0-9]+$/;
            //console.log('rule',reg.test(value))
            if (reg.test(value)) {
                callback(new Error('不能输入汉字!'));
            } else {
                callback();
            }
        },
        /* 英文字母或下划线校验 */
        validataString: (rule, value, callback) => {
            var reg = /^[a-zA-Z0-9_]+$/;//英文校验 |[\uE7C7-\uE7F3]
            //console.log('validataString',reg.test(value))
            if (!reg.test(value)) {
                callback(new Error('包含英文字母或下划线!'));
            } else {
                callback();
            }
        },
        /* 手机号校验 */
        validataPhone: (rule, value, callback) => {
            var reg = /^1[2|3|4|5|6|7|8][0-9]\d{4,8}$/;//英文校验 |[\uE7C7-\uE7F3]
            //console.log('validataString',reg.test(value))
            if (!reg.test(value) && value !== '' && value != undefined) {
                callback(new Error('包含英文字母或下划线!'));
            } else {
                callback();
            }
        },
        /* 手机号校验 */
        validataPhoneShort: (rule, value, callback) => {
            var reg = /^\d+(\-\d+)?$/;//英文校验 |[\uE7C7-\uE7F3]
            //console.log('validataString',reg.test(value))
            if (!reg.test(value) && value !== '' && value != undefined) {
                callback(new Error('包含英文字母或下划线!'));
            } else {
                callback();
            }
        },
        /* 电话号校验 */
        validataTelephone: (rule, value, callback) => {
            var reg = /^\d+(\-\d+)?$/;//英文校验 |[\uE7C7-\uE7F3]
            //console.log('validataString',reg.test(value))
            if (!reg.test(value) && value !== '' && value != undefined) {
                callback(new Error('包含英文字母或下划线!'));
            } else {
                callback();
            }
        },
        /* 身份证号码校验 */
        validataIdentityNumber: (rule, value, callback) => {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;//英文校验 |[\uE7C7-\uE7F3]
            //console.log('validataString',reg.test(value))
            if (!reg.test(value) && value !== '' && value != undefined) {
                callback(new Error('包含英文字母或下划线!'));
            } else {
                callback();
            }
        },
        /* 排序校验 */
        validataSort: (rule, value, callback) => {
            if (/^[0-9]+$/.test(value) == false && value !== '' && value != undefined) {
                callback(new Error());
            } else {
                callback();
            }
        },
        /* 请求响应之后处理*/
        $handleRes(result) {
            if (result.status == '200') {
                this.$message({
                    message: result.message,
                    type: 'success'
                });
            } else if (result.status == '-200') {
                //console.log(result.error)
                this.$message.warning(result.message);
            }
        },
        /* 修改按钮判断 */
        $handleEditClick(data, opt, id) {
            if (opt.type == 'edit') {
                if (data.length > 1) {
                    this.$message.warning('不能选择多项修改')
                } else if (data.length == 1) {
                    id ? this.$routeTo(opt.routeTo, {id: data[0][id]}) : this.$routeTo(opt.routeTo, {id: data[0].userid})
                } else {
                    this.$message.warning('请选择一项修改')
                }
            }
        },
        /* 表格单选框 */
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /* 生成树 */
        handleListToSingleTree(obj, options) {
            var mainTr = [], depths = {}, cid = 'typeid', labelName = 'typename';
            options == undefined ? options = {} : '';
            options && options.cid ? cid = options.cid : '';
            options && options.labelName ? labelName = options.labelName : '';
            //设置icon展示
            if (options.handleIconset == undefined) {

                options.handleIconset = (data, options) => {
                    return options.default;
                }
            }

            if (obj && obj.length > 1) {
                obj = obj.sort(function (x, y) {
                    if (x.depth > y.depth) {
                        return 1;
                    } else if (x.depth < y.depth) {
                        return -1;
                    } else {
                        return 0
                    }
                })
                var mindepth = obj[0].depth, maxndepth = obj[obj.length - 1].depth;

                obj.map(function (val, key) {
                    depths[val.depth] ? depths[val.depth].push(val) : depths[val.depth] = [val];
                })

                for (var i = maxndepth; i >= mindepth; i--) {
                    //console.log('val1',i ,mindepth,maxndepth)
                    if (depths[i]) {
                        if (i != mindepth) {
                            var _thisdepths = depths[i], _nextdepths;
                            for (var d = 1; d < 10; d++) {
                                if (depths[i - d]) {
                                    _nextdepths = depths[i - d];
                                    break
                                }
                            }
                            _thisdepths.map(function (val1, key) {
                                //console.log(val1.children.length,val1.depth,maxndepth)
                                _nextdepths.map(function (val, key) {
                                    if (val1.parentid == val[cid]) {
                                        val1.label = val1[labelName];
                                        val1.id = val1[cid];

                                        if (val1.depth == maxndepth) {
                                            val1.icon = options.handleIconset(val1, {default: 'fa fa-file'});
                                        } else if (val1.children && val1.children.length == 0) {
                                            val1.icon = options.handleIconset(val1, {default: 'fa fa-file'});
                                        } else {
                                            val1.icon = options.handleIconset(val1, {default: 'fa fa-folder'});
                                        }

                                        val.label = val[labelName];
                                        val.id = val[cid];
                                        val.icon = options.handleIconset(val, {default: 'fa fa-folder'});
                                        val.children ? val.children.push(val1) : val.children = [val1];

                                    }
                                })
                            })
                        } else if (i == mindepth && i == maxndepth) {
                            depths[mindepth].map(function (val, key) {
                                val.label = val[labelName];
                                val.id = val[cid];
                                val.icon = options.handleIconset(val1, {default: 'fa fa-folder'});

                                val.index = 0;
                                mainTr.push(val);
                            })
                        } else {
                            depths[mindepth].map(function (val, key) {
                                val.index = 0;
                                val.icon = options.handleIconset(val, {default: 'fa fa-folder'});
                                mainTr.push(val);
                            })
                        }
                    }
                }
            } else {
                obj.map(function (val, key) {
                    val.label = val[labelName];
                    val.id = val[cid];
                    val.icon = 'fa fa-folder';
                    val.index = 0;

                    mainTr.push(val);
                })
            }

            /* 排序 */
            const _childrenSort = (val1, key) => {
                //console.log('handleTreeListSort',val1.children,key)
                if (val1.children && val1.children.length > 0) {
                    return this.handleTreeListSort(val1.children, {sortby: 'sort'}, _childrenSort)
                }
            };

            mainTr.map((val, key) => {
                val.children = _childrenSort(val)
            })
            //console.log('mainTr',mainTr)
            return mainTr;
        },
        /* 生成导航树 */
        handlenavListToSingleTree(obj, options) {
            var mainTr = [], depths = {}, cid = 'typeid', labelName = 'typename', cicon = 'icon';
            options && options.cid ? cid = options.cid : '';
            options && options.labelName ? labelName = options.labelName : '';
            options && options.icon ? cicon = options.icon : '';

            if (obj && obj.length > 1) {
                obj = obj.sort(function (x, y) {
                    if (x.depth > y.depth) {
                        return 1;
                    } else if (x.depth < y.depth) {
                        return -1;
                    } else {
                        return 0
                    }
                })
                var mindepth = obj[0].depth, maxndepth = obj[obj.length - 1].depth;

                obj.map((val, key) => {

                    val.route = {};
                    val.route.query = {};
                    val.route.params = {};
                    //val['defaulturl']!=undefined&&val['defaulturl']!=''?val.rindex=val['defaulturl']:val.rindex=val.resid.toString();
                    //this._isNull(val['alias'])!=undefined?val.rindex=val['alias']:val.rindex='master'+options.datakey;
                    if (val['defaulturl'] && val['defaulturl'].indexOf('?') >= 0) {
                        var _url = val['defaulturl'].split('?');
                        var _querys = _url[1].split('&');

                        val.route.name = _url[0]

                        _.each(_querys, v => {
                            if (v.indexOf('=') >= 0) {
                                var _q = v.split('=');
                                if (v.indexOf('p_') == 0) {
                                    val.route.params[_q[0].replace("p_", '')] = _q[1];
                                }
                                if (v.indexOf('q_') == 0) {
                                    val.route.query[_q[0].replace("q_", '')] = _q[1];
                                }
                            }
                        })
                    } else {
                        val['defaulturl'] ? val.route.name = val['defaulturl'] : '';
                    }
                    //val['systemid'] ? val.route.query.systemid = val['systemid'] : '';

                    val['systemid'] ? val.rindex = 'resid_' + val['resid'] : '';

                    if (val.defaulturl.indexOf('openurl') >= 0) {
                        //openurl_Https://www.baidu.com
                        val.route.name = 'iframe';
                        val.defaulturl = val.defaulturl.replace('openurl_', '')
                    }
                    if (val.defaulturl.indexOf('reportpath_') >= 0) {
                        val.route.name = 'reports';
                        val.route.params.id = val.defaulturl.replace('reportpath_', '');
                    }

                    val.icon = val[cicon];
                })

                obj.map(function (val, key) {
                    depths[val.depth] ? depths[val.depth].push(val) : depths[val.depth] = [val];
                })

                //console.log(obj,mindepth,maxndepth)
                for (var i = maxndepth; i >= mindepth; i--) {
                    //console.log('depths',i ,depths[i])
                    if (depths[i]) {

                        if (i != mindepth) {

                            var _thisdepths = depths[i], _nextdepths;
                            for (var d = 1; d < 10; d++) {
                                if (depths[i - d]) {
                                    _nextdepths = depths[i - d];
                                    break
                                }
                            }

                            _thisdepths.map(function (val1, key) {
                                //console.log('val1',i,d,mindepth,maxndepth)
                                _nextdepths.map(function (val, key) {
                                    if (val1.parentid == val[cid]) {
                                        val1.name = val1[labelName];
                                        val1.id = val1[cid];
                                        if (val1.depth == maxndepth) {
                                            val1.icon = 'fa fa-file';
                                        } else if (!val1.children) {
                                            val1.icon = 'fa fa-file';
                                        } else {
                                            val1.icon = 'fa fa-folder';
                                        }

                                        val.name = val[labelName];
                                        val.id = val[cid];

                                        val.children ? val.children.push(val1) : val.children = [val1];

                                    }
                                })
                            })
                        } else if (i == mindepth) {//&&i==maxndepth
                            depths[mindepth].map(function (val, key) {
                                val.name = val[labelName];
                                val.id = val[cid];
                                val.index = 0;
                                mainTr.push(val);
                            })
                        } else {
                            depths[mindepth].map(function (val, key) {
                                val.index = 0;
                                val.name = val[labelName];
                                mainTr.push(val);
                            })
                        }

                    }
                }
            } else if (this._isNull(obj)) {

                obj.map((val, key) => {
                    val.name = val[labelName];
                    val.id = val[cid];

                    val.route = {};
                    val.route.query = {}
                    val['defaulturl'] ? val.rindex = val['defaulturl'] : val.rindex = 'master' + options.datakey;
                    //this._isNull(val['alias'])!=undefined?val.rindex=val['alias']:val.rindex='master'+options.datakey;
                    val['defaulturl'] ? val.route.name = val['defaulturl'] : '';
                    val['systemid'] ? val.route.query.systemid = val['systemid'] : '';
                    val.icon = val[cicon];

                    val.index = 0;

                    //console.log(val.resname,val.rindex)

                    mainTr.push(val);
                })
            }
            /* 调整上下级 */
            const _changeDepth = (_mainTr, _parent) => {
                for (var key in _mainTr) {
                    var val = _mainTr[key];
                    if (val && val.isdisplayinmenu == 0 && val.depth > 1) {
                        //console.log(val,val.isdisplayinmenu,val.children,val.resname)
                        if (val.children) {
                            val.children.forEach(item => {
                                //console.log(item,item.resname,_parent,_parent.children)//item.isdisplayinmenu,item.children,
                                _parent && _parent.children ? _parent.children.push(item) : ''
                            })
                        }
                    } else {
                        val && val.children ? _changeDepth(val, _mainTr) : ''
                    }
                }
                return _parent
            }
            //_changeDepth(mainTr)

            /* 排序 */
            const _childrenSort = (val1, key) => {
                //console.log('handleTreeListSort',val1.children,key)
                if (val1.children && val1.children.length > 0) {
                    return this.handleTreeListSort(val1.children, {sortby: 'sort'}, _childrenSort)
                }
            };

            var _mainTr = mainTr;
            mainTr.map((val, key) => {
                val = _changeDepth(val.children, val);
                //console.log(val)
            })
            //console.log(mainTr)
            //mainTr = _mainTr;
            mainTr.map((val, key) => {
                val.children = _childrenSort(val)
            })

            return mainTr;
        },

        /* 数组排序 */
        handleTreeListSort(list, options, fn) {
            var _sortby = options.sortby || 'sort', result = [];

            list.sort((a, b) => {
                return a[_sortby] < b[_sortby] ? -1 : 1;
            })

            //console.log(list);
            _.each(list, fn);
            return list;
        },
        /* 生成树 */
        handleListToTree(obj, options) {
            var mainTr = [];
            options == undefined ? options = {} : "";
            if (_.isArray(obj) == true) {
                if (options.type && (options.type == 'permission' || options.type == 'accountsmanagement')) {
                    obj.map((val, key) => {
                        mainTr.push(this.handleListToSingleTree([val], options)[0])
                    })
                } else {
                    obj.map((val, key) => {
                        if (val.list && options && options.type && options.type == 'nav') {
                            options.datakey = key;
                            mainTr.push(this.handlenavListToSingleTree(val.list, options)[0])
                        } else if (val.list) {
                            //console.log('val.list')
                            mainTr.push(this.handleListToSingleTree(val.list, options)[0])
                        }
                    })
                }
            }
            //console.log(mainTr)
            return mainTr;
        },

        /* dev Int批量转String */
        handleAddformItems(data, opt) {
            var _result = [], _form = {};
            _.each(data, function (val, key) {
                var _val = val.split(" ");
                _form[_val[2]] = "";
                switch (_val[1]) {
                    case 'String':
                        _result.push('<el-form-item prop="' + _val[2] + '" label="' + _val[2] + '"> <el-input v-model="form.' + _val[2] + '"></el-input> </el-form-item>')
                        break;
                    case 'Integer':
                        _result.push('<el-form-item prop="' + _val[2] + '" label="' + _val[2] + '"><el-select v-model="form.' + _val[2] + '" placeholder="请选择类型"><el-option label="管理员" value="1"></el-option><el-option label="客户子帐号" value="5"></el-option></el-select></el-form-item>')
                        break;
                    case 'Long':
                        _result.push('<el-form-item prop="' + _val[2] + '" label="' + _val[2] + '"><el-radio-group v-model="form.' + _val[2] + '"><el-radio label="1">是</el-radio><el-radio label="0">否</el-radio></el-radio-group></el-form-item>')
                        break;
                    case 'Date':
                        //_result.push('<el-form-item prop="'+_val[2]+'" label="'+_val[2]+'"><el-date-picker v-model="form.'+_val[2]+'" type="date" placeholder="选择日期"></el-date-picker></el-form-item>')
                        _result.push('<el-table-columnprop="' + _val[0] + '" label="' + _val[1] + '" width="100"></el-table-column>')
                        break;
                }
            })
            //console.log(_result.toString(),JSON.stringify(_form))
        },

        /* dev 字符串匹配 可删除*/
        handlefilterstring(data, opt) {
            var _result = [], _result2 = [], _result3 = [], _result4 = {}, b = 0;
            _map(data, /',/g, function (value, key1) {
                _map(value, / comment '/g, function (value1, key) {
                    //console.log(value1,key)
                    var a = key % 2;
                    value1 = value1.trim();
                    if (key == 0) {
                        if (a == 0) {
                            b++;
                            _result2[b] = new Array();
                        }
                        //_result2[b].push(value1)
                        _map(value1, /  /g, (value2, key) => {
                            if (key == 0) {
                                //console.log(value2)
                                _result2[b].push(value2)
                            }
                        })
                    }
                    if (key == 1) {
                        //console.log(value1)
                        _result2[b].push(value1)
                    }
                })
            });
            var _result31 = [], _result32 = [], _result33 = [];
            _result2.map(function (val, key) {
                //console.log(val)
                _result4[val[0]] = val[1]
                _html(val);
            })
            console.log(JSON.stringify(_result4))
            console.log(_result31.toString())
            console.log(_result32.toString())
            console.log(_result33.toString())

            function _html(_val) {
                switch (_val[0]) {
                    case 'String':
                        _result3.push('<el-form-item prop="' + _val[0] + '" label="' + _val[1] + '"> <el-input v-model="form.' + _val[0] + '"></el-input> </el-form-item>')
                        break;
                    case 'Integer':
                        _result3.push('<el-form-item prop="' + _val[0] + '" label="' + _val[1] + '"><el-select v-model="form.' + _val[0] + '" placeholder="请选择类型"><el-option label="管理员" value="1"></el-option><el-option label="客户子帐号" value="5"></el-option></el-select></el-form-item>')
                        break;
                    case 'Long':
                        _result3.push('<el-form-item prop="' + _val[0] + '" label="' + _val[1] + '"><el-radio-group v-model="form.' + _val[0] + '"><el-radio label="1">是</el-radio><el-radio label="0">否</el-radio></el-radio-group></el-form-item>')
                        break;
                    case 'Date':
                        _result3.push('<el-form-item prop="' + _val[0] + '" label="' + _val[1] + '"><el-date-picker v-model="form.' + _val[0] + '" type="date" placeholder="选择日期"></el-date-picker></el-form-item>')
                        break;
                    default:
                        _result31.push('<el-col :span="12"><el-form-item prop="' + _val[0] + '" label="' + _val[1] + '"> <el-input v-model="form.' + _val[0] + '"></el-input> </el-form-item></el-col>')
                        _result32.push("" + _val[0] + ": [{ required: true, message: '请输入" + _val[1] + "', trigger: 'blur' }]")
                        _result33.push('<el-table-column prop="' + _val[0] + '" label="' + _val[1] + '" width="100"></el-table-column>')
                        break;
                }
            }

            function _map(data, exp, fn) {
                data.split(exp).map(fn)
            }
        },


        /* Int批量转String */
        handleItemstoString(data, opt) {
            if (data) {
                _.each(opt, function (val, key) {
                    if (data[val] != undefined) {
                        data[val] = data[val].toString();
                    }
                })
            }
            return data;
        },
        /* date 格式化*/
        formatDate(date, type) {
            if (new Date(date) == 'Invalid Date') {
                return date;
            } else if (date != undefined) {
                date = new Date(date);
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let M = date.getMinutes();
                M = M < 10 ? ('0' + M) : M;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                switch (type) {
                    case "hms":
                        return y + '-' + m + '-' + d + " " + h + ':' + M + ':' + s;
                    case "timestamp":
                        return Date.parse(date);
                    case "ymdhM":
                        return y + '-' + m + '-' + d + " " + h + ':' + M;
                    case "md":
                        return m + '-' + d;
                    case "d":
                        return d;
                    default:
                        return y + '-' + m + '-' + d;
                }
            }
        },
        contains(parentEle, childEle) {
            if (parentEle) {
                if (parentEle === childEle) {
                    return true;
                }
                if (parentEle && parentEle.contains) {
                    return parentEle.contains(childEle);
                }
                return !!(parentEle.compareDocumentPosition(childEle) & 16);

            } else {
                return false;
            }

        },
        /* 隐藏树 */
        hidetreeContextmenu(event, node, el) {
            document.addEventListener('click', function (e) {
                var contain = _contains(document.getElementById('contextmenuDialog'), e.target);
                document.getElementById('contextmenuDialog') ? document.getElementById('contextmenuDialog').style.zIndex = '-1' : ''
            });
        },
        /* 设置树的样式 */
        treeContextmenu(event, node, el) {
            //console.log('contextmenu',event.clientX,event.clientY,node.data.label)
            //this.contextmenuDialog.top=event.clientY;
            //this.contextmenuDialog.left=event.clientX;  v-if="!this.contextmenuDialog.data.parentid"
            this.contextmenuDialog.data = node.data;
            if (el) {
                el.style.position = 'fixed';
                el.style.top = event.clientY + 'px';
                el.style.left = event.clientX + 'px';
                el.style.zIndex = '1000';
            }
        },
        /* 代码管理 树 选中 */
        handleTreerender__code(h, {node}) {
            return this.handleTreerender(h, {node}, {
                class: this.$route.query.typeid && this.$route.query.typeid == node.data.typeid ? 'node-currented' : null
            })
        },
        /* 组织管理 树 选中 */
        handleTreerender__group(h, {node}) {
            return this.handleTreerender(h, {node}, {
                class: this.$route.params.id && this.$route.params.id == node.data.orgid ? 'node-currented' : null
            })
        },
        /* 权限管理 树 选中 */
        handleTreerender__permission(h, {node}) {
            //console.log(this.$route.params.id,node.data.userid,node.data.roleid)
            if (this.$route.params.id) {
                var _typeid = this.$route.query.typeid, _id = this.$route.params.id;
                if (_typeid == '1' || _typeid == undefined) {
                    return this.handleTreerender(h, {node}, {
                        class: _id == node.data.roleid ? 'node-currented' : null
                    })
                } else if (_typeid == '2') {
                    return this.handleTreerender(h, {node}, {
                        class: _id == node.data.userid ? 'node-currented' : null
                    })
                }
            }
            return this.handleTreerender(h, {node}, {
                class: this.$route.query.typeid && this.$route.query.typeid == node.data.typeid ? 'node-currented' : null
            })
        },
        /* 权限管理 树 渲染 */
        handleTreerender(h, {node}, opt) {
            //console.log(node.data.label,node)
            if (node.data.icon) {
                var _dom = h('div', {
                    //class: opt&&opt.class?opt.class:'',
                    style: 'display:inline-block',
                    on: {
                        click: function (e) {
                            //console.log('click',e)
                        },
                        contextmenu: (event) => {
                            var event = event || window.event;
                            event.preventDefault();
                            this.treeContextmenu(event, node, this.$refs.contextmenuDialog)
                        },
                    },
                }, [
                    h('i', {class: node.data.icon + ' self-fa'}),
                    h('span', {
                        style: {
                            //paddingLeft: '10px'
                        },
                    }, node.data.label),
                ])
                //opt==undefined||opt.class==undefined?delete _dom.class:''
                return _dom
            } else {
                return h('div', {
                    style: {},
                }, node.data.label)
            }

        },
        /* 分类管理 删除节点 */
        handleDelCommon(url, fn, msg) {
            msg == undefined ? msg = '确定删除?' : '';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteAjax(url, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    this.$handleRes(result);
                    if (result.status == 200) {
                        //console.log(result,fn)
                        fn(result)
                    }
                })
            }, () => {
            })
        },
        /* 分类管理 删除节点 */
        handleDemensionDel(typeid, fn) {
            this.$confirm('确定删除？(将删除当前节点和当前节点之下所有节点)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteAjax('/sys/gltype/delete/' + typeid, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    this.$handleRes(result);
                    if (result.status == '200') {
                        fn(result)
                    }
                })
            }, () => {
            })
            /*if (confirm('确定删除？(将删除当前节点和当前节点之下所有节点)') == true) {
                this.deleteAjax('/sys/gltype/delete/' + typeid, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then((result) => {
                    this.$handleRes(result);
                    if (result.status == '200') {
                        fn(result)
                    }
                })
            }*/
        },
        /* 分类管理 节点排序 */
        handleDemensionSort(typeid, fn) {
            //updateSort
        },
        /* 深度复制 */
        commonObjCopy(parent, child) {
            var _result = {};
            _.each(parent, (v, k) => {
                v != undefined && v !== '' ? _result[k] = v : '';
            })
            //console.log(_result)
            return _result;
        },
        /* 深度复制 */
        deepCopy(parent, child) {
            child = child || {};
            for (var i in parent) {
                if (parent.hasOwnProperty(i)) {
                    //检测当前属性是否为对象
                    if (typeof parent[i] === "object") {
                        //如果当前属性为对象，还要检测它是否为数组
                        //这是因为数组的字面量表示和对象的字面量表示不同
                        //前者是[],而后者是{}
                        child[i] = (Object.prototype.toString.call(parent[i]) === "[object Array]") ? [] : {};
                        //递归调用extend
                        this.deepCopy(parent[i], child[i]);
                    } else {
                        child[i] = parent[i];
                    }
                }
            }
            return child;
        },
        /* 为空校验 */
        _isNull(data) {
            return (data == "" || data == undefined || data == null) ? null : data
        },
        /* 翻页通用 页数变化 */
        handleCurrentChange(val) {
            this.cPage = val;
            this.getlist();
        },
        /* 翻页通用 页数大小变化 */
        handleSizeChange(val) {
            this.cSize = val;
            this.getlist();
        },
        /*  isnull */
        /* 排序数字校验 */
        handlesortfilter(val) {
            //sort: [{validator: this.validataSort, message: '请输入有效数字且大于0', trigger: 'blur'}],
            if (/^[0-9]+$/.test(val) == false) {
                this.$message.warning('请输入有效数字且大于0');
                return null;
            } else {
                return true;
            }
        },
        /* 接口获取拼音 */
        getPingyin(val) {
            return new Promise((resolve, reject) => {
                if (val !== "" && val != undefined && this.$handlePageType('add') == true) {
                    return this.getAjax('/sys/unique/getPingyin/' + val, {
                        headers: {
                            systemid: this.$store.state.systemid
                        }
                    }).then(response => {
                        resolve(response.data);
                    })
                } else {
                    return Promise.resolve('');
                }
            })

        },
        /*  获取导航菜单 */
        getsidebar(val) {
            var _this = this;

            var _handletransnav = (_result) => {

                var result = this.deepCopy(_result);
                DevType && DevType == true ? result = _nav : '';
                //console.log('_handletransnav',result)

                if (result.status == '200') {
                    result.data = _this.handleListToTree(result.data, {
                        cid: "resid",
                        labelName: "resname",
                        type: 'nav'
                    });
                    return result
                } else {
                    return result
                }
            }

            return new Promise((resolve, reject) => {
                return this.getAjax('/sys/res/getAllRes/1')
                    .then(response => {
                        resolve(_handletransnav(response));
                        //resolve(_handletransnav(_nav));
                    })
            })
        },
        /*  获取数据字典数据 */
        getDicData(vals) {
            return new Promise((resolve, reject) => {
                //console.log('getDicData',vals)
                return this.getAjax('/sys/unique/getDic/' + vals.join(','), {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then(response => {
                    resolve(response);
                })
            })
        },
        postDicData(vals) {
            return new Promise((resolve, reject) => {
                //console.log('getDicData',vals)
                return this.fetch('/sys/unique/getDic', vals, {
                    headers: {
                        systemid: this.$store.state.systemid
                    }
                }).then(response => {
                    resolve(response);
                })
            })
        },
        /*  登陆 */
        getUser(u, p) {
            //sys/user/getuser
            this.getAjax('sys/user/getuser', {
                headers: {
                    systemid: this.$store.state.systemid,
                },
            }).then(result => {
                sessionStorage.setItem('_u', JSON.stringify(result.data))
                this.$store.commit('setUserinfo', result.data)
                //this.$store.state.userInfo = result.data();
                //console.log(result)
            })
        },
        logout(u, p) {
            this.$router.push({name: 'login'});
        },
        login(u, p) {
            return new Promise((resolve, reject) => {
                //console.log('getDicData',vals)
                return this.fetch('/uaa/oauth/token', Qs.stringify({
                    grant_type: 'password',
                    username: u,
                    password: p
                }), {
                    headers: {
                        systemid: this.$store.state.systemid,
                        Authorization: 'Basic enV1bDp6dXVs',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }).then(response => {
                    if (response.token_type && response.access_token) {
                        sessionStorage.setItem('_au', response.token_type + " " + response.access_token);
                        sessionStorage.setItem('_refresh', response.refresh_token);
                    }
                    resolve(response);
                })
            })
        },
        validNumber(rule, value, callback) {
            if (/[^\d]/g.test(value) == true) {
                callback(new Error());
            } else {
                callback();
            }
        },
        validPhone(rule, value, callback) {
            if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,11}$/.test(value)) {
                callback(new Error());
            } else {
                callback();
            }
        },
        validEmail(rule, value, callback) {
            if (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value) == false) {
                callback(new Error());
            } else {
                callback();
            }
        },
        //经度
        validlongitude(rule, value, callback) {
            if (/^[\-\+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/.test(value) == false) {
                callback(new Error());
            } else {
                callback();
            }
        },
        //纬度
        validlatitude(rule, value, callback) {
            if (/^[\-\+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/.test(value) == false) {
                callback(new Error());
            } else {
                callback();
            }
        },
        //小数金额
        validateNum_Point(rule, value, callback) {
            if (((value === '' || value === '0.00') && rule.ifNull != true) || /^[0-9]+(.[0-9]{1,2})?$/.test(value) == false) {
                if (rule.canNull == true && (value == undefined || value === '')) {
                    callback();
                } else {
                    callback(new Error());
                }
            } else {
                callback();
            }
        },
        /* 选中子项目 */
        handleTreeFirstItem(_array) {
            var _selectItem = [];
            var _each = (_arrays) => {
                _arrays.forEach(v => {
                    if (v.children) {
                        _each(v.children)
                    } else if (_selectItem.length == 0) {
                        _selectItem.push(v);
                    }
                })
            }
            _each(_array);
            return _selectItem
        },

        /*=============================yun=============================*/

        /* 英文字母开头校验 */
        validateEnglish: (rule, value, callback) => {
            var reg = /^[a-zA-Z][a-zA-Z0-9]*$/;
            //console.log('rule',reg.test(value))
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('英文字母开头,包含英文字母或数字!'));

            }
        },
        /* 英文大写字母校验 */
        validateBigEnglish: (rule, value, callback) => {
            var reg = /[^A-Z]+$/;
            //console.log('rule',reg.test(value))
            if (reg.test(value)) {
                callback(new Error('包含英文大写字母!'));
            } else {
                callback();
            }
        },
        /* 0-100的整型 */
        validateInteger: (rule, value, callback) => {
            var reg = /^(\d|[1-9]\d|100)$/;
            //console.log('rule',reg.test(value))
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('0-100的整型!'));
            }
        },
        /* 0-1000的整型 */
        validateThousand: (rule, value, callback) => {
            var reg = /^(?:\d{1,3}|1000)$/;
            //console.log('rule',reg.test(value))
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('0-1000的整型!'));
            }
        },
        /* 0-10000的整型 */
        validateMillion: (rule, value, callback) => {
            var reg = /(^[1-9]\d{0,3}$)|(^0\.\d{2}$)|(^[1-9]\d{0,3}\.\d{2}$)/;
            //console.log('rule',reg.test(value))
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('0-10000的整型!'));
            }
        },

        //获取最近日期
        recentDate(num, time) {
            let now = new Date();
            if (!time) {
                if (num === 'now') {
                    return this.formatDate(now.setDate((now.getDate())), 'hms');
                } else {
                    return this.formatDate(now.setDate((now.getDate() + num)), 'yy-mm-dd');
                }
            } else {
                return this.formatDate(now.setDate((now.getDate() + num)), 'yy-mm-dd') + time;
            }
        },

        //获取某一天的最近日期
        getAdayRecentDay(dd, n) {
            let strs = new Array();
            strs = dd.split("-");
            let y = strs[0];
            let m = strs[1];
            let d = strs[2];
            let t = new Date(y, m - 1, d);
            let str = t.getTime() + n * (1000 * 60 * 60 * 24);
            let newdate = new Date();
            newdate.setTime(str);
            let strYear = newdate.getFullYear();
            let strDay = newdate.getDate();
            if (strDay < 10) {
                strDay = "0" + strDay;
            }
            let strMonth = newdate.getMonth() + 1;
            if (strMonth < 10) {
                strMonth = "0" + strMonth;
            }
            let strdate = strYear + "-" + strMonth + "-" + strDay;
            return strdate;
        },

        //yyyy-mm-dd HH:mm:ss字符串转为日期格式
        toDate(str) {
            return new Date(str.replace(/-/g, "/"))
        },

        //拆分时间范围
        splitTimeRange(str, val) {
            let tempList = [];
            let str1 = Math.floor(str.substring(0, 2));
            let str2 = Math.floor(str.substring(3, 5));
            for (let i = str1; i < str2; i++) {
                if (i.toString().length < 2) {
                    tempList.push({hour: '0' + i, value: val})
                } else {
                    tempList.push({hour: i.toString(), value: val})
                }
            }
            return tempList;
        },

        GetDateDiff(startTime, endTime, diffType) {
            //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
            startTime = startTime.replace(/\-/g, "/");
            endTime = endTime.replace(/\-/g, "/");
            let sTime = new Date(startTime); //开始时间
            let eTime = new Date(endTime); //结束时间
            console.log(1, sTime)
            //作为除数的数字
            let timeType = 1;
            switch (diffType) {
                case"second":
                    timeType = 1000;
                    break;
                case"minute":
                    timeType = 1000 * 60;
                    break;
                case"hour":
                    timeType = 1000 * 3600;
                    break;
                case"day":
                    timeType = 1000 * 3600 * 24;
                    break;
                default:
                    break;
            }
            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
        },

        /**
         *
         * 新增/修改弹框数据时保存的公共方法
         * row: 新增/修改项的数据 [object]
         * type: '新增''修改'其中一个类型 [type]
         * alias: alias [string]
         * apiUrl: 接口 [string]
         * visible: 弹框显示/隐藏的变量名 [string]
         * func: 获取列表信息的方法（刷新）[function]
         *row,type,alias,apiUrl,visible
         * **/
        saveChange(obj) {
            if (obj.type === 'add') {
                this.fetch(obj.apiUrl, [{"alias": obj.alias, "keyValues": obj.row}])
                    .then(result => {
                        this.returnMessage(result, obj.visible)
                    })
            } else if (obj.type === 'edit') {
                this.putAjax(obj.apiUrl, [{"alias": obj.alias, "keyValues": obj.row}])
                    .then(result => {
                        this.returnMessage(result, obj.visible)
                    })
            }
        },

        //返回信息
        returnMessage(result, visible) {
            if (result.status === 200) {
                this.$store.state.returnData = result.data;
                this.$message({
                    message: result.message || '操作成功',
                    type: 'success'
                });
                visible(); //关闭对话框
            } else {
                this.$message({
                    message: this.returnIntercept(result),
                    type: 'error'
                });
                this.$store.state.returnstatus = 'error';
            }
        },

        //返回信息截取
        returnIntercept(result) {
            let a = '';
            if (result.data !== null) {
                if (JSON.stringify(result.data) === '{}') {
                    if (result.error) {
                        return this.getStr(result.error)
                    } else if (result.message) {
                        return this.getStr(result.message)
                    }
                }
                if (JSON.stringify(result.data) === '[]') {
                    return result.message || '系统在升级，请稍后重试'
                }

                if (!Array.isArray(result.data)) {
                    return this.getStr(result.msg.message)
                }

                a = result.data[0].message;
                switch (this.getStr(a, ':')) {

                    case "clientcode":
                        return "合同不能为空";

                    case "contractcode":
                        return "合同不能为空";

                    case "clientid":
                        return "合同不能为空";

                    case "amounts":
                        return "金额不能为空";

                    case "posttype":
                        return "收款类型不能为空";

                    case "receiptcode":
                        return "收款编号不能为空";

                    case "buildslumpname":
                        return "塌落度名称不能为空";

                    case "buildwayname":
                        return "浇筑方式不能为空";

                    case "salesid":
                        return "合同不能为空";

                    case "buildsite":
                        return "工程项目不能为空";

                    case "buildslump":
                        return "塌落度不能为空";

                    case "goodsname":
                        return "产品名称不能为空";

                    case "qtyorder":
                        return "下单方量不能为空";

                    case "goodscode":
                        return "产品名称不能为空";

                    case "buildlevel":
                        return "产品名称不能为空";

                    case "buildway":
                        return "浇筑方式不能为空";

                    case "clientprojectid":
                        return "合同不能为空";

                    case "builddate":
                        return "预订送货时间不能为空";

                    case "adjusttype":
                        return "调整类型不能为空";

                    case a:
                        return a
                }
            } else {
                return result.message || '系统在升级，请稍后重试'
            }

        },

        //去除冒号前面的字符串
        getStr(string, str) {
            //console.log(1111,string)
            //var str_before = string.split(str)[0].replace(/[^a-z]+/ig,"");
            var re = "";
            var reI = "";
            var str_after = "";
            re = /[:]/im;
            reI = /[\/]/im;
            if (string.indexOf('权限入口需要权限') !== -1) {
                return '很抱歉，您没有访问该数据的权限!'
            } else if (reI.test(string)) {
                return string
            } else if (re.test(string)) {
                str_after = string.split(str)[1].replace(/[^a-z]+/ig, "");
                //console.log('前：'+str_before+' - 后：'+str_after);
                return str_after
            } else {
                return string
            }

        },

        //标签搜索
        returnHead(val) {
            let a = [];
            switch (val) {
                case "客户":
                    a.push(val, "clientname");
                    return a;

                case "业务员":
                    a.push(val, "empname");
                    return a;

                case "工程项目":
                    a.push(val, "buildsite");
                    return a;

                case "产品":
                    a.push(val, "goodsname");
                    return a;

                case "强度":
                    a.push(val, "buildlevel");
                    return a;

                case "浇筑方式":
                    a.push(val, "buildwayname");
                    return a;

                case "浇筑部位":
                    a.push(val, "buildpartname");
                    return a;

                case "单价":
                    a.push(val, "balanceprice");
                    return a;

                case "经办人":
                    a.push(val, "operatorname");
                    return a;
            }
        },

        //订单状态
        returnStatus(val) {
            switch (val) {
                case -15:
                    return '客户下单暂存';

                case -10:
                    return '客户下单提交';

                case -3:
                    return '审核不通过';

                case 0:
                    return '下单待审核';

                case  5:
                    return '下单已审';

                case  15:
                    return '已做配方待审';

                case 20:
                    return '已审配比待产';

                case 30:
                    return '已开盘';

                case 99:
                    return '完成';

                case -1:
                    return '被删除订单';

                case -2:
                    return '被取消订单';

                case 10:
                    return '已排产';
            }
        },

        removeHTMLTag(str) {
            str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
            str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
            //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
            //str=str.replace(/ /ig,'');//去掉空格
            //console.log("去除HTML",str)
            return str;
        },

        //平面数组变为树型结构
        returnTree(data,parentCode,code,name,id) {
            let pos = {};
            let tree = [];
            let i = 0;
            while(data.length){
                if(!data[i][parentCode]) {
                    tree.push({
                        id: data[i][id],
                        value: data[i][code],
                        label: data[i][name],
                        children: []
                    });
                    pos[data[i][code]]=[tree.length-1];
                    data.splice(i,1);
                    i--;
                }else {
                    let posArr = pos[data[i][parentCode]];
                    if(posArr !== undefined) {
                        let obj = tree[posArr[0]];
                        for(let j = 1; j < posArr.length; j++) {
                            obj = obj.children[posArr[j]];
                        }
                        obj.children.push({
                            id: data[i][id],
                            value: data[i][code],
                            label: data[i][name],
                            children: []
                        });
                        pos[data[i][code]] = posArr.concat([obj.children.length-1]);
                        data.splice(i,1);
                        i--;
                    }
                }
                i++;
                if(i>data.length-1) {
                    i = 0;
                }
            }
            return data;
        },
        setTreeData(data,parentid,fid){
            let tree = [];
            tree = data.filter(father => { //循环所有项
                let branchArr = data.filter((child)=>{
                    return father[fid] === child[parentid] //返回每一项的子级数组
                });
                if(branchArr.length>0) {
                    father.children = branchArr; //如果存在子级，则给父级添加一个children属性，并赋值
                }else {
                    father.children = [];
                }
                return father[parentid] === null
            });
            return tree //返回树形数据
        },

        //数组对象去重
        reduceObj(arr, value) {
            var hash = {};
            arr = arr.reduce(function (item, next) {
                hash[next[value]] ? '' : hash[next[value]] = true && item.push(next);
                return item
            }, [])
            return arr
        },

        //数组对象排序
        arrObjSort(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },

        //个人主页对数组的处理
        returnReconstruction(dataI, dataII, weekDatas) {
            let tiemqtyData = [];
            let say = [];
            let arr = [];
            let timeData = [];
            let qtyorderData = [];
            let timeQty = [];
            let a = dataI;
            let b = dataII;
            for (let i = 0; i < a.length; i++) {
                for (let j = i; j < b.length; j++) {
                    say.push({date: a[i], qty: b[j], num: a[i].split("-").join("")})
                }
            }
            for (let i = 0; i < weekDatas.length; i++) {
                arr.push({date: weekDatas[i], qty: 0, num: weekDatas[i].split("-").join("")})
            }
            tiemqtyData = this.reduceObj([...say, ...arr], 'date').sort(this.arrObjSort('num'))
            for (let i = 0; i < tiemqtyData.length; i++) {
                timeData.push(tiemqtyData[i].date);
                qtyorderData.push(tiemqtyData[i].qty);
            }
            timeQty = [timeData, qtyorderData];
            return timeQty
        },

        //字符串返回金额类型
        returnMoneyType(val) {
            let num = 0;
            num = val.toFixed(2);
            num = parseFloat(num)
            num = num.toLocaleString();
            return num;                 //返回的是字符串23,245.12保留2位小数
        },

        //获取本周上周本月上月的所有日期
        returnWeek(val) {
            var weekData = [];
            var now = new Date();
            var nowTime = now.getTime();
            var day = now.getDay();        //本周的当前天数
            var nowMonth = now.getMonth(); //当前月
            var oneDayTime = 24 * 60 * 60 * 1000;
            var nowYear = now.getYear(); //当前年
            nowYear += (nowYear < 2000) ? 1900 : 0;
            // var MondayTime = nowTime - (day-1)*oneDayTime; //本周一 Lastweek
            // var Lastweek = nowTime - (day+6)*oneDayTime;   //上周一
            //var monthStartDate =  new Date(nowYear, nowMonth, 1); //本月一号
            //上月日期
            var lastMonthDate = new Date();
            lastMonthDate.setDate(1);
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            var lastYear = lastMonthDate.getYear();
            var lastMonth = lastMonthDate.getMonth();
            //var lastMonthStartDate = new Date(nowYear, lastMonth, 1); //上月一号
            //本月天数
            var daymonth = new Date(nowYear, nowMonth + 1, 0);
            var daycount = daymonth.getDate();
            //上月天数
            var ondaymonth = new Date(nowYear, nowMonth, 0);
            var ondaycount = ondaymonth.getDate();

            //前7天
            if (val === 'lastSeven') {
                for (let i = 0; i < 7; i++) {
                    let currentTime = nowTime - (day - i) * oneDayTime;
                    let lastSevenTime = nowTime - 6 * oneDayTime;
                    weekData.push(this.formatDate(MondayTime, 'md'));
                }
                return weekData
            }

            //本周的七天日期
            if (val === 'thisweek') {
                for (let i = 0; i < 7; i++) {
                    var MondayTime = nowTime - (day - i) * oneDayTime;
                    weekData.push(this.formatDate(MondayTime, 'md'));
                }
                return weekData
            }

            //上周的七天日期
            if (val === 'lastweek') {
                for (let i = 7; i > 0; i--) {
                    var Lastweek = nowTime - (day + i) * oneDayTime
                    weekData.push(this.formatDate(Lastweek, 'md'));
                }
                return weekData
            }

            //前十天的日期
            if (val === 'Tendays') {
                let tendaysData = [];
                let a = null;
                let b = null;
                if (day <= 7) {
                    a = -1 - day;
                    b = 10 + a;
                } else {
                    a = -day - 8;
                    b = 10 + a;
                }
                for (let i = b; i > a; i--) {
                    var Tendays = nowTime - (day + i) * oneDayTime
                    weekData.push(this.formatDate(Tendays, 'md'));
                }

                for (let i = 0; i < weekData.length; i++) {
                    tendaysData.push(nowYear + '-' + weekData[i])
                }
                return tendaysData
            }

            //前十天的日期不带年份
            if (val === 'TendaysNoyear') {
                let tendaysData = [];
                let a = null;
                let b = null;
                if (day <= 7) {
                    a = -1 - day;
                    b = 10 + a;
                } else {
                    a = -day - 8;
                    b = 10 + a;
                }
                for (let i = b; i > a; i--) {
                    var Tendays = nowTime - (day + i) * oneDayTime
                    weekData.push(this.formatDate(Tendays, 'md'));
                }

                return weekData
            }

            //本月的所有日期
            if (val === 'thismonth') {
                for (let i = 1; i < daycount + 1; i++) {
                    var monthStartDate = new Date(nowYear, nowMonth, i)
                    weekData.push(this.formatDate(monthStartDate, 'md'));
                }
                return weekData
            }

            //上月的所有日期
            if (val === 'lastmonth') {
                for (let i = 1; i < ondaycount + 1; i++) {
                    var lastMonthStartDate = new Date(nowYear, lastMonth, i)
                    weekData.push(this.formatDate(lastMonthStartDate, 'md'));
                }
                return weekData
            }

            //12个月的所有月份
            if (val === '') {
                let oneyearmonth = [];
                let a = nowMonth + 2;
                let b = 13 + a;
                let c = nowYear - 1;
                let d = nowYear;
                if (nowMonth + 1 === 12) {
                    c = nowYear;
                    d = nowYear + 1
                }
                for (let i = a; i < b; i++) {
                    if (i > 12) {
                        for (let j = 1; j <= b - 13; j++) {
                            oneyearmonth.push(d + '-' + '0' + j)
                        }
                    } else {
                        if (i >= 10) {
                            oneyearmonth.push(c + '-' + i);
                        } else {
                            oneyearmonth.push(c + '-' + '0' + i);
                        }
                    }

                }
                oneyearmonth.length = 12;
                return oneyearmonth
            }

            //本年的12月份
            if (val === 'year') {
                let yearData = [];
                for (let i = 1; i < 13; i++) {
                    if (i >= 10) {
                        yearData.push(nowYear + '-' + i);
                    } else {
                        yearData.push(nowYear + '-' + '0' + i);
                    }
                }
                return yearData
            }

            //本年的12个月带中文
            if (val === 'yearText') {
                let yearData = [];
                for (let i = 1; i < 13; i++) {
                    yearData.push(i + '月');
                }
                return yearData
            }

            if (val === 'thisyear') {
                return nowYear
            }
        },

        //通过数据字典获取调整原因列表
        getDataList(item) {
            let arr = [], dataList = [], obj = {};
            this.postDicData([{'nodekey': item}]).then(result => {
                if (result.status === 200) {
                    arr = result.data[item];
                    for (let i = 0; i < arr.length; i++) {
                        obj = {label: arr[i].itemname, value: arr[i].itemvalue};
                        dataList.push(obj);
                    }
                }
            });
            return dataList;
        },

        //通过数据字典获取消息类型的上级及下级的类型
        getSubordinate(type) {
            let arr = [], causeList = [], obj = {}, subor;
            this.postDicData([{'nodekey': 'messageType'}]).then(result => {
                if (result.status === 200) {
                    arr = result.data['messageType'];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].itemkey === type) {
                            subor = arr[i].dicid
                        }
                    }
                    for (let i = 0; i < arr.length; i++) {
                        if (subor === arr[i].parentid || subor === arr[i].dicid) {
                            obj = {label: arr[i].itemname, value: arr[i].itemkey};
                            causeList.push(obj);
                        }
                    }
                }
            });
            return causeList;
        },

        //获取数据字典消息的ip和端口
        returnAnumData() {
            let anumData = [];
            let iphost = [];
            let post = null;
            let ip = null;
            this.postDicData([{'nodekey': 'xxzx'}]).then((result) => {
                if (result.status === 200) {
                    anumData = result.data['xxzx'];
                    post = anumData[1].itemvalue;
                    ip = anumData[0].itemvalue;
                    iphost.push(ip + ':' + post);
                }
            });
            return iphost;
        },

        //获取消息数量
        getInboxnum() {
            let obj = {};
            this.fetch('/message/inbox/allByPage', {inbox: {status: 0}})
                .then(result => {
                    if (result.data.list.length >= 4) {
                        obj.data = result.data.list;
                        obj.data.length = 4;
                    } else {
                        obj.data = result.data.list;
                    }
                    obj.num = result.data.total;
                });
            return obj;
        },

        //切换子系统时清空原有的页签并默认跳转到该子系统的的第一个页签
        initRoutePage() {
            this.$store.state.navtaglist = [];
            let currenNav = [];
            currenNav = this.navs[sessionStorage.getItem('sideValue')];
            var _firstPage = '';
            var _each = (list) => {
                var _result = false;
                _.map(list, (num, key) => {
                    if (_firstPage == '' && num.children.length == 0) {
                        _firstPage = num;
                        _result = true;
                        return true;
                    } else if (_firstPage == '') {
                        _each(num.children);
                    }
                });
            };
            _each(currenNav.children);
            sessionStorage.setItem('activenavItem', JSON.stringify(_firstPage));
            sessionStorage.setItem('systemid', _firstPage.systemid);
            this.$store.state.systemid = _firstPage.systemid;
            this.$store.state.activenavItem = _firstPage;
            this.loadingStatus = false;
            this.handlesetSystemid();
            this.getUser();
            if (_firstPage.defaulturl == '') {
                console.log(_firstPage, "跳转页面的默认地址为空，请配置！")
            }
            this.$router.push(_firstPage.route);
            this.$store.state.navtaglist.push(_firstPage);
            this.$store.state.activenavItem = _firstPage;
        },

        //切换子系统时，初始化页面
        initPage() {
            this.$store.state.isShowPage = false;
            setTimeout(() => {
                this.$store.state.isShowPage = true;
            }, 0)
        },

        //编辑状态不可点击的警告
        unClick() {
            this.$message({
                message: '正处于编辑状态，请保存或取消',
                type: 'warning'
            })
        },

        /**
         *
         * 多维数组过滤
         * filtername: 要过滤的字段名
         * filtervalue: 要过滤的值
         * **/
        filterArray(filterarray, filtername, filtervalue) {
            let filterItem = {};
            const loop = list => {

                list.forEach(item => {
                    loop(item.children);
                    if (item[filtername] === filtervalue) {
                        filterItem = item;
                    }
                })
            };
            loop(filterarray);
            return filterItem;
        },

        //跳到对应的路由
        goTargetTag(tag) {
            this.$router.push(tag.route);
            if (tag.route.path) {
                sessionStorage.setItem('activenavItem', JSON.stringify(tag));
                this.$store.state.activenavItem = tag;
                let _status = false;
                this.$store.state.navtaglist.forEach(item => {
                    if (item.route.path === tag.route.path) {
                        _status = true;
                    }
                });
                //判断是否存在形同的tag在navtaglist(页签列表)中
                _status == true ? '' : this.$store.state.navtaglist.push(tag);
            } else if (tag.route.name.indexOf("FSLINK") !== -1) {
                window.open(tag.defaulturl);
                this.$router.back(-1);
            } else {
                this.$message({
                    type: 'warning',
                    message: '该url不存在，请配置正确路径！'
                });
                this.$router.back(-1);
            }
        },

        //删除数组中的指定对象
        deleteObjfromArr(arr, obj) {
            obj = JSON.stringify(obj)
            const _arr = arr.filter(item => {
                item = JSON.stringify(item)
                return item != obj
            });
            return _arr
        },

        //数组对比去重
        compareArr(arr2, arr1) {
            let newArr = [];
            for (let i = 0; i < arr1.length; i++) {
                var isE = false;
                for (let j = 0; j < arr2.length; j++) {
                    if (arr1[i] === arr2[j]) {
                        isE = true;
                        break;
                    }

                }
                if (!isE) {
                    newArr.push(arr1[i])
                }
            }
            return Array.from(new Set(newArr))
        },
        //给数组添加isEditState字段
        //isEditState主要用来表示表格中该行的状态
        //为true时表示该行是编辑状态
        //为false时表示该行是只读状态
        //默认为false，即只读状态
        giveState(arr,boolean = false) {
            arr.forEach(item => {
                item.isEditState = boolean
            });
            return arr
        },
        //------------------------------------------ template function -------------------------------------------------------------//
        /**
         * @desc 将src转化为target
         *
         * 如果src改变,则只需重写该方法将其转化为target即可;
         * src:
         *  {xxx:[],xxx_page:{},yyy:[],yyy_page:{},_msg:{}}
         * target:
         *  {xxx:{datas:[],page:{}},yyy:{datas[],page:{}},_msg:{}}
         */
        formatApiData(obj) {
            if(JSON.stringify(obj) !== {}) {
                let newObj = Vue.prototype.$lodash.cloneDeep(obj);
                let mainKeys = [];
                for(let x in obj) {
                    if(!x.includes("_")) {
                        mainKeys.push(x)
                    }
                }
                for(let x in obj) {
                    mainKeys.forEach(mainKey => {
                        newObj[mainKey]['datas'] = obj[mainKey];
                        if(x.includes("_")&&x.includes(mainKey)) {
                            newObj[mainKey][x.split("_")[1]] = obj[x];
                            delete newObj[x]
                        }
                    })
                }
                return newObj;
            }else {
                return obj;
            }
        },
        /**
         * @desc 数组更改前后对比返回提交的数组
         *
         * @param {Array} oldItem 深拷贝后的数组
         * @param {Array} newItem 更改后的数组
         * @param {String} ID 唯一值名称
         * @return {Array}
         */
        getLastList(oldItem,newItem,ID) {
            let lastItem1 = [], lastItem2 = [], lastItem3 = [];
            let idList = [], idList1 = [], idList2 = [];
            let newItemIdList = [];
            let newObj = {}, newObj2 = {}, newObj3 = {};
            newItem.forEach((n,i) => {
                newObj = n;
                n.hasOwnProperty(ID) && newItemIdList.push(n[ID]);
                if(n._curdFlag === 'd' || n._curdFlag === 'c') {
                    lastItem1.push(newObj);
                    idList1.push(n[ID])
                }else {
                    oldItem.forEach((o,k)=>{
                        if(Vue.prototype.$lodash.isEqual(o,n)) {
                            idList2.push(n[ID])
                        }
                    })
                }
            });
            idList = Vue.prototype.$lodash.compact(Array.from(new Set([...idList1,...idList2])));
            let lastIdList = Vue.prototype.$lodash.difference(newItemIdList,idList);
            newItem.forEach(item => {
                if(item.hasOwnProperty(ID)) {
                    lastIdList.forEach(v => {
                        if(item[ID] === v) {
                            newObj2 = item;
                            newObj2[ID] = item[ID];
                            newObj2._curdFlag = 'u';
                            lastItem2.push(newObj2)
                        }
                    });
                    if(!item[ID]) {
                        newObj3 = item;
                        newObj3._curdFlag = 'c';
                        lastItem3.push(newObj3)
                    }
                }
            });
            return Vue.prototype.$lodash.uniqWith([...lastItem1,...lastItem2,...lastItem3],_.isEqual)
        },
        /**
         * @desc 获取数据字典
         *
         * @param {String} service 数据服务code
         * @param {String} source 数据源code
         * @return {Array}
         */
        dicData(service,source) {
            return new Promise((resolve,reject) => {
                return this.$http.get(`/api/zl-core-data-services/${service}?enableDS=${source}`)
                    .then(response => {
                        resolve(response);
                    })
            })
        },
        getDicDataList(service,source) {
            let arr = [], dataList = [], obj = {};
            this.dicData(service,source).then(result => {
                arr = result.data[source];
                for(let i = 0; i < arr.length ; i++) {
                    obj = {label: arr[i].dictName,value: arr[i].dictValue};
                    dataList.push(obj);
                }
            });
            return dataList;
        },
        getStaticList(type) {
            if(type === 'whetherUse') {
                return [{label:'启用',value:0},{label:'失效',value:1}]
            }else if(type === 'saleType') {
                return [{value:1,label:'国内'},{value:2,label:'出口'}]
            }else if(type === 'countType') {
                return [{value:1,label:'国产胶'},{value:2,label:'进口胶'},{value:null,label:''}]
            }else if(type === 'isTrue') {
                return [{label:'是',value:1},{label:'否',value:0}]
            }else if(type === 'isTrueString') {
                return [{label:'否',value:'0'},{label:'是',value:'1'}]
            }else if(type === 'siJin') {
                return [{label:'是',value:'true'},{label:'否',value:'false'}]
            }else if(type === 'whetherUseAll') {
                return [{label:'全部',value:null},{label:'启用',value:0},{label:'失效',value:1}]
            }else if(type === 'colorType'){
                return [{value:'吨',label:'吨'},{value:'m²',label:'m²'}]
            }else if(type =='matcodeType'){
                return [{value:'吨',label:'吨'}]
            }
        },
        /**
         * @desc 数组数据格式化
         *
         * @param {Array} arr 原始数组
         * @param {String} label 属性名称
         * @param {String} value 属性值名称
         * @return {Array}
         */
        formatArray(arr,label,value,toNumber = false) {
            let newArr = [];
            arr.forEach((v,i) => {
                let obj = {};
                obj = v;
                obj.label = v[label];
                obj.value = toNumber ? Number(v[value]) : v[value];
                newArr.push(obj)
            });
            return newArr;
        },
        //返回错误信息的中文提示
        returnErrorMsg(message,type = 'first') {
            return message
            /*if(message) {
                if(type === 'first') {
                    return message.substring(message.indexOf(":")+2,message.indexOf('\n'))
                }else if(type === 'second') {
                    return message.substring(message.indexOf(":")+2,message.indexOf('at'))
                }
            }else {
                return '操作失败'
            }*/
        },
        //返回所需日期
        returnNeddDate(type) {
            let dateArr = [];
            if(type === 'lastSeven') {
                for(let i=0; i>-7; i-- ) {
                    let obj = this.recentDate(i)
                    dateArr.unshift(obj)
                }
            }
            return dateArr;
        },
        //获取两个日期之间的日期
        getdiffdate(stime,etime) {
            //初始化日期列表，数组
            var diffdate = new Array();
            var i=0;
            //开始日期小于等于结束日期,并循环
            while(stime<=etime){
                diffdate[i] = stime;

                //获取开始日期时间戳
                var stime_ts = new Date(stime).getTime();

                //增加一天时间戳后的日期
                var next_date = stime_ts + (24*60*60*1000);

                //拼接年月日，这里的月份会返回（0-11），所以要+1
                var next_dates_y = new Date(next_date).getFullYear()+'-';
                var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
                var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();

                stime = next_dates_y+next_dates_m+next_dates_d;

                //增加数组key
                i++;
            }
            return diffdate
        },
        /**
         * @desc 找出指定对象
         *
         * @param {Array} arr
         * @param {String} name 属性名称
         * @param {String} value 属性值
         * @param {String} label 最终获取的属性名称
         * @return {String} or {Object}
         */
        findObj(arr,name,value,label) {
            let obj = {};
            obj = arr.find(i=>i[name]===value);
            if(!label) {
                return obj
            }else {
                if(obj) {
                    return obj[label];
                }else {
                    return null
                }
            }
        },
        /**
         * @desc 除重复对象
         *
         * @param {Array} arr
         * @param {String} id 属性名称
         * @param {Boolean} isReverse 是否反序
         * @return {Array}
         */
        deletePardon(arr,id,isReverse = true) {
            let reverseArr = [];
            isReverse ? reverseArr = arr.reverse() : reverseArr = arr;
            let result = [];
            let obj = {};
            for(let i=0; i<reverseArr.length; i++){
                if(!obj[reverseArr[i][id]]){
                    result.push(reverseArr[i]);
                    obj[reverseArr[i][id]] = true;
                }
            }
            return result;
        },
        // 根据url判断微服务
        switchMicroService(url) {
            if(url.includes('oms')) {
                return '营销模块'
            }else if(url.includes('basedata')) {
                return '基础数据模块'
            }else if(url.includes('crm')) {
                return '客户关系管理'
            }else if(url.includes('systemcode')) {
                return '系统模块'
            }else {
                return '系统服务'
            }
        },
        // 下载
        downloads(data,filename = '') {
            if (!data) {
                return
            }
            let url = window.URL.createObjectURL(data);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            let Year = new Date().getFullYear(); //年
            let Month = new Date().getMonth()+1;//月
            let Dates  = new Date().getDate(); //日
            let Houre = new Date().getHours();//小时
            let Minute = new Date().getMinutes();//分钟
            let Seconds = new Date().getSeconds();//秒
            let date = Year +'' +Month +'' + Dates +''+ Houre +''+Minute+''+Seconds;
            link.setAttribute('download', `${filename}${date}.xls`);
            document.body.appendChild(link);
            link.click()
        },
        /**
         * @desc 从数组中删除自己及其下级
         *
         * @param {Array} arr
         * @param {Number/String} idValue 唯一值
         * @param {String} parentName parent的字段名
         * @param {String} idName 唯一值的字段名
         * @return {Array}
         */
        deleteSelfandChild(arr,idValue,parentName,idName) {
            let res = [];
            let lastArr = [];
            deleteChild(arr,idValue);
            function deleteChild (arr,idValue) {
                arr.forEach(item => {
                    if (item[parentName] === idValue) {
                        res.push(item[idName]);
                        deleteChild(arr,item[idName])
                    }
                })
            }
            res.push(idValue);
            arr.forEach(item => {
                if(!res.includes(item[idName])) {
                    lastArr.push(item)
                }
            });
            return lastArr;
        }
    }
}
