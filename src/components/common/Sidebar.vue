<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="(item,i) in menuList">
        <template v-if="item.subs.length>0">
          <el-submenu :index="item.index" :key="i" style>
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="(subItem,i) in item.subs"
              :key="i"
              :index="subItem.index"
            >{{ subItem.title }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-if="item.subs.length==0">
          <el-menu-item :index="item.index" :key="i" style>
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
  
</template>


<script>
import bus from "./bus";
export default {
  data() {
    return {
      collapse: false,
      menuList: []
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },

  created() {
    this.menuList = this.$store.getters.menuList;
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #000000;
  background-color: #00d1b2;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
