<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item class="codeBox" prop="code">
                    <el-input class="code" type="text" placeholder="code" v-model="ruleForm.code" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                	<img @click="createCode" alt="图片加载失败" class="codePic" :src="codePic"/>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" :disabled="loginState" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
	import store from '../../store/index.js';
	import axios from 'axios';
    export default {
    	name: 'Login',
        data(){
            return {
            	codePic:'',
            	loginState:false,
                ruleForm: {
                    username:'',
                    password:'',
                    code:''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        store,
        methods: {
        	createCode(){
        		this.codePic="/api/getCode?" + new Date();
        	},
            submitForm(formName) {
            	this.loginState = true;
            	axios.post('/api/login?userName='+this.ruleForm.username+'&password='+this.ruleForm.password+'&code='+this.ruleForm.code)
            	.then(res=>{
            		if(res.data.code==200){
            			this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
				        store.dispatch('setMuToken',res.data.data.token);
				       	store.dispatch('setMuUserMsg',res.data.data.user);
				       	//获取权限列表
				       	axios.post('/api/role/permissionList?roleId='+res.data.data.user.role.id,{},{
				    		headers:{
			    				'Authorization':res.data.data.token
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
				    			setTimeout(()=>{
						        	this.loginState = false;
						        	this.$router.push('/readme');
						        },2000);
				    		}
				    	})
				    	.catch(error=>{
				    		console.log(error)
				    	})
            		}
            		else if(res.data.code==401){
            			this.$message.error(res.data.msg);
            			setTimeout(()=>{
				        	this.createCode();
            				this.loginState = false;
				        },2000);
            			
            		}
            	})
            	.catch(error=>{
            		this.loginState = false;
            		console.log(error)
            	})
            }
        },
        created(){
        	this.codePic="/api/getCode?" + new Date();
        },
	    mounted(){
	        this.$nextTick(function () {
	            document.title = '用户登录'
	        })
	        
	    }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:190px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .codeBox {
    	position: relative;
    }
    .codeBox .codePic{
    	position: absolute;
    	top: 0;
    	right: 0;
    	width: 110px;
    	height: 36px;
    }
    .code{
    	width: 50%;
    }
</style>