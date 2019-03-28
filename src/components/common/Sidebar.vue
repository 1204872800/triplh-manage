<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template style="height: 1%!important;" v-for="item in items">
                <template v-if="item.childPermissions!=''">
                    <el-submenu :index="item.url">
                        <template slot="title"><i :class="item.iconFont"></i>{{ item.name }}</template>
                        <el-menu-item v-for="(subItem,i) in item.childPermissions" :key="i" :index="subItem.url">{{ subItem.name }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.url">
                        <i :class="item.iconFont"></i>{{ item.name }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
	import routers from '../../router/index.js';
	import store from '../../store/index.js';
	import axios from 'axios';
    export default {
        data() {
            return {
            	roleId:'',
                items: []
            }
        },
        methods:{
        	getMenuList(){
        		axios.post('/api/role/permissionListWithLevel?roleId='+this.roleId,{},{
        			headers:{
						"Authorization":this.getToken
					}
        		})
        		.then(res=>{
        			if(res.status==200&&res.statusText=="OK"){
        				this.items = res.data;
        			}
        		})
        		.catch(error=>{
        			console.log(error)
        		})
        	},
        	getRoleMenuList(){
        		axios.post('/api/role/permissionList?roleId='+this.roleId,{},{
		    		headers:{
	    				'Authorization':this.getToken
	    			}
		    	})
		    	.then(res=>{
		    		if(res.status==200&&res.statusText=="OK"){
		    			var arr = new Array();
		    			for(var i=0;i<res.data.parentPermissions.length;i++){
		    				if(res.data.parentPermissions[i].url.length>2){
		    					arr.push(res.data.parentPermissions[i])
		    				}
		    			}
		    			store.dispatch('setMuRoleMenu',arr);
		    		}
		    	})
		    	.catch(error=>{
		    		console.log(error)
		    	})
        	}
        },
        store,
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
            userMsg(){
                return this.$store.state.userMsg;
            },
            getToken() {
		        return this.$store.state.token
		    }
        },
        watch:{
        	userMsg(){
        		this.roleId = this.userMsg.role.id;
        	},
        	getToken(){
				this.getMenuList();
				this.getRoleMenuList();
			}
        },
        mounted(){
        	if(this.userMsg!=''){
        		this.roleId = this.userMsg.role.id;
        	}
        	if(this.getToken!=''){
        		this.getMenuList();
        		this.getRoleMenuList();
        	}
        	var routerList = routers.options.routes[2].children;
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
