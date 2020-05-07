<template>


  <scroll-bar>
	
	<logo  :collapse="isCollapse" />
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>

</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import Logo from './Logo'

export default {
  components: { SidebarItem, ScrollBar,Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
			console.log(this.$router.options.routes)
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
