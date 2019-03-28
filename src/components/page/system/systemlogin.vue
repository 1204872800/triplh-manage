<template>
	<div id="parent">
		<el-collapse accordion v-model="activeNames" accordion>
			<el-collapse-item name="1">
			    <template slot="title">
			    	筛选
			    </template>
			    <div class="filtratebox">
			    	<div class="single">
			    		<span>筛选：</span>
			    		<el-input v-model="queryUserName" style="width: 80%;" size="small"></el-input>
			    	</div>
			    	<div class="single">
			    		<span>角色：</span>
			    		<el-select v-model="queryRoleId" style="width: 80%;" size="small">
						    <el-option
						      v-for="item in selectRole"
						      :key="item.id"
						      :label="item.name"
						      :value="item.id">
						    </el-option>
						</el-select>
			    	</div>
			    </div>
			    <div class="inquire">
					<el-button @click="inquire" size="small" type="success"><i class="el-icon-search"></i>查询</el-button>
				</div>
			</el-collapse-item>
		</el-collapse>
		<div class="operation">
			<el-button @click="addAccount" size="small" type="success">新增账号</el-button>
			<el-button @click="amendAccount" size="small" type="success">修改账号</el-button>
			<el-button @click="delAccount" size="small" type="success">删除账号</el-button>
			<el-button @click="freezeAccount" size="small" type="success">禁用账号</el-button>
			<el-button @click="unfreezeAccount" size="small" type="success">启用账号</el-button>
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
			      prop="userName"
			      align="center"
			      show-overflow-tooltip
			      label="账号"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      prop="role.name"
			      align="center"
			      show-overflow-tooltip
			      label="操作角色"
			      width="180">
			    </el-table-column>
			    <el-table-column
			      align="center"
			      show-overflow-tooltip
			      label="创建时间"
			      width="180">
			      	<template slot-scope="scope">
				        <span>{{scope.row.createTime==''?'':formatDateTime(scope.row.createTime)}}</span>
				    </template>
			    </el-table-column>
			    <el-table-column
			      align="center"
			      show-overflow-tooltip
			      label="修改时间"
			      width="180">
			      	<template slot-scope="scope">
				        <span>{{scope.row.editTime==''?'':formatDateTime(scope.row.editTime)}}</span>
				    </template>
			    </el-table-column>
			    <el-table-column
			      align="center"
			      show-overflow-tooltip
			      label="状态"
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
		  title="新增账号"
		  :visible.sync="addAccountBox"
		  width="50%">
		  <div class="addMsg">
		  	<div class="single">
		  		<span>账号：</span>
		  		<el-input v-model="addUserName" style="width: 80%;" size="small"></el-input>
		  	</div>
		  	<div class="single">
		  		<span>密码：</span>
		  		<el-input type="password" v-model="addPassword" style="width: 80%;" size="small"></el-input>
		  	</div>
		  	<div class="single">
		  		<span>角色：</span>
		  		<el-select v-model="addRoleId" style="width: 80%;" size="small">
				    <el-option
				      v-for="item in selectRole"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</el-select>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addAccountBox = false">取 消</el-button>
		    <el-button type="primary" :disabled="addAccountState" @click="subAddAccount">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="修改账号"
		  :visible.sync="amendAccountBox"
		  width="50%">
		  <div class="addMsg">
		  	<div class="single">
		  		<span>账号：</span>
		  		<el-input disabled v-model="clickMsg.userName" style="width: 80%;" size="small"></el-input>
		  	</div>
		  	<div class="single">
		  		<span>角色：</span>
		  		<el-select v-model="amendRoleId" style="width: 80%;" size="small">
				    <el-option
				      v-for="item in selectRole"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</el-select>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="amendAccountBox = false">取 消</el-button>
		    <el-button type="primary" :disabled="amendAccountState" @click="subAmendAccount">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import store from '../../../store/index.js';
	import axios from 'axios';
	export default{
		data(){
			return{
				activeNames:['1'],
				loading:false,
				sumTotal:0,
				tableData:[],
				currentPage:1,
				addAccountState:false,
				addAccountBox:false,
				selectRole:[],
				addUserName:'',
				addPassword:'',
				addRoleId:'',
				clickMsg:'',
				amendAccountBox:false,
				amendAccountState:false,
				amendRoleId:5,
				addRole:'',
				queryUserName:'',
				queryRoleId:''
			}
		},
		methods:{
			//启用账户
			unfreezeAccount(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择启用的账户',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.$confirm('是否启用选中账户?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			      }).then(() => {
			      		this.loading = true;
			            axios.post('/api/user/update?roleId',{
							'id':this.clickMsg.id,
							'userName':this.clickMsg.userName,
							'roleId':this.amendRoleId,
							'status':'1'
						},{
							headers:{
								'Authorization':this.getToken
							}
						})
						.then(res=>{
							if(res.status==200&&res.statusText=="OK"){
								this.$message({
						            message: '账号启用成功',
						            type: 'success'
						       });
						        this.getUserList();
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
			//禁用账户
			freezeAccount(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择禁用的账户',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.$confirm('是否禁用选中账户?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => {
			      		this.loading = true;
			            axios.post('/api/user/update',{
							'id':this.clickMsg.id,
							'userName':this.clickMsg.userName,
							'roleId':this.amendRoleId,
							'status':'0'
						},{
							headers:{
								'Authorization':this.getToken
							}
						})
						.then(res=>{
							if(res.status==200&&res.statusText=="OK"){
								this.$message({
						            message: '账号禁用成功',
						            type: 'success'
						       });
						        this.getUserList();
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
			//删除账户
			delAccount(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择删除的账户',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.$confirm('是否删除选中账户?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			      }).then(() => {
		      			this.loading = true;
			            axios.post('/api/user/del?id='+this.clickMsg.id,{},{
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
						        this.getUserList();
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
			//提交修改账号
			subAmendAccount(){
				this.loading = true;
				this.amendAccountState = true;
				axios.post('/api/user/update?roleId',{
					'id':this.clickMsg.id,
					'userName':this.clickMsg.userName,
					'roleId':this.amendRoleId,
					'status':'1'
				},{
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
				        this.amendAccountState = false;
				        this.amendAccountBox = false;
				        this.getUserList();
					}
				})
				.catch(error=>{
					console.log(error)
				})
			},
			//修改账户框
			amendAccount(){
				if(!this.clickMsg){
					this.$message({
			          message: '请选择修改的账号',
			          type: 'warning'
			       });
			       return;
				}
				else{
					this.amendAccountBox = true;
				}
			},
			//提交新增账号
			subAddAccount(){
				this.addAccountState = true;
				this.loading = true;
				axios.post('/api/user/add?roleId',{
					'userName':this.addUserName,
					'password':this.addPassword,
					'roleId':this.addRoleId,
					'status':'1'
				},{
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
				        this.addAccountState = false;
				        this.addAccountBox = false;
				        this.addUserName='';
				        this.addPassword='';
				        this.addRoleId='';
				        this.getUserList();
					}
				})
				.catch(error=>{
					console.log(error)
				})
			},
			//新增账号框
			addAccount(){
				this.addAccountBox = true;
			},
			//分页
			handleCurrentChange(val){
				this.loading = true;
				this.currentPage = val;
				this.getUserList();
			},
			//筛选
			inquire(){
				this.loading = true;
				this.getUserList();
			},
			//点击获取表格某一行数据
			getMsg(msg){
				if(!msg) return;
				this.clickMsg = msg;
				this.amendRoleId = this.clickMsg.role.id;
			},
			//获取账号列表
			getUserList(){
				this.loading = true;
				axios.post('/api/user/pageList?pageNum='+ this.currentPage +'&pageSize=30',{
					'roleId':this.queryRoleId,
					'userName':this.queryUserName
				},{
					headers:{
						"Authorization":this.getToken
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
			//获取角色下拉列表
			getRoleList(){
				axios.post('/api/role/list',{
					
				},{
	    			headers:{
	    				'Authorization':this.getToken
	    			}
	    		})
				.then(res=>{
					if(res.status==200&&res.statusText=="OK"){
						this.selectRole = res.data;
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
		store,
		computed: {
		    getToken() {
		        return this.$store.state.token
		    }
		},
		watch:{
			getToken(){
				this.getUserList();
				this.getRoleList();
			}
		},
		mounted(){
			if(this.getToken!=''){
				this.getUserList();
				this.getRoleList();
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
	    margin: 15px 0 15px 20px;
	}
	.addMsg{
		width: 70%;
    	margin-left: 15%;
	}
	.addMsg .single{
		margin: 2.5% 0;
	}
</style>