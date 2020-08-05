<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <div>
      <div style="margin-right:20px;font-size:15px">欢迎超级管理员~</div>
      <el-button type="info" @click="logout">退出</el-button>
      </div>
    
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 菜单折叠 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏区域 -->
        <el-menu
          router
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active='activePath'
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-document"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath:'',
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.getMenuList();
    this.activePath=sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 退出即清除token
      sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 切换菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态----防止用户刷新页面，高亮消失
    saveNavState(activePath){
      sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    },
  }
};
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>