<template>
  <section>
    <div class="table">
      <!-- 页面表格begin -->
      <div id="table" class="container">
        <!-- 页面内容区begin -->
        <div class="handle-box" style="height:750px;">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="18">
              <el-form :inline="true" :model="unit">
                <el-row>
                  <el-form-item label="系统名称：">
                    <el-input class="setInput" v-model="unit.systemName" placeholder="请输入系统名称" clearable></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="导航名称：">
                    <el-input class="setInput" v-model="unit.navigationName" placeholder="请输入导航" clearable></el-input>
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="网页封面：">
                    <el-upload
                      ref="upload"
                      class="avatar-uploader"
                      action="/#"
                      :data="unit"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :auto-upload="false"
                      :http-request="submitUpload"
                      :on-change="onchange"
                    >
                      <img
                        v-if="unit.loadingImage"
                        :src="unit.loadingImage"
                        class="avatar-cover avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon-cover"></i>
                      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，分辨率应为1920*1080及以上</div>
                    </el-upload>
                  </el-form-item>
                </el-row>
              </el-form>
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="10">
                  <el-button type="primary" @click="submitUpload">提交</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      //修改信息
      unit: {
        id: "",
        systemName: "",
        loadingImage: "",
        navigationName: ""
      },
      file: ""
    };
  },
  computed: {},
  mounted() {
    this.getUnitList();
  },
  methods: {
    //获取数据
    async getUnitList() {
      const res = await this.$http.get("unit");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }

      res.data.loadingImage = res.data.loadingImage
        ? this.$http.defaults.baseURL + res.data.loadingImage
        : "";
      this.unit = res.data;
    },
    submitUpload() {
      console.log(this.file);
      this.$http({
        url: "/unit",
        method: "post",
        data: {
          id: this.unit.id,
          image: this.file,
          systemName: this.unit.systemName,
          navigationName: this.unit.navigationName
        }
      })
        .then(res => {
          console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg);
            return;
          } else {
            this.$message.success(res.meta.msg);
          }
        })
        .then(error => {
          console.log(error);
        });
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      let isJPG;
      if (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      ) {
        isJPG = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG|JPEG|PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过5MB!");
      }
      return isJPG && isLt2M;
    },
    //获取事件内的路径
    onchange: function(file, fileList) {
      var _this = this;
      var event = event || window.event;
      file = event.target.files || event.dataTransfer.files;
      _this.reads(file[0]);
      this.file = file[0];
    },
    // 生成预览图
    reads: function(file) {
      var _this = this;
      //定义一个文件阅读器
      var FileName = file.name;
      console.log(FileName);
      var reader = new FileReader();

      //文件装载后将其显示在图片预览里
      reader.onload = function(e) {
        //将bade64位图片保存至数组里供上面图片显示
        _this.unit.loadingImage = reader.result;
      };
      _this.loadingImage = reader.result;
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style>
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
  width: 190px;
  height: 190px;
  line-height: 190px;
  text-align: center;
}
.avatar {
  width: 190px;
  height: 190px;
  display: block;
}
.avatar-uploader-icon-cover {
  font-size: 28px;
  color: #8c939d;
  width: 600px;
  height: 352px;
  line-height: 352px;
  text-align: center;
}
.avatar-cover {
  width: 600px;
  height: 352px;
  display: block;
}
.setInput {
    width:600px;
}
</style>