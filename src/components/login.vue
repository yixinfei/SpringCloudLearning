<template>
  <div class="login_wrapper">
    <div class="login">
      <el-form :model="formLogin">
        <el-form-item>
          <h2 class="title">后台管理系统</h2>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登陆</el-button>
          <span v-show="this.errorInfo.isShowError" class="error">{{this.errorInfo.text}}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>



<script>
import {encrypt} from '@/assets/js/cryptoJS'
export default {
  name: "login",
  data() {
    return {
      formLogin: {
        //表单对象
        account: "admin",
        password: "1234"
      },
      errorInfo: {
        text: "登陆失败,请重试",
        isShowError: false //显示错误提示
      }
    };
  },
  mounted() {
    document.onkeydown = event => {
      //var router=this.$route.path;
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 13 && this.$route.path == "/login") {
        // enter 键
        this.login();
      }
    };
  },
  methods: {
    async login() {
      if (!this.formLogin.account) {
        this.$message.error('请输入账号');
        return;
      }
      if (!this.formLogin.password) {
        this.$message.error('请输入密码');
        return;
      }
      const password= encrypt(this.formLogin.password);
      const res = await this.$http.post("/login", {
        account: this.formLogin.account,
        password: password
      });
      console.log("hhe:", res);
      const {
        meta: { status, msg },
      } = res;
      if (status != 200) {
        this.errorInfo.isShowError = true;
        this.$message.error(msg);
        return false;
      }
      this.$message.success(msg);
      sessionStorage.setItem("token", res.data.user.token);
      this.$store.commit("add_User", res.data.user);
      this.$store.commit("add_Menus", res.data.menus);
      this.$router.push("/home");
    }
  }
};
</script>

<style lang="scss">
$input_width: 300px;

.login_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login {
    width: 460px;
    height: 296px;
    margin-top: -150px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      text-align: center;
      color: #505458;
    }
    .el-form-item__content {
      width: $input_width;
    }
    .el-button {
      width: $input_width;
    }
    .el-form {
      margin: 30px 80px auto 80px;
      .error {
        display: block;
        text-align: center;
        color: red;
      }
    }
  }
}
.recover {
  position: absolute;
  bottom: 0px;
  cursor: pointer;
  color: #e6a23c;
  // display: none;
}
.bei {
  position: absolute;
  bottom: 20px;
  cursor: pointer;
  color: #505458;
}
</style>