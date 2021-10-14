<template>
  <div class="content">
    <div class="box">
      <el-form
        label-width="80px"
        v-model="loginForm"
      >
        <el-form-item label="用户名：">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密 码：">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="reset"
          >重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
    }
  },
  methods: {
    login() {
      for (let key in this.loginForm) {
        if (this.loginForm[key] === '') {
          this.$message.error('账号或密码不能为空')
          return
        }
      }
      this.$http.post('/login', this.loginForm).then(({ data: res }) => {
        if (res.meta.status !== 200) {
          this.$message.error('账号或密码错误')
        } else {
          this.$message.success('成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }

      })
    },
    reset() {
      for (let key in this.loginForm) {
        this.loginForm[key] = ''
      }
    }
  },
}
</script>

<style scoped>
  .content {
    background: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box {
    height: 50%;
    width: 50%;
    background: #f4f4f4;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-form {
    width: 50%;
  }
</style>
