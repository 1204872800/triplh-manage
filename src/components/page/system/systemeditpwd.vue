<template>
	<div id="parent">
	   <div class="title">修改登陆密码</div>
       	<div class="main">
       		<div>
       			<span>　请输入旧密码<i>*</i>：</span>
       			<el-input placeholder="请输入旧密码" type="password" style="width: 50%;" v-model="oldPwd" clearable></el-input>
       		</div>
       		<div>
       			<span>　请输入新密码<i>*</i>：</span>
       			<el-input placeholder="请输入新密码" type="password" style="width: 50%;" v-model="newsPwd" clearable></el-input>
       		</div>
       		<div>
       			<span>再次输入新密码<i>*</i>：</span>
       			<el-input placeholder="再次输入新密码" type="password" style="width: 50%;" v-model="againPwd" clearable></el-input>
       		</div>
       		<div><el-button @click="updatePwd" type="success">修改</el-button></div>
       	</div>
	</div>
</template>

<script>
	import store from '../../../store/index.js';
	import axios from 'axios';
    export default {
	    data() {
	        return {
		        oldPwd:'',
		        newsPwd:'',
		        againPwd:''
	        }
	    },
		store,
		computed: {
		    getToken() {
		        return this.$store.state.token
		    }
		},
	    methods: {
			updatePwd(){
				if(this.newsPwd==this.againPwd){
        			if(this.oldPwd!=this.newsPwd){
        				axios.post('/api/user/changePassword?newPassword='+this.newsPwd,{
							'id':JSON.parse(this.$store.state.userMsg).id,
							'userName':JSON.parse(this.$store.state.userMsg).userName,
							'roleId':JSON.parse(this.$store.state.userMsg).role.id,
							'status':JSON.parse(this.$store.state.userMsg).status,
							'password':this.oldPwd
						},{
							headers:{
			    				'Authorization':this.getToken
			    			}
						})
						.then(res=>{
							if(res.status==200&&res.statusText=="OK"){
								if(res.data.code==204){
									this.$message({
							            message: res.data.msg+'，即将跳转至登陆页面',
							            type: 'success'
							        });
							        store.commit('setToken','');
							        store.commit('setUserMsg','');
							        setTimeout(()=>{
						            	this.$router.push('/login');
						            },2000)
								}
								else{
									this.$message({
							    		type: 'warning',
						                message: res.data.msg
						            });
								}
							}
						})
						.catch(error=>{
							console.log(error)
						})
        			}
        			else{
        				this.$message({
				    		type: 'warning',
			                message: '新密码不能喝旧密码一致，请重写'
			            });
        			}
        		}
        		else{
        			this.$message({
			    		type: 'warning',
		                message: '重复密码不一致，请重写'
		            });
        		}
			}
	    }
    };
</script>

<style scoped>
	#parent{
		height: 100%;
	}
	.title{
		font-size:20px;
		font-weight: 900;
		color:#0091EE;
	}
	.main{
		width: 50%;
		height: 42%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		text-align: center;
	}
	.main div{
		margin: 2% 0;
	}
	.main div span{
		font-size:14px;
	}
	.main div span i{
		color:red;
	}
	em{
		font-style: normal;
		position: absolute;
		font-size:12px;
		color:red;
		bottom: 22%;
		right: 16%;
	}
</style>