
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import global from './global'
import store from './store'
import lodash from 'lodash'
import moment from 'moment'
import 'jquery'
Vue.prototype.$lodash = lodash;
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'small' });
Vue.use(global);
Vue.prototype.$moment = moment;
Vue.prototype.$http = axios;

router.beforeEach((to, from, next) => {
    //判断是否登录（初版，需要修改）
    if (sessionStorage.getItem('_au') == undefined&&to.matched[0].path == '/master') {
        next({
            path: '/login',
        })
    } else {
        next()
    }
});

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
});
