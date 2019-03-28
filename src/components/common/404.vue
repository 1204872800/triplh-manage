<template>
	<div id="parent">
		<div class="notfundbox">
			<img src="../../assets/images/pic404.png"/>
			<div class="explain">
				抱歉，您访问的页面不存在
			</div>
			<div class="operate">
				<el-button class="previous" @click="previous" type="success">返回上一页</el-button>
				<el-button class="login" @click="returnLogin" type="success">返回登录页</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import store from '../../store/index.js';
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			previous(){
				window.history.go(-1)
			},
			returnLogin(){
				
			}
		},
		store
	}
</script>

<style scoped>
	#parent{
		height:100%;
		width: 100%;
		background: #fff;
	}
	#parent .notfundbox{
		width: 565px;
		height: 392px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		text-align: center;
	}
	#parent .notfundbox img{
		width: 565px;
		height: 184px;
	}
	#parent .notfundbox .explain{
		font-size: 32px;
		color: #323333;
		font-weight: 900;
		line-height: 64px;
		margin-top: 50px;
	}
	#parent .notfundbox .operate{
		margin-top: 48px;
		overflow: hidden;
	}
	#parent .notfundbox .operate .previous{
		float: left;
		width: 187px;
		height: 46px;
	}
	#parent .notfundbox .operate .login{
		float: right;
		width: 187px;
		height: 46px;
	}
</style>