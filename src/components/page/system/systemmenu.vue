<template>
	<div id="parent">
		<div class="add">
			<el-button size="small" @click="addFirstMenu" type="primary">新增一级菜单</el-button>
		</div>
	   	<div class="main">
		    <el-menu class="menu">
		    	<template v-for="item in menuData">
		    		<template v-if="item.childPermissions">
		    			<el-submenu :index="item.id.toString()">
		    				<template slot="title">
		    					<i :class="item.iconFont"></i>{{ item.name }}
	                        	<span class="right">
	                        		<a href="javaScript:" @click="addSecondMenu(item.id)">新增二级菜单</a>
		                        	<a href="javaScript:" @click="amendFirstMenu(item)">修改</a>
		                        	<a href="javaScript:" @click="delMenu(item.id)">删除</a>
	                        	</span>
		    				</template>
		    				<el-menu-item v-for="(child,i) in item.childPermissions" :key="i" :index="child.id.toString()">
	                        	{{ child.name }}
	                        	<span class="right">
	                        		<a href="javaScript:" @click="amendSecondMenu(child)">修改</a>
		                        	<a href="javaScript:" @click="delMenu(child.id)">删除</a>
	                        	</span>
	                        </el-menu-item>
		    			</el-submenu>
		    		</template>
		    		<template v-else>
	                    <el-menu-item :index="item.id.toString()">
	                        <i :class="item.iconFont"></i>{{item.name}}
	                    </el-menu-item>
	                </template>
		    	</template>
		    </el-menu>
		</div>
		<el-dialog title="新增一级菜单" :visible.sync="firstAdd">
			<div class="addMsg">
				<div class="single">
			    	<span>菜单名称：</span>
			    	<el-input v-model="addFirstName" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>　菜单url：</span>
			    	<el-input v-model="addFirstUrl" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>菜单图标：</span>
			    	<el-input v-model="addFirstIcon" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			</div>
			 <div slot="footer" class="dialog-footer">
			    <el-button @click="firstAdd = false">取 消</el-button>
			    <el-button type="primary" :disabled="firstAddState" @click="firstData">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改一级菜单" :visible.sync="firstAmend">
			<div class="addMsg">
				<div class="single">
			    	<span>菜单名称：</span>
			    	<el-input v-model="firstMenuMsg.name" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>　菜单url：</span>
			    	<el-input v-model="firstMenuMsg.url" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>菜单图标：</span>
			    	<el-input v-model="firstMenuMsg.iconFont" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			</div>
			 <div slot="footer" class="dialog-footer">
			    <el-button @click="firstAmend = false">取 消</el-button>
			    <el-button type="primary" :disabled="firstAmendState" @click="firstDataAmend">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="新增二级菜单" :visible.sync="secondAdd">
			<div class="addMsg">
				<div class="single">
			    	<span>菜单名称：</span>
			    	<el-input v-model="addSecondName" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>　菜单url：</span>
			    	<el-input v-model="addSecondUrl" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>菜单图标：</span>
			    	<el-input v-model="addSecondIcon" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			</div>
			 <div slot="footer" class="dialog-footer">
			    <el-button @click="secondAdd = false">取 消</el-button>
			    <el-button type="primary" :disabled="secondAddState" @click="secondtData">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改二级菜单" :visible.sync="secondAmend">
			<div class="addMsg">
				<div class="single">
			    	<span>菜单名称：</span>
			    	<el-input v-model="secondMenuMsg.name" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>　菜单url：</span>
			    	<el-input v-model="secondMenuMsg.url" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			    <div class="single">
			    	<span>菜单图标：</span>
			    	<el-input v-model="secondMenuMsg.iconFont" size="small" style="width: 70%;" clearable></el-input>
			    </div>
			</div>
			 <div slot="footer" class="dialog-footer">
			    <el-button @click="secondAmend = false">取 消</el-button>
			    <el-button type="primary" :disabled="secondAmendState" @click="secondDataAmend">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import store from '../../../store/index.js';
	import axios from 'axios';
    export default {
	    data() {
	        return {
		        menuData:[],
		        //新增一级菜单
		        firstAdd:false,
		        firstAddState:false,
		        addFirstName:'',
		        addFirstUrl:'',
		        addFirstIcon:'',
		        //修改一级菜单
		        firstAmend:false,
		        firstAmendState:false,
		        firstMenuMsg:{},
		        //新增二级菜单
		        secondAdd:false,
		        secondAddState:false,
		        addSecondName:'',
		        addSecondUrl:'',
		        addSecondIcon:'',
		        firstMenuId:'',
		        //修改二级菜单
		        secondAmend:false,
		        secondAmendState:false,
		        secondMenuMsg:{},
		        items: [
                    {
                        icon: 'el-icon-umpshouye',
                        index: 'readme',
                        title: '首页',
                        id:'1'
                    },
                    {
                        icon: 'el-icon-setting',
                        id:'7',
                        index: '0',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'systemlogin',
                                title: '登陆账号',
                                id:'2'
                            },
                            {
                                index: 'systemrole',
                                title: '角色管理',
                                id:'3'
                            },
                            {
                                index: 'systemmenu',
                                title: '菜单管理',
                                id:'4'
                            },
                            {
                                index: 'systemeditpwd',
                                title: '修改密码',
                                id:'5'
                            }
                        ]
                    }
                ]
	        }
	    },
	    methods: {
	    	//提交修改二级菜单
	    	secondDataAmend(){
	    		this.secondAmendState = true;
	    		axios.post('/api/permisson/update',{
	    			"id":this.secondMenuMsg.id,
					"level":this.secondMenuMsg.level,
					"name":this.secondMenuMsg.name,
					"parentId":this.secondMenuMsg.parentId,
					"sort":this.secondMenuMsg.sort,
					"url":this.secondMenuMsg.url,
					"iconFont":this.secondMenuMsg.iconFont
	    		},{
	    			headers:{
	    				'Authorization':this.getToken
	    			}
	    		})
	    		.then(res=>{
	    			if(res.status==200&&res.statusText=="OK"){
	    				this.secondAmendState = false;
	    				this.secondAmend = false;
	    				this.getMenuList();
	    				this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
	    			}
	    		})
	    		.catch(error=>{
	    			console.log(error)
	    		})
	    	},
	    	//修改二级菜单框
	    	amendSecondMenu(child){
	    		this.secondMenuMsg = child;
	    		this.secondAmend = true;
	    	},
	    	//提交新增二级菜单
	    	secondtData(){
	    		this.secondAddState = true;
	    		axios.post('/api/permisson/add',{
					"level": 2,
					"name":this.addSecondName,
					"parentId":this.firstMenuId,
					"url":this.addSecondUrl,
					"iconFont":this.addSecondIcon
	    		},{
	    			headers:{
	    				'Authorization':this.getToken
	    			}
	    		})
	    		.then(res=>{
	    			if(res.status==200&&res.statusText=="OK"){
	    				this.secondAddState = false;
	    				this.secondAdd = false;
	    				this.getMenuList();
	    				this.addSecondName='';
	    				this.addSecondUrl='';
	    				this.addSecondIcon='';
	    				this.addSecondUrl='';
	    				this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
	    			}
	    		})
	    		.catch(error=>{
	    			console.log(error)
	    		})
	    	},
	    	//新增二级菜单框
	    	addSecondMenu(id){
	    		this.firstMenuId = id;
	    		this.secondAdd = true;
	    	},
	    	//删除一级菜单
	    	delMenu(id){
	    		this.$confirm('是否删除该菜单?', '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(() => {
		      		this.loading = true;
		            axios.post('/api/permisson/del?id='+id,{},{
						headers:{
							'Authorization':this.getToken
						}
					})
					.then(res=>{
						if(res.status==200&&res.statusText=="OK"){
		    				this.getMenuList();
		    				this.$message({
					            message: res.data.msg,
					            type: 'success'
					        });
		    			}
					})
					.catch(error=>{
						console.log(error)
					})
		        }).catch(() => {
		            this.$message({
		            	type: 'info',
		            	message: '已取消删除'
		            });          
		        });
	    	},
	    	//提交修改一级菜单
	    	firstDataAmend(){
	    		this.firstAmendState = true;
	    		axios.post('/api/permisson/update',{
	    			"id":this.firstMenuMsg.id,
					"level":this.firstMenuMsg.level,
					"name":this.firstMenuMsg.name,
					"parentId":this.firstMenuMsg.parentId,
					"sort":this.firstMenuMsg.sort,
					"url":this.firstMenuMsg.url,
					"iconFont":this.firstMenuMsg.iconFont
	    		},{
	    			headers:{
	    				'Authorization':this.getToken
	    			}
	    		})
	    		.then(res=>{
	    			if(res.status==200&&res.statusText=="OK"){
	    				this.firstAmendState = false;
	    				this.firstAmend = false;
	    				this.getMenuList();
	    				this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
	    			}
	    		})
	    		.catch(error=>{
	    			console.log(error)
	    		})
	    	},
	    	//点击弹出修改一级菜单
	    	amendFirstMenu(item){
	    		this.firstAmend = true;
	    		this.firstMenuMsg = item;
	    	},
	    	//提交新增一级菜单
	    	firstData(){
	    		this.firstDataState= true;
	    		axios.post('/api/permisson/add',{
					"level": 1,
					"name":this.addFirstName,
					"parentId": 0,
					"url":this.addFirstUrl,
					"iconFont":this.addFirstIcon
	    		},{
	    			headers:{
	    				'Authorization':this.getToken
	    			}
	    		})
	    		.then(res=>{
	    			if(res.status==200&&res.statusText=="OK"){
	    				this.firstAddState = false;
	    				this.firstAdd = false;
	    				this.getMenuList();
	    				this.addFirstName='';
	    				this.addFirstUrl='';
	    				this.addFirstIcon='';
	    				this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
	    			}
	    		})
	    		.catch(error=>{
	    			console.log(error)
	    		})
	    	},
	    	//点击弹出新增一级菜单页面
			addFirstMenu(){
				this.firstAdd = true;
			},
		    //获取菜单列表
		    getMenuList(){
		    	axios.post('/api/permisson/list',{},{
		    		headers:{
	    				'Authorization':this.getToken
	    			}
		    	})
		    	.then(res=>{
		    		if(res.status==200&&res.statusText=="OK"){
		    			this.menuData = res.data;
			    		if(this.menuData.length==0){
			    			this.$message({
				            	type: 'info',
				            	message: '暂无菜单数据'
				            });
			    		}
		    		}
		    	})
		    	.catch(error=>{
		    		console.log(error)
		    	})
		    }
	    },
	    store,
		computed: {
		    getToken() {
		        return this.$store.state.token
		    }
		},
		watch:{
			getToken(){
				this.getMenuList();
			}
		},
		mounted(){
			if(this.getToken!=''){
				this.getMenuList();
			}
		}
    };
</script>

<style scoped>
	#parent{
		height: 100%;
		width: 100%;
	}
	.add{
		text-align: right;
		margin: 0.5% 1% 0.5% 0;
	}
	.menu{
		width: 100%;
		height: 100%;
		overflow: auto;
		background: #fff;
	}
	.menu .right{
		position: absolute;
		right: 7%;
	}
	.menu .right a{
		margin: 0 5px;
	}
	.main{
		height: 79%;
	}
	.shape{
		height: 100%;
		overflow: auto;
	}
	.addMsg{
		width: 70%;
    	margin-left: 15%;
	}
	.addMsg .single{
		margin: 2.5% 0;
	}
	.limits{
		height: 50%;
		overflow: hidden;
	}
</style>