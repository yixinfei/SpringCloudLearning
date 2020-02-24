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
                姓名：
                <el-input
                  v-model="queryinfo.name"
                  placeholder="请输入姓名"
                  style="width:200px; heght:30px;"
                  size="mini"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="getUserList()"
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
            <el-table-column prop="name" label="姓名">
              <!-- <template slot-scope="scope">
              <el-button
                @click="handleSelect(scope.$index,scope.row)"
                type="text"
                size="small"
              >{{scope.row.userName}}</el-button>
              </template>-->
            </el-table-column>
            <el-table-column prop="account" label="登录名"></el-table-column>
            <el-table-column prop="roleName" label="角色"></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column prop="email" label="邮件"></el-table-column>
            <el-table-column prop="sex" label="性别" :formatter="formatSex" sortable></el-table-column>
            <el-table-column label="用户状态">
              <!-- :formatter="formatState"  == '1' ?true:false-->
              <template slot-scope="scope">
                <el-switch
                  active-value="1"
                  inactive-value="0"
                  @change="userStatus(scope.$index,scope.row)"
                  v-model="scope.row.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="handleRole(scope.$index,scope.row)"
                >角色</el-button>
                <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="resetPassword(scope.$index,scope.row)"
                >重置密码</el-button>
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
            :total="total"
          ></el-pagination>
        </template>
      </div>
    </div>

    <!--新增界面-->
    <el-dialog
      title="新增"
      width="400px"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="登录密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="addForm.oldPassword"
            auto-complete="off"
            placeholder="请输入登陆密码"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="重复密码" prop="passwordAgain">
          <el-input
            type="password"
            v-model="addForm.passwordAgain"
            auto-complete="off"
            placeholder="请输入重复密码"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item label="手机" prop="phone">
          <el-input type="‘number’" v-model="addForm.phone" auto-complete="off" placeholder="请输入手机"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="邮件" prop="email">
          <el-input v-model="addForm.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--选择角色界面-->
    <el-dialog
      title="角色"
      width="400px"
      :visible.sync="editRoleFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editRoleForm" label-width="80px" ref="editRoleForm">
        <el-form-item label="角色">
          <el-select v-model="editRoleForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in editRoleForm.rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleFormVisible = false">取消</el-button>
        <el-button type="primary" @click="eddRoleSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--修改界面-->
    <el-dialog
      title="修改"
      width="400px"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="账号" prop="account">
          <el-input v-model="editForm.account" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="editForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item label="手机" prop="phone">
          <el-input
            type="‘number’"
            v-model="editForm.phone"
            auto-complete="off"
            placeholder="请输入手机"
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item label="邮件" prop="email">
          <el-input v-model="editForm.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { encrypt } from "@/assets/js/cryptoJS";
export default {
  data() {
    var validatePassworAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm.oldPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //请求参数
      queryinfo: {
        name: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      tableData: [],
      //批量选中data
      selectList: [],
      aa: "true",
      deleteListId: [],
      //新增页面
      addFormVisible: false,
      addForm: {
        name: "",
        account: "",
        oldPassword: "",
        password: "",
        passwordAgain: "",
        phone: "",
        email: "",
        sex: "1"
      },
      addFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 5, message: "姓名在1-5个字符之间", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 10, message: "账号在1-10个字符之间", trigger: "blur" }
        ],
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, max: 15, message: "密码在1-15个字符之间", trigger: "blur" }
        ],
        passwordAgain: [{ validator: validatePassworAgain, trigger: "blur" }],
        email: [
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        phone: [
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的电话号码",
            trigger: "blur"
          }
        ]
      },
      //修改角色
      editRoleFormVisible: false,
      editRoleForm: { roleId: "", userId: "", rolesList: [] },

      //修改信息
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 5, message: "姓名在1-5个字符之间", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 1, max: 10, message: "账号在1-10个字符之间", trigger: "blur" }
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        phone: [
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确的电话号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    this.getUserList();
  },
  methods: {
    //获取数据
    async getUserList() {
      const res = await this.$http.get("users", {
        params: this.queryinfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.tableData = res.data.datas;
      this.total = res.data.totalpage;
      this.pagenum = res.data.pagenum;
    },
    //改变显示条数
    handleSizeChange(val) {
      this.queryinfo.pagesize = val;
      this.queryinfo.pagenum = 1;
      this.getUserList();
    },
    //页数跳转
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getUserList();
    },
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 2 ? "女" : "未知";
    },
    //修改用户状态
    async userStatus(index, data) {
      const res = await this.$http.put(`users/${data.id}/state/${data.status}`);
      console.log(res);
      const {
        meta: { status, msg }
      } = res;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
        this.tableData[index].state = !this.tableData[index].state;
      }
    },
    handleSelectionChange(val) {
      this.deleteListId = val.map(item => {
        return item.id;
      });
    },
    //打开添加数据
    handleAdd() {
      this.addFormVisible = true;
    },
    //提交数据
    addSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false;
        }
        this.addForm.password = encrypt(this.addForm.password);
        //获取参数
        const res = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$message.success(res.meta.msg);

        //重置信息
        this.$refs.addForm.resetFields();
        this.addFormVisible = false;
        this.getUserList();
      });
    },
    //删除数据
    handleDeleteList() {
      if (this.deleteListId.length == 0) {
        this.$message.error("请选择要删除的数据");
        return;
      }
      this.$confirm("确认删除吗？", "提示", {})
        .then(async () => {
          const res = await this.$http.delete("users", {
            data: { ids: this.deleteListId }
          });
          console.log(res);
          if (res.meta.status !== 204) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
          this.getUserList();
        })
        .catch(() => {});
    },
    //重置密码
    resetPassword(index, row) {
      this.$confirm("是否密码重置为123456？", "提示", {})
        .then(async () => {
          const res = await this.$http.put(`users/${row.id}/password`, {
            password: encrypt("123456")
          });
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
        })
        .catch(() => {});
    },
    //打开角色
    async handleRole(index, row) {
      console.log("谁", row);
      this.editRoleFormVisible = true;
      const res = await this.$http.get("roles/list");
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.editRoleForm.roleId = row.roleId;
      this.editRoleForm.userId = row.id;
      this.editRoleForm.rolesList = res.data.datas;
    },
    //修改角色
    async eddRoleSubmit() {
      const res = await this.$http.put(
        `users/${this.editRoleForm.userId}/role/${this.editRoleForm.roleId}`
      );
      console.log("heh", res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.$message.success(res.meta.msg);
      this.editRoleFormVisible = false;
      this.getUserList();
    },

    //打开修改用户
    handleEdit(index, row) {
      this.editForm = row;
      this.editFormVisible = true;
    },
    editSubmit(){
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false;
        const res =await this.$http.put("users",this.editForm);
        if(res.meta.status !== 200){
          this.$message.error(res.meta.msg);
          return ;
        }
        this.$refs.editForm.resetFields();
        this.editFormVisible = false
        this.getUserList()
      })
    }
  }
};
</script>

<style>
</style>