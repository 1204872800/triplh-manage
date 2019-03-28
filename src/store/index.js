
//vuex



import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)


var state={
	token:'',//登陆时候获取的token值
	userMsg:'',//登陆时候返回的用户信息
	roleMenu:'',//角色可使用的菜单列表
};
var mutations={
	setToken(state,newToken){
		state.token = newToken;
	},
	setUserMsg(state,newUserMsg){
		state.userMsg = newUserMsg;
	},
	setRoleMenu(state,newRoleMenu){
		state.roleMenu = newRoleMenu;
	}
}
var actions = {
	setMuToken(context,params){
		context.commit('setToken',params)
	},
	setMuUserMsg(context,params){
		context.commit('setUserMsg',params)
	},
	setMuRoleMenu(context,params){
		context.commit('setRoleMenu',params)
	}
}


export default new Vuex.Store({
	state,
	mutations,
	actions
})