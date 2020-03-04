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
                角色名称：
                <el-input
                  v-model="queryinfo.name"
                  placeholder="请输入角色名称"
                  style="width:200px; heght:30px;"
                  size="mini"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="getRoleList()"
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
            <el-table-column prop="name" label="角色名称"></el-table-column>
            <el-table-column prop="describes" label="描述"></el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="handleEdit(scope.$index,scope.row)"
                >编辑</el-button>
                <el-button
                  type="warning"
                  plain
                  size="small"
                  @click="handleRole(scope.$index,scope.row)"
                >配置权限</el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="描述" prop="describes">
          <el-input v-model="addForm.describes" auto-complete="off" placeholder="请输入描述"></el-input>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="描述" prop="describes">
          <el-input v-model="editForm.describes" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>

    <!--配置权限-->
    <el-dialog
      title="配置权限"
      width="400px"
      :visible.sync="editRoleVisible"
      :before-close="editRoleCancel"
    >
      <el-tree
        :data="treeMenusListAll"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedTreeList"
        :expand-on-click-node="false"
        default-expand-all
        :props="defaultProps"
        highlight-current
        check-on-click-node
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleCancel">取消</el-button>
        <el-button type="primary" @click="roleSubmit">提交</el-button>
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
        name: "",
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
        name: "",
        describes: ""
      },
      addFormRules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 1,
            max: 5,
            message: "角色名称在1-10个字符之间",
            trigger: "blur"
          }
        ],
        describes: [
          { min: 1, max: 10, message: "描述在1-100个字符之间", trigger: "blur" }
        ]
      },
      //修改信息
      editFormVisible: false,
      editForm: {},
      editFormRules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 1,
            max: 5,
            message: "角色名称在1-10个字符之间",
            trigger: "blur"
          }
        ],
        describes: [
          { min: 1, max: 10, message: "描述在1-100个字符之间", trigger: "blur" }
        ]
      },
      //配置权限
      editRoleVisible: false,
      editRole: {},
      //权限列表数据
      treeMenusListAll: [],
      defaultProps: {
        children: "subs",
        label: "title"
      },
      roleId: "",
      selectedTreeList: []
    };
  },
  computed: {},
  mounted() {
    this.getRoleList();
  },
  methods: {
    //获取数据
    async getRoleList() {
      if (this.$store.getters.getRole("roles", "get")) return;

      const res = await this.$http.get("roles", {
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
      this.getUserList();
    },
    //页数跳转
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getUserList();
    },
    handleSelectionChange(val) {
      this.deleteListId = val.map(item => {
        return item.id;
      });
    },
    //打开添加数据
    handleAdd() {
      if (this.$store.getters.getRole("roles", "post")) return;

      this.addFormVisible = true;
    },
    addCancel() {
      (this.addFormVisible = false), this.$refs.addForm.resetFields();
    },
    //提交数据
    addSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false;
        }
        //获取参数
        const res = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$message.success(res.meta.msg);
        //重置信息
        this.$refs.addForm.resetFields();
        this.addFormVisible = false;
        this.addForm = {};
        this.getRoleList();
      });
    },
    //删除数据
    handleDeleteList() {
      if (this.$store.getters.getRole("roles", "delete")) return;

      if (this.deleteListId.length == 0) {
        this.$message.error("请选择要删除的数据");
        return;
      }
      this.$confirm("确认删除吗？", "提示", {})
        .then(async () => {
          const res = await this.$http.delete("roles", {
            data: { ids: this.deleteListId }
          });
          console.log(res);
          if (res.meta.status !== 204) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
          this.getRoleList();
        })
        .catch(() => {});
    },

    //打开修改用户
    handleEdit(index, row) {
      if (this.$store.getters.getRole("roles", "put")) return;

      this.editForm = JSON.parse(JSON.stringify(row));
      this.editFormVisible = true;
    },
    editCancel() {
      this.editFormVisible = false;
      this.editSubmit = {};
    },
    editSubmit() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false;
        const res = await this.$http.put("roles", this.editForm);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$refs.editForm.resetFields();
        this.editFormVisible = false;
        this.getRoleList();
      });
    },
    //配置权限打开
    handleRole(index, row) {
      if (this.$store.getters.getRole("roles/{id}", "post")) return;

      this.roleId = row.id;
      this.editRoleVisible = true;
      this.getTreeMenusListAll();
    },
    editRoleCancel() {
      this.editRoleVisible = false;
    },
    async getTreeMenusListAll() {
      const res = await this.$http.get(`menus/treeListAll/${this.roleId}`);
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      }
      this.treeMenusListAll = res.data.datas;
      this.selectedTreeList = res.data.selectedMenu;
    },
    async roleSubmit() {
      let keys = this.$refs.tree.getCheckedKeys();
      if (keys.length === 0) {
        this.$message.error("请选择");
        return;
      }
      keys = keys.concat(this.$refs.tree.getHalfCheckedKeys());
      const res = await this.$http.post(`roles/${this.roleId}`, { ids: keys });
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      this.$message.success(res.meta.msg);
      this.editRoleVisible = false;
      this.getRoleList();
    }
  }
};
</script>

<style>
</style>