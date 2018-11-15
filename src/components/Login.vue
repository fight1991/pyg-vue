<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" status-icon >
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度为3-6个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度为6-12个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login() {
      // 校验表单
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送请求
          let { meta: { status }, data } = await this.axios({
            method: 'post',
            url: 'login',
            data: this.form
          })
          if (status === 200) {
            this.$message.success('登陆成功')
            // 本地存储token
            localStorage.setItem('token', data.token)
            // 跳转到首页
            this.$router.push('/home')
          } else {
            this.$message.error('用户名或密码错误')
          }
        } else {
          return false
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  // width: 100%;
  background-color: #ccc;
  overflow: hidden;
}
.el-form {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  margin: 150px auto;
  border-radius: 20px;
  position: relative;
  img {
    position: absolute;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
  }
}
</style>
