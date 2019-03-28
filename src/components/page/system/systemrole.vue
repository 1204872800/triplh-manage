<template>
	<div id="parent">
		<div class="operation">
			<el-button size="small" @click="addRole" type="success">新增角色</el-button>
			<el-button size="small" @click="amendRole" type="success">修改角色</el-button>
			<el-button size="small" @click="delRole" type="success">删除角色</el-button>
			<el-button size="small" @click="freezeRole" type="success">禁用角色</el-button>
			<el-button size="small" @click="unfreezeRole" type="success">启用角色</el-button>
			<el-button size="small" @click="lookOverData" type="success">查看配置权限</el-button>
		</div>
		<div class="datum">
			<el-table
				v-loading="loading"
			    element-loading-text="拼命加载中"
			    element-loading-spinner="el-icon-loading"
			    element-loading-background="rgba(0, 0, 0, 0.8)"
			    highlight-current-row
			    @current-change="getMsg"
			    :data="tableData"
			    border
			    height="100%"
			    style="width: 100%;height: 100%;overflow: auto;">
			    <el-table-column
			    	align="center"
			    	fixed
				    type="index"
				    show-overflow-tooltip
				    label=" "
				    width="40">
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="角色名称"
			      align="center"
			      show-overflow-tooltip
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="description"
			      label="角色描述"
			      align="center"
			      show-overflow-tooltip
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="creater"
			      label="创建者"
			      align="center"
			      show-overflow-tooltip
			      width="180">
			    </el-table-column>
			    <el-table-column
			      label="创建时间"
			      align="center"
			      show-overflow-tooltip
			      width="180">
			      	<template slot-scope="scope">
				        <span>{{scope.row.createTime==''?'':formatDateTime(scope.row.createTime)}}</span>
				    </template>
			    </el-table-column>
			    <el-table-column
			      label="修改时间"
			      align="center"
			      show-overflow-tooltip
			      width="180">
			      	<template slot-scope="scope">
				        <span>{{scope.row.editTime==''?'':formatDateTime(scope.row.editTime)}}</span>
				    </template>
			    </el-table-column>
			    <el-table-column
			      label="状态"
			      align="center"
			      show-overflow-tooltip
			      width="180">
			      	<template slot-scope="scope">
				        <span v-if="scope.row.status==1">启用</span>
				       	<span v-if="scope.row.status==0">禁用</span>
				    </template>
			    </el-table-column>
			</el-table>
		</div>
		<div class="paging">
			<el-pagination
		      @current-change="handleCurrentChange"
		      :current-page.sync="currentPage"
		      :page-size="30"
		      layout="total, prev, pager, next, jumper"
		      :total="sumTotal">
		    </el-pagination>
		</div>
		<el-dialog
		  title="新增角色"
		  :visible.sync="addRoleBox"
		  width="50%">
		  <div class="addMsg">
		  	<div class="single">
		  		<span>角色名称：</span>
		  		<el-input v-model="addName" style="width: 80%;" size="small"></el-input>
		  	</div>
		  	<div class="single">
		  		<span>角色描述：</span>
		  		<el-input v-model="addDescription" style="width: 80%;" size="small"></el-input>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addRoleBox = false">取 消</el-button>
		    <el-button type="primary" :disabled="addRoleState" @click="subAddRole">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="修改角色"
		  :visible.sync="amendRoleBox"
		  width="50%">
		  <div class="addMsg">
		  	<div class="single">
		  		<span>角色名称：</span>
		  		<el-input v-model="clickMsg.name" style="width: 80%;" size="small"></el-input>
		  	</div>
		  	<div class="single">
		  		<span>角色描述：</span>
		  		<el-input v-model="clickMsg.description" style="width: 80%;" size="small"></el-input>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="amendRoleBox = false">取 消</el-button>
		    <el-button type="primary" :disabled="amendRoleState" @click="subAmendRole">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="查看 / 配置权限范围" :visible.sync="lookOver">
			<div class="limits">
				<el-tree class="shape"
					show-checkbox
					:default-checked-keys="bindingMsg"
					:data="menuData"
					accordion
					node-key="id"
					ref="tree"
					highlight-current
					:props="defaultProps">
				</el-tree>
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="lookOver = false">取 消</el-button>
			    <el-button type="success" :disabled="lookOverState" @click="look_over">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import store from '../../../store/index.js';
	import axios from 'axios';
	export default{
		data(){
			return{
				loading:false,
				currentPage:1,
				sumTotal:0,
				tableData:[],
				addRoleBox:false,
				addName:'',
				addDescription:'',
				addRoleState:false,
				clickMsg:'',
				amendRoleBox:false,
				amendRoleState:false,
				//权限
				lookOver:false,
				lookOverState:false,
				menuData:[],
				bindingMsg:[],
				defaultProps: {
		            children: 'childPermissions',
		            label: 'name'
		        },
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
				this.getRoleList();
			}
		},
		methods:{
			//提交权限配置
			look_over(){
				this.lookOverState = true;
				var menu_acts = new Array();
				for(var i=0;i<this.$refs.tree.getCheckedNodes().length;i++){
					menu_acts.push(this.$refs.tree.getCheckedNodes()[i].id)
				}
				axios.post('/api/role/editPermission?roleId='+this.clickMsg.id+'&permissions='+menu_acts.join(','),{},{
					headers:{
	    				'Authorization':this.getToken
	    			}
				})
				.then(res=>{
					if(res.status==200&&res.statusText=="OK"){
						this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
				        this.getRoleList();
				        this.lookOver = false;
				        this.lookOverState = false;
					}
				})
				.catch(error=>{
					console.log(error)
				})
			},
			//查看权限
			lookOverData(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择查看权限的角色',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.lookOver = true;
			    	//查看对应角色的权限
			    	axios.post('/api/role/permissionList?roleId='+this.clickMsg.id,{},{
			    		headers:{
		    				'Authorization':this.getToken
		    			}
			    	})
			    	.then(res=>{
			    		if(res.status==200&&res.statusText=="OK"){
			    			var binding = new Array();
			    			for(var i=0;i<res.data.parentPermissions.length;i++){
			    				binding.push(res.data.parentPermissions[i].id)
			    			}
			    			this.bindingMsg = binding;
			    			//查看菜单列表
							axios.post('/api/permisson/list',{},{
					    		headers:{
				    				'Authorization':this.getToken
				    			}
					    	})
					    	.then(res=>{
					    		if(res.status==200&&res.statusText=="OK"){
					    			this.menuData = res.data;
					    		}
					    	})
					    	.catch(error=>{
					    		console.log(error)
					    	})
			    		}
			    	})
			    	.catch(error=>{
			    		console.log(error)
			    	})
				}
			},
			//启用角色
			unfreezeRole(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择启用的角色',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.$confirm('是否启用选中角色?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			      }).then(() => {
			      		this.loading = true;
			            axios.post('/api/role/update',{
							"id":this.clickMsg.id,
							"name":this.clickMsg.name,
							"description":this.clickMsg.description,
							"status":'1'
						},{
							headers:{
								"Authorization":this.getToken
							}
						})
						.then(res=>{
							if(res.status==200&&res.statusText=="OK"){
								this.$message({
						            message: '角色启用成功',
						            type: 'success'
						        });
						        this.getRoleList();
							}
						})
						.catch(error=>{
							console.log(error)
						})
			        }).catch(() => {
			            this.$message({
			            	type: 'info',
			            	message: '已取消启用'
			            });          
			        });
				}
			},
			//禁用角色
			freezeRole(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择禁用的角色',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.$confirm('是否禁用选中角色?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			      }).then(() => {
			      		this.loading = true;
			            axios.post('/api/role/update',{
							"id":this.clickMsg.id,
							"name":this.clickMsg.name,
							"description":this.clickMsg.description,
							"status":'0'
						},{
							headers:{
								"Authorization":this.getToken
							}
						})
						.then(res=>{
							if(res.status==200&&res.statusText=="OK"){
								this.$message({
						            message: '角色禁用成功',
						            type: 'success'
						        });
						        this.getRoleList();
							}
						})
						.catch(error=>{
							console.log(error)
						})
			        }).catch(() => {
			            this.$message({
			            	type: 'info',
			            	message: '已取消禁用'
			            });          
			        });
				}
			},
			//删除角色
			delRole(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择删除的角色',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.$confirm('是否删除选中角色?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			      }).then(() => {
			      		this.loading = true;
			            axios.post('/api/role/del?roleId='+this.clickMsg.id,{},{
							headers:{
								"Authorization":this.getToken
							}
						})
			            .then(res=>{
			            	if(res.status==200&&res.statusText=="OK"){
								this.$message({
						            message: res.data.msg,
						            type: 'success'
						        });
						        this.getRoleList();
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
				}
			},
			//提交修改角色
			subAmendRole(){
				this.amendRoleState=true;
				this.loading = true;
				axios.post('/api/role/update',{
					"id":this.clickMsg.id,
					"name":this.clickMsg.name,
					"description":this.clickMsg.description,
					"status":'1'
				},{
					headers:{
						"Authorization":this.getToken
					}
				})
				.then(res=>{
					if(res.status==200&&res.statusText=="OK"){
						this.amendRoleState = false;
						this.amendRoleBox = false;
						this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
				        this.getRoleList();
					}
				})
				.catch(error=>{
					console.log(error)
				})
			},
			//修改角色框
			amendRole(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择修改的角色',
			          type: 'warning'
			       });
			       return;
				}else{
					this.amendRoleBox = true;
				}
			},
			//提交新增角色信息
			subAddRole(){
				this.addRoleState = true;
				this.loading = true;
				axios.post('/api/role/add',{
					"id":0,
					"name":this.addName,
					"description":this.addDescription,
					"status":'1'
				},{
					headers:{
						"Authorization":this.getToken
					}
				})
				.then(res=>{
					if(res.status==200&&res.statusText=="OK"){
						this.$message({
				            message: res.data.msg,
				            type: 'success'
				        });
				        this.addRoleState = false;
				        this.addRoleBox = false;
				        this.addName='';
				        this.addDescription='';
				        this.getRoleList();
					}
				})
				.catch(error=>{
					console.log(error)
				})
			},
			//新增角色框
			addRole(){
				 this.addRoleBox=true;
			},
			//分页
			handleCurrentChange(val){
				this.loading = true;
				this.currentPage = val;
				this.getRoleList();
			},
			//获取点击表格的值
			getMsg(msg){
				if(!msg) return;
				this.clickMsg = msg;
			},
			//获取角色列表
			getRoleList(){
				this.loading = true;
				axios.post('/api/role/pageList?pageNum='+this.currentPage+'&pageSize=30',{},{
	    			headers:{
	    				'Authorization':this.getToken
	    			}
	    		})
				.then(res=>{
					if(res.status==200&&res.statusText=="OK"){
						this.loading = false;
						this.sumTotal = res.data.total;
						this.tableData = res.data.list;
					}
				})
				.catch(error=>{
					console.log(error)
				})
			},
			//封装时间戳转换成标准时间格式的方法
        	formatDateTime(timeStamp){
 				var date = new Date(timeStamp);
				var y = date.getFullYear();      
			    var m = date.getMonth() + 1;      
			    m = m < 10 ? ('0' + m) : m;      
			    var d = date.getDate();      
			    d = d < 10 ? ('0' + d) : d;      
			    var h = date.getHours();    
			    h = h < 10 ? ('0' + h) : h;    
			    var minute = date.getMinutes();    
			    var second = date.getSeconds();    
			    minute = minute < 10 ? ('0' + minute) : minute;      
			    second = second < 10 ? ('0' + second) : second;     
			    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
			}
		},
		mounted(){
			if(this.getToken!=''){
				this.getRoleList()
			}
		}
	}
</script>

<style scoped>
	#parent{
		height: 100%;
	}
	.filtratebox{
		overflow: hidden;
	}
	.filtratebox .single{
		width: 25%;
		float: left;
	}
	.inquire{
	    margin-top: 15px;
	    text-align: center;
	}
	.datum{
		height: 67%;
	}
	.operation{
	    margin: 0 0 15px 20px;
	}
	.addMsg{
		width: 70%;
    	margin-left: 15%;
	}
	.addMsg .single{
		margin: 2.5% 0;
	}
</style>