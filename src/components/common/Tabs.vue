<template>
	<div id="parent">
		<el-tabs v-model="activeName" type="card" editable  @edit="handleTabsEdit">
		  <el-tab-pane
		    :key="item.name"
		    v-for="(item, index) in arr"
		    :label="item.name"
		    :name="item.path">
		  </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import store from '../../store/index.js';
	export default{
		data(){
			return{
				activeName:'/readme',
				arr:[{
					name:"首页",
					path:"/readme"
				}],
				atCurrent:''
			}
		},
		methods:{
			handleTabsEdit(targetName, action){
				if (action === 'remove') {
		            let tabs = this.arr;
		            let activeName = this.activeName;
		            if (activeName === targetName) {
			            tabs.forEach((tab, index) => {
			                if (tab.path === targetName) {
				                let nextTab = tabs[index + 1] || tabs[index - 1];
				                if (nextTab) {
				                    activeName = nextTab.path;
				                }
			                }
			            });
		            }
		            this.activeName = activeName;
		            this.arr = tabs.filter(tab => tab.path !== targetName);
		        }
			}
		},
		store,
		watch:{
			//获取路由值
		    $route(){
		    	console.log(this.$route)
	    		this.activeName = this.$router.currentRoute.path;
		    	this.arr.push(this.$route)
		    	var kv = {}
			    for (var i = 0; i < this.arr.length;) {
			        if (kv[this.arr[i].name + ',' + this.arr[i].path]) {
			            this.arr.splice(i, 1);
			        }
			        else {
			            kv[this.arr[i].name + ',' + this.arr[i].path] = true;
			            i++;
			        }
			    }
			    this.atCurrent = this.arr.length-1;   
			    console.log(this.arr)
		    },
		    activeName(val){
		    	this.$router.push(val)
		    }
	   },
		mounted(){
			this.activeName = this.$route.path;
			for (var i=0;i<this.arr.length;i++) {
				if(this.arr[i].name!=this.$route.name){
					this.arr.push(this.$route);
				}
			}
		}
	}
</script>

<style scoped>
	#parent{
		width: 100%;
	}
</style>