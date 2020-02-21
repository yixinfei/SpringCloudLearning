<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">项目管理</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img :src="imgSrc" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{user.name}}
            <i class="el-icon-caret-bottom"></i>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changMySelf">个人中心</el-dropdown-item>
            <el-dropdown-item command="changPassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="修改密码" width="400px" :visible.sync="dialogFormVisibleEditPassword">
      <el-form :model="formEdit">
        <el-form-item label="原始密码" :label-width="formLabelWidth">
          <el-input
            clearable
            type="password"
            v-model="formEdit.oldPassword"
            autocomplete="off"
            placeholder="请输入原始密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input
            clearable
            type="password"
            v-model="formEdit.newPassword"
            autocomplete="off"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input
            clearable
            type="password"
            v-model="formEdit.newAgainPassword"
            autocomplete="off"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditPassword = false">取 消</el-button>
        <el-button type="primary" @click="editPassword()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="个人中心" width="50%" :visible.sync="dialogFormVisibleMySelf">
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 个人信息 -->
          <el-card shadow="always">
            <div style="text-align:center">
              <el-upload
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                class="img-btn"
                action="#"
                :http-request="uploadImg"
              >
                <el-avatar v-if="!progressFlag" class="head-img" :size="100" :src="imgSrc"></el-avatar>
                <div v-show="progressFlag" class="head-img">
                  <el-progress type="circle" :percentage="progressPercent"></el-progress>
                </div>
              </el-upload>
            </div>
            <div>
              <h2 style="text-align:center">{{user.name}}</h2>
            </div>
            <div>
              <div style="text-align:center">{{user.roleName}}</div>
            </div>
            <div style="margin-top:30px">
              <i class="el-icon-message-solid"></i>
              <span style="margin-left:20px">{{user.email}}</span>
            </div>
            <div style="margin-top:10px">
              <i class="el-icon-phone"></i>
              <span style="margin-left:20px">{{user.phone}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <!-- 修改信息 -->
          <el-card shadow="always">
            <el-form :model="formEdit">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input clearable v-model="formUser.name" autocomplete="off" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-radio-group v-model="formUser.sex">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input
                  clearable
                  type="number"
                  v-model="formUser.phone"
                  autocomplete="off"
                  placeholder="请输入电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input clearable v-model="formUser.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align:right" class="dialog-footer">
              <el-button type="primary" @click="editUser()">更新基本信息</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import bus from "./bus";
import { encrypt } from "@/assets/js/cryptoJS";
export default {
  data() {
    return {
      tooltipPasswordDisabled: false,
      formLabelWidth: "80px",
      formEdit: { oldPassword: "", newPassword: "", newAgainPassword: "" },
      formEditEn: { oldPassword: "", newPassword: "" },
      formUser: {},
      user: {},
      collapse: false,
      fullscreen: false,
      message: 2,
      dialogFormVisibleEditPassword: false,
      dialogFormVisibleMySelf: false,
      imageUrl: "true",
      progressFlag: "",
      progressPercent: 0
    };
  },
  computed: {
    imgSrc() {
      const imgSrc = this.$store.getters.user.headPortrait
        ? this.$http.defaults.baseURL + this.$store.getters.user.headPortrait
        : require("@/assets/image/headPortrait.jpg");
      return imgSrc;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        sessionStorage.removeItem("token");
        this.$router.push("/login");
      } else if (command == "changPassword") {
        this.dialogFormVisibleEditPassword = true;
      } else if (command == "changMySelf") {
        this.dialogFormVisibleMySelf = true;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    //修改密码
    async editPassword() {
      if (!this.formEdit.oldPassword) {
        this.$message.error("请输入原始密码");
        return;
      }
      if (!this.formEdit.newPassword) {
        this.$message.error("请输入新密码");
        return;
      }
      if (!this.formEdit.newAgainPassword) {
        this.$message.error("请再次输入旧密码");
        return;
      }
      if (this.formEdit.newPassword !== this.formEdit.newAgainPassword) {
        this.$message.error("两次输入的密码不一致");
        return;
      }
      //密码加密
      this.formEditEn.oldPassword = encrypt(this.formEdit.oldPassword);
      this.formEditEn.newPassword = encrypt(this.formEdit.newPassword);
      const res = await this.$http.put("users/password", this.formEditEn);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      sessionStorage.setItem("token", res.data.token);
      this.$message.success(res.meta.msg);
      this.dialogFormVisibleEditPassword = false;
      this.formEdit = {};
      this.formEditEn = {};
    },

    uploadImg(f) {
      console.log(f);
      this.progressFlag = true;
      let formdata = new FormData();
      formdata.append("image", f.file);
      this.$http({
        url: "/users/image",
        method: "post",

        data: formdata,
        headers: { "Content-Type": "multipart/form-data", isFormData: true },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent =
            (progressEvent.loaded / progressEvent.total) * 100;
        }
      })
        .then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.formUser.headPortrait = res.data.imageUrl;
          this.$store.commit("add_User", this.formUser);
          if (this.progressPercent === 100) {
            this.progressFlag = false;
            this.progressPercent = 0;
          }
        })
        .then(error => {
          console.log(error);
        });
    },
    // 上传图片前的过滤
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    async editUser() {
        if(this.formUser.name == ''){
          this.$message.error("请输入姓名");
          return;
        }
        const res =await this.$http.put('users',this.formUser);
        console.log('呵呵',res);
        if(res.meta.status !=200){
            this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.$store.commit('add_User',this.formUser);
        this.user = JSON.parse(JSON.stringify(this.formUser));
    }
  },
  mounted() {
    this.user = this.$store.getters.user;
    //两个值之间不联动
    this.formUser=JSON.parse(JSON.stringify(this.user));
    if (document.body.clientWidth < 1366) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
