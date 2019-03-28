<template>
	<div id="parent">
		站点
	</div>
</template>

<script>
	import store from '../../../store/index.js';
	import aixos from 'axios';
	export default{
		data(){
			return{
				
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
				console.log(this.getToken)
			}
		},
		methods:{
			
		},
		mounted(){
			if(this.getToken!=''){
				console.log(this.getToken)
			}
		}
	}
</script>

<style scoped>
	
</style>