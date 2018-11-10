<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="logout"><a href="#" @click.prevent="logout">退出登陆</a></div>
        <h1>电商后台管理系统</h1>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#ffd04b"
                   router>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/users">
                  <i class="el-icon-menu"></i>用户列表
                  </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
                <el-menu-item index="/rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/goods"><i class="el-icon-menu"></i>商品列表</el-menu-item>
                <el-menu-item index="3-2"><i class="el-icon-menu"></i>分类参数</el-menu-item>
                <el-menu-item index="/categories"><i class="el-icon-menu"></i>商品分类</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/orders"><i class="el-icon-menu"></i>订单列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/reports"><i class="el-icon-menu"></i>数据报表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      // 打开提示框
      this.$confirm('确认是否要退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 销毁token,并跳转到登录页
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message.success('退出登陆成功')
        })
        .catch(() => {
          this.$message.error('已取消')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
.el-header {
  background-color: #ccc;
  .logo {
    float: left;
    height: 100%;
    width: 180px;
    background-image: url('../assets/logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .logout {
    float: right;
    line-height: 60px;
  }
  h1 {
    overflow: hidden;
    text-align: center;
    line-height: 60px;
    color: #fff;
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eee;
}
</style>
