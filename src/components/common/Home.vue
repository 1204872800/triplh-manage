<template>
    <div class="wrapper">
        <v-head></v-head>
        <vTabs :style="{width:width}" class="tabs"></vTabs>
        <v-sidebar></v-sidebar>
        <div ref="content" class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTabs from './Tabs.vue';
    export default {
    	data(){
    		return{
    			width:''
    		}
    	},
        components:{
            vHead, vSidebar,vTabs
        },
        mounted(){
        	this.width = this.$refs.content.clientWidth +'px';
        }
    }
</script>
<style scoped>
	.tabs{
		position: absolute;
	    top: 70px;
	    left: 250px;
	    z-index: 2;
        padding-top: 5px;
        padding-left: 6px;
        box-sizing: border-box;
	}
</style>
