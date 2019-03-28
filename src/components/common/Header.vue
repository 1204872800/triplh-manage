<template>
    <div class="header">
        <div class="logo">后台管理系统</div>
        <div class="user-info">
        	<label class="role"><span>角色：</span>{{role}}</label>
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
	import store from '../../store/index.js';
    export default {
        data() {
            return {
                username:'',
                role:''
            }
        },
        computed:{
            userMsg(){
                return this.$store.state.userMsg;
            }
        },
        watch:{
        	userMsg(){
        		this.username = this.userMsg.userName;
        		this.role = this.userMsg.role.name;
        	}
        },
        store,
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                	this.$confirm('是否退出登录?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => {
			            this.$message({
			            	type: 'success',
			            	message: '退出成功'
			            });
			            setTimeout(()=>{
			            	console.log(this.store)
			            	this.$router.push('/login');		            	
			            	setTimeout(()=>{
			            		store.dispatch('setMuToken','');
			            		store.dispatch('setMuUserMsg','');
			            		store.dispatch('setMuRoleMenu','');
			            	},500)
			            },2000)
			        }).catch(() => {
			            this.$message({
			            	type: 'info',
			            	message: '已取消删除'
			            });          
			        });
                }
            }
        },
        beforeCreate(){
        	window.addEventListener('beforeunload', e => {
        		//页面刷新前把token值保存到本地缓存
			    localStorage.setItem('token', this.$store.state.token);
			    localStorage.setItem('userMsg', JSON.stringify(this.$store.state.userMsg));
			    localStorage.setItem('roleMenu', JSON.stringify(this.$store.state.roleMenu));
			});
			window.addEventListener('load', e => {
				//页面刷新后把本地缓存的token值赋给token，在删除本地缓存
				store.dispatch('setMuToken',localStorage.getItem("token"));
				store.dispatch('setMuUserMsg',JSON.parse(localStorage.getItem("userMsg")));
				store.dispatch('setMuRoleMenu',JSON.parse(localStorage.getItem("roleMenu")));
				localStorage.removeItem('token');
				localStorage.removeItem('userMsg');
				localStorage.removeItem('roleMenu');
			});
        },
        mounted(){
        	if(this.userMsg!=''){
        		this.username = this.$store.state.userMsg.userName;
        		this.role = this.$store.state.userMsg.role.name;
        	}
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .role{
    	margin-right: 20px;
    	font-size: 14px;
    }
</style>
