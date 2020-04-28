<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1||item.meta.go=='false'" class="no-redirect">{{item.meta.title}}</span>
        <span v-else :to="item.redirect||item.path" :index="index" @click="go(index)">{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
			console.log(this.$route);
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)

      const first = matched[0]
			console.log(first)
      if (first && first.name !== 'home') {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      }
			console.log(matched)
      this.levelList = matched
    },
		go(index){
			if(index!=0){
				var levelList=this.levelList.length-1;
				console.log(levelList);
				console.log(index)
				this.$router.go(-(levelList-index));
			}else{
				this.$router.push({path: '/home'})
			}
				
		}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
