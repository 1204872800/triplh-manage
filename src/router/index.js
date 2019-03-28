import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js';


Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        //404页面
        {
            path: '/404',
            name:'页面不存在',
            component: resolve => require(['../components/common/404.vue'], resolve)
        },
        //403页面
        {
            path: '/403',
            name:'您没有权限',
            component: resolve => require(['../components/common/403.vue'], resolve)
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/readme',
                    name:'首页',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                //巴士管理
                {
                    path: '/busstation',
                    name:'站点管理',
                    component: resolve => require(['../components/page/bus/busstation.vue'], resolve)
                },
                //系统管理
                {
                    path: '/systemlogin',
                    name:'登录账号',
                    component: resolve => require(['../components/page/system/systemlogin.vue'], resolve)
                },
                {
                    path: '/systemrole',
                    name:'角色管理',
                    component: resolve => require(['../components/page/system/systemrole.vue'], resolve)
                },
                {
                    path: '/systemmenu',
                    name:'菜单管理',
                    component: resolve => require(['../components/page/system/systemmenu.vue'], resolve)
                },
                {
                    path: '/systemeditpwd',
                    name:'修改密码',
                    component: resolve => require(['../components/page/system/systemeditpwd.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
	      path: '*',
	      redirect: '/404'
	    }
    ],
    mode: 'history'
})
//全局路由守卫
	router.beforeEach((to, from, next) => {
	    if (to.path == '/login') {
	        next();
	    }
	    else {
	    	//如果vuex有值则取vuex，如果没有则取本地缓存的值
	        var token = store.state.token ? store.state.token:localStorage.getItem('token');
	        var userMsg = store.state.userMsg ? store.state.userMsg:JSON.parse(localStorage.getItem('userMsg'));
	        var roleMenu = store.state.roleMenu ? store.state.roleMenu:JSON.parse(localStorage.getItem('roleMenu'));
	        var routerList = router.options.routes[3].children;
	        if (!token) {
	        	if (to.path !== '/login') {
	            	next({ path: '/login' })
	            }
	            else {
	            	next();
	            }
	        }
	        else {
	        	var routerListStr = '';
	        	for(var i=0;i<routerList.length;i++){
	        		routerListStr += routerList[i].path;
	        	}
	        	if(routerListStr.indexOf(to.path)==-1){
	        		next({ redirect: '/404' })
	        	}
	        	else{
	        		var roleMenuStr = '';
	        		for(var i=0;i<roleMenu.length;i++){
		        		roleMenuStr += '/'+roleMenu[i].url;
		        	}
	        		if(roleMenuStr.indexOf(to.path)!=-1){
		        		next();
		        	}else{
		        		next({ path: '/403' })
		        	}
	        	}
	        }
	    }
	})

export default router;