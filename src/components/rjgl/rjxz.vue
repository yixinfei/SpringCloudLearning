<template>
  <section>
    <div class="table">
      <!-- 页面表格begin -->
      <div class="container">
        <!-- 页面内容区begin -->
        <div class="handle-box">
          <!-- 搜索区begin -->
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="queryinfo">
              <el-form-item>
                软件名称：
                <el-input
                  v-model="queryinfo.mc"
                  placeholder="请输入软件名称"
                  style="width:200px; heght:30px;"
                  size="mini"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="getRjxzList()"
                  size="mini"
                >搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </div>
        <!-- 搜索区end -->
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
          size="mini"
          round
        >新增</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="handleDeleteList"
          size="mini"
          round
        >删除</el-button>

        <template>
          <!--表格数据及操作-->
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :data="tableData"
            size="mini"
            highlight-current-row
            border
            class="el-tb-edit mgt20"
          >
            <!--勾选框-->
            <el-table-column type="selection" width="40"></el-table-column>
            <!--索引-->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="mc" label="软件名称"></el-table-column>
            <el-table-column prop="lj" label="软件路径"></el-table-column>
            <el-table-column prop="wjdx" label="软件大小"></el-table-column>
            <el-table-column prop="xq" label="软件描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="handleEdit(scope.$index,scope.row)"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalpage"
          ></el-pagination>
        </template>
      </div>
    </div>

    <!--新增界面-->
    <el-dialog title="新增" width="400px" :visible.sync="addFormVisible" :before-close="addCancel">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="软件名称" prop="name">
          <el-input v-model="addForm.mc" auto-complete="off" placeholder="请输入软件名称"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="描述" prop="describes">
          <el-input v-model="addForm.xq" auto-complete="off" placeholder="请输入描述"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="描述" prop="describes">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :http-request="addSubmit"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            
          </el-upload>
          <div v-show="progressFlag" class="head-img">
              <el-progress  :percentage="progressPercent"></el-progress>
            </div>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--修改界面-->
    <el-dialog title="修改" width="400px" :visible.sync="editFormVisible" :before-close="editCancel">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="软件名称" prop="mc">
          <el-input v-model="editForm.mc" auto-complete="off" placeholder="请输入软件名称"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="描述" prop="xq">
          <el-input v-model="editForm.xq" auto-complete="off" placeholder="请输入软件描述"></el-input>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      //请求参数
      queryinfo: {
        mc: "",
        pagenum: 1,
        pagesize: 10
      },
      totalpage: 0,
      tableData: [],
      //批量选中data
      selectList: [],
      deleteListId: [],
      //新增页面
      addFormVisible: false,
      addForm: {
        mc: "",
        xq: ""
      },
      file: "",
      fileList: [],
      progressFlag:"",
      progressPercent: 0,
      addFormRules: {
        mc: [
          { required: true, message: "请输入软件名称", trigger: "blur" },
          {
            min: 1,
            max: 5,
            message: "软件名称在1-10个字符之间",
            trigger: "blur"
          }
        ],
        xq: [
          { min: 1, max: 10, message: "描述在1-100个字符之间", trigger: "blur" }
        ]
      },
      //修改信息
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        mc: [
          { required: true, message: "请输入软件名称", trigger: "blur" },
          {
            min: 1,
            max: 5,
            message: "软件名称在1-10个字符之间",
            trigger: "blur"
          }
        ],
        xq: [
          { min: 1, max: 10, message: "描述在1-100个字符之间", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    this.getRjxzList();
  },
  methods: {
    //获取数据
    async getRjxzList() {
      //  if (this.$store.getters.getRole("rjgl", "get")) return;
      const res = await this.$http.get("rjgl", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.tableData = res.data.datas;
      this.totalpage = res.data.totalpage;
      this.pagenum = res.data.pagenum;
    },
    //改变显示条数
    handleSizeChange(val) {
      this.queryinfo.pagesize = val;
      this.queryinfo.pagenum = 1;
      this.getRjxzList();
    },
    //页数跳转
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getRjxzList();
    },
    handleSelectionChange(val) {
      this.deleteListId = val.map(item => {
        return item.id;
      });
    },
    //打开添加数据
    handleAdd() {
      //if (this.$store.getters.getRole("roles", "post")) return;

      this.addFormVisible = true;
    },
    addCancel() {
      (this.addFormVisible = false), this.$refs.addForm.resetFields();
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handleChange(file) {
      this.file = file.raw;
    },
    beforeUpload(f) {
      console.log("h1ehe", f);
    },
    //提交数据
    addSubmit() {
      console.log("hehe", this.file);
      this.progressFlag = true;
      this.$http({
        url: "/rjgl",
        method: "post",
        data: { rj: this.file, mc: this.addForm.mc, xq: this.addForm.xq },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent =
            parseInt((progressEvent.loaded / progressEvent.total) * 100);
        }
      })
        .then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
          this.addForm ={}
          this.addFormVisible = false
          this.file =""
          this.fileList =[]
          if (this.progressPercent === 100) {
            this.progressFlag = false;
            this.progressPercent = 0;
          }
          this.getRjxzList()
          this.$refs.upload.clearFiles()
        })
        .then(error => {
          console.log(error);
        });
    },
    //删除数据
    handleDeleteList() {
    //  if (this.$store.getters.getRole("roles", "delete")) return;

      if (this.deleteListId.length == 0) {
        this.$message.error("请选择要删除的数据");
        return;
      }
      this.$confirm("确认删除吗？", "提示", {})
        .then(async () => {
          const res = await this.$http.delete("rjgl", {
            data: { ids: this.deleteListId }
          });
          console.log(res);
          if (res.meta.status !== 204) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
          this.getRjxzList();
        })
        .catch(() => {});
    },

    //打开修改用户
    handleEdit(index, row) {
     // if (this.$store.getters.getRole("roles", "put")) return;

      this.editForm = JSON.parse(JSON.stringify(row));
      console.log(this.editForm)
      this.editFormVisible = true;
    },
    editCancel() {
      this.editFormVisible = false;
      this.editSubmit = {};
    },
    editSubmit() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false;
        const res = await this.$http.put("rjgl", this.editForm);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$refs.editForm.resetFields();
        this.editFormVisible = false;
        this.getRjxzList();
      });
    },
    editRoleCancel() {
      this.editRoleVisible = false;
    },
  }
};
</script>

<style>
</style>