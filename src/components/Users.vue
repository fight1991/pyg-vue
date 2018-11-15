<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="input">
      <el-input v-model="query" placeholder="请输入内容" >
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="addBtn">添加用户</el-button>
    </div>
    <el-table
    :data="userList"
    stripe
    style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="130">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="100">
        <template slot-scope="scope">
         <el-switch v-model="scope.row.mg_state" @change="statusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit"  size="small" plain @click="editUser(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small"  plain @click="delUser(scope.row.id)"></el-button>
            <el-button type="success" icon="el-icon-check" size="small" @click="showRoles(scope.row)"  plain>分配角色</el-button>
          </el-row>
        </template>
      </el-table-column>
  </el-table>
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[2, 3, 4, 5]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
  <!-- 添加/编辑用户表单 -->
    <el-dialog  :visible.sync="dialogFormVisible" >
      <template name="title">
        <h1>{{title}}</h1>
      </template>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off" :disabled="!flag"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" v-if="flag">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model.number="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser" v-if="flag">确 定</el-button>
        <el-button type="primary" v-if="!flag" @click="changeInfo">修 改</el-button>
      </div>
    </el-dialog>
  <!-- 分配角色表单 -->
  <el-dialog title="分配角色" :visible.sync="dialogFormVisible1">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色列表">
        <el-select v-model="form.roles" placeholder="请选择角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="assignRoles">分 配</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询字段
      query: '',
      // 当前页
      currentPage: 1,
      // 显示的条数
      pageSize: 2,
      userList: [],
      total: 6,
      title: '添加用户',
      flag: true,
      id: '',
      roleList: [],
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        roles: ''
      },
      formLabelWidth: '80px',
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度为3-6个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度为6-12个字符', trigger: 'change' }
        ],
        email: [
          {
            type: 'email',
            // test: /^[0-9a-zA-Z]+@[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/,
            message: '邮箱格式错误',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            type: 'number',
            // test: /^1[2345678]{10}/,
            message: '手机格式错误',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    // 渲染当前页
    this.render()
    // 发送axios请求,获取角色列表
    this.axios({
      methods: 'get',
      url: `roles`
    }).then(res => {
      console.log(res)
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
    })
  },
  methods: {
    // 状态改变
    async statusChange(info) {
      // 发送axios请求
      let { meta: { status }, data } = await this.axios({
        method: 'put',
        url: `users/${info.id}/state/${info.mg_state}`
      })
      if (status === 200) {
        if (data.mg_state === 1) {
          this.$message.success('启用成功')
        } else {
          this.$message.warning('禁用成功')
        }
      }
    },
    // 渲染页面
    async render() {
      // 页面加载时,发送请求,宣染导航
      let { meta: { status }, data } = await this.axios({
        method: 'get',
        url: 'users',
        // axios中 get请求参数项为params
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      if (status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error('获取数据失败')
        // this.$router.push('/home')
      }
    },
    // 获取当前页码
    handleCurrentChange(page) {
      this.currentPage = page
      this.render()
    },
    // 每页条数改变时触发
    handleSizeChange(page) {
      this.pageSize = page
      this.render()
    },
    // 搜索功能
    search() {
      // 从第一页开始显示
      this.currentPage = 1
      this.render()
    },
    // 删除功能
    async delUser(id) {
      try {
        await this.$confirm('确认是否要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送axios请求
        let { meta: { status } } = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        if (status === 200) {
          this.$message('用户已删除')
          if (this.userList.length === 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.render()
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
      // .catch(() => {
      //   this.$message.error('取消删除')
      // })
    },
    // 点击添加用户按钮显示dialog框
    addBtn() {
      this.$refs.form.resetFields()
      this.dialogFormVisible = true
      this.title = '添加用户'
      this.flag = true
    },
    // 设置dialog框中的添加用户功能
    addUser() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送axios请求
          let { meta: { status } } = await this.axios({
            method: 'post',
            url: 'users',
            data: this.form
          })
          if (status === 201) {
            this.$message.success('添加成功')
            // 清空表单内容,并关闭对话框
            this.$refs.form.resetFields()
            this.dialogFormVisible = false
            // 重新渲染当前页
            this.render()
          } else {
            this.$message.error('添加失败')
          }
        } else {
          return false
        }
      })
    },
    // 编辑用户
    editUser(id) {
      this.id = id
      // 显示dialog框
      this.dialogFormVisible = true

      // 更改插槽
      this.title = '编辑用户'
      // 密码框隐藏
      this.flag = false
      // 将对应的数据,显示在表格中
      console.log(id)
      this.axios({
        method: 'get',
        url: `users/${id}`
      }).then(res => {
        console.log(res)

        this.form.username = res.data.username
        this.form.email = res.data.email
        this.form.mobile = res.data.mobile
        // 数据改变 Dom 更新是异步的,所以掉用$nextTick方法
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      })
    },
    // 修改用户信息
    changeInfo() {
      this.axios({
        method: 'put',
        url: `users/${this.id}`,
        data: {
          email: this.form.email,
          mobile: this.form.mobile
        }
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('修改成功')
          this.render()
          this.dialogFormVisible = false
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 展示分配表单
    showRoles(info) {
      // 显示表单
      this.dialogFormVisible1 = true
      // 设置input表单内容
      this.form.username = info.username
      this.id = info.id
    },
    // 分配角色
    async assignRoles() {
      // 分配角色没选择时,代码不执行
      if (this.form.roles.length === 0) {
        return
      }
      let { meta: { status } } = await this.axios({
        url: `users/${this.id}/role`,
        method: 'put',
        data: {
          rid: this.form.roles
        }
      })
      if (status === 200) {
        this.$message.success('分配角色成功')
        // 关闭分配对话框
        this.this.dialogFormVisible1 = false
      } else {
        this.$message.error('分配失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  // height: 60px;
  line-height: 60px;
  background-color: #d4dae0;
  padding-left: 20px;
  font-size: 20px;
}
.users {
  .input {
    display: flex;
    justify-content: flex-start;
    width: 500px;
  }
}
</style>
