<template>
  <!-- <div class> -->
  <el-row class="tac menu_page">
    <el-col >
      <!-- <h5>自定义颜色</h5> -->
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group> -->
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#324057"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <router-link to="/home">
          <el-menu-item index="0">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </router-link>
        <template v-for="item in items">
            <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                <template slot="title">
                    <i :class="'fa fa-margin ' + item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex">
                    <el-menu-item>
                        <span slot="title">{{citem.name}}</span>
                    </el-menu-item>
                </router-link>
            </el-submenu>
        </template>
        <!-- <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu> -->
      </el-menu>
    </el-col>
  </el-row>
  <!-- </div> -->
</template>
<script>
export default {
  name: "left-menu",
  components: {},
  data() {
    return {
      isCollapse: true,
      items: [
        {
          icon: "el-icon-s-order",
          name: "资金管理",
          path: "fund",
          children:[
            { path: "fundlist",name:"资金流水" }
          ]
        },
        {
          icon: "el-icon-s-platform",
          name: "信息管理",
          path: "info",
          children:[
            { path: "infoshow",name:"个人信息" }
          ]
        }
      ]
    };
  }
};
</script>
<style scoped>
.menu_page {
  position: fixed;
  top: 61px;

  left: 0;
  min-height: 100%;
  background-color: #324057;
  z-index: 9;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>