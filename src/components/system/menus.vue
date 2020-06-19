<template>
  <section>
    <div class="table">
      <!-- 页面表格begin -->
      <div class="container">
        <!-- 页面内容区begin -->
        <div class="handle-box">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-tree
                :data="treeMenusListAll"
                node-key="id"
                :expand-on-click-node="false"
                default-expand-all
                :props="defaultProps"
                @node-click="handleNodeClick"
                highlight-current
              ></el-tree>
            </el-col>
            <el-col :span="20">
              <div class="handle-box">
                <!-- 搜索区begin -->
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                  <el-form :inline="true" :model="queryinfo">
                    <el-form-item>
                      菜单名称：
                      <el-input
                        v-model="queryinfo.title"
                        placeholder="请输入菜单名称"
                        style="width:200px; heght:30px;"
                        size="mini"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      菜单层级：
                      <el-input
                        v-model="queryinfo.levels"
                        placeholder="请输入菜单层级"
                        style="width:200px; heght:30px;"
                        size="mini"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click="getMenuList()"
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

              <template>
                <!--表格数据及操作-->
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  size="mini"
                  highlight-current-row
                  border
                  class="el-tb-edit mgt20"
                >
                  <!--索引-->
                  <el-table-column type="index" label="序号" sortable></el-table-column>
                  <el-table-column prop="title" label="菜单名称"></el-table-column>
                  <el-table-column prop="pidTitle" label="上级菜单名称"></el-table-column>
                  <el-table-column prop="isMenu" label="是否是菜单" :formatter="formatIsMenu"></el-table-column>
                  <el-table-column prop="levels" label="层级"></el-table-column>
                  <el-table-column prop="sort" label="排序"></el-table-column>
                  <el-table-column prop="index" label="请求地址"></el-table-column>
                  <el-table-column prop="req" label="请求方式"></el-table-column>
                  <el-table-column prop="vueSuperior" label="菜单前置路径"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        plain
                        size="small"
                        @click="handleEdit(scope.$index,scope.row)"
                      >编辑</el-button>
                      <el-button
                        type="danger"
                        plain
                        size="small"
                        @click="handleDelete(scope.$index,scope.row)"
                      >删除</el-button>
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
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!--新增界面-->
    <el-dialog title="新增" width="500px" :visible.sync="addFormVisible" :before-close="addCancel">
      <el-form :model="addForm" label-width="90px" :rules="FormRules" ref="addForm">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="addForm.title" auto-complete="off" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="index">
          <el-input
            v-model="addForm.index"
            auto-complete="off"
            placeholder="菜单为单路径（menus），权限可多路径（menus/id)"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否是菜单" prop="isMenu">
          <el-radio-group v-model="addForm.isMenu">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="pid">
          <el-row>
            <el-col :span="10">
              <el-input
                v-model="addForm.pidTitle"
                disabled
                auto-complete="off"
                placeholder="请选择上级菜单"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-input v-model="addForm.pid" disabled auto-complete="off" placeholder="请选择上级菜单"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" plain @click="addPidSelect">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="addForm.isMenu == 1" label="序号" prop="sort">
          <el-input type="number" v-model="addForm.sort" auto-complete="off" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.isMenu == 1" label="前置路径" prop="vueSuperior">
          <el-input
            v-model="addForm.vueSuperior"
            auto-complete="off"
            placeholder="请输入components目录下到存放.vue的目录"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.isMenu == 1" label="图标" prop="icon" disabled>
          <el-input v-model="addForm.icon" auto-complete="off" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item v-if="addForm.isMenu == 0" label="请求方式" prop="req">
          <el-radio-group v-model="addForm.req">
            <el-radio label="get"></el-radio>
            <el-radio label="post"></el-radio>
            <el-radio label="put"></el-radio>
            <el-radio label="delete"></el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
      </div>
      <el-dialog width="30%" title="内层 Dialog" :visible.sync="addInnerVisible" append-to-body>
        <el-tree
          :data="treeMenusListAllSelect"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          :props="defaultProps"
          @node-click="addInnerNodeClick"
          highlight-current
        ></el-tree>
      </el-dialog>
    </el-dialog>

    <!--修改界面-->
    <el-dialog title="修改" width="500px" :visible.sync="editFormVisible" :before-close="editCancel">
      <el-form :model="editForm" label-width="90px" :rules="FormRules" ref="editForm">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="editForm.title" auto-complete="off" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="index">
          <el-input
            v-model="editForm.index"
            auto-complete="off"
            placeholder="菜单为单路径（menus），权限可多路径（menus/id)"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否是菜单" prop="isMenu">
          <el-radio-group v-model="editForm.isMenu">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="pid">
          <el-row>
            <el-col :span="10">
              <el-input
                v-model="editForm.pidTitle"
                disabled
                auto-complete="off"
                placeholder="请选择上级菜单"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-input v-model="editForm.pid" disabled auto-complete="off" placeholder="请选择上级菜单"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" plain @click="editPidSelect">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="editForm.isMenu == 1" label="序号" prop="sort">
          <el-input type="number" v-model="editForm.sort" auto-complete="off" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item v-if="editForm.isMenu == 1" label="前置路径" prop="vueSuperior">
          <el-input
            v-model="editForm.vueSuperior"
            auto-complete="off"
            placeholder="请输入components目录下到存放.vue的目录"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="editForm.isMenu == 1" label="图标" prop="icon" disabled>
          <el-input v-model="editForm.icon" auto-complete="off" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item v-if="editForm.isMenu == 0" label="请求方式" prop="req">
          <el-radio-group v-model="editForm.req">
            <el-radio label="get"></el-radio>
            <el-radio label="post"></el-radio>
            <el-radio label="put"></el-radio>
            <el-radio label="delete"></el-radio>
          </el-radio-group>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </div>
      <el-dialog width="30%" title="内层 Dialog" :visible.sync="editInnerVisible" append-to-body>
        <el-tree
          :data="treeMenusListAllSelect"
          node-key="id"
          :expand-on-click-node="false"
          default-expand-all
          :props="defaultProps"
          @node-click="editInnerNodeClick"
          highlight-current
        ></el-tree>
      </el-dialog>
    </el-dialog>
  </section>
</template>

<script>
const TOPMENU = "顶级菜单";
export default {
  data() {
    var validateSort = (rule, value, callback) => {
      if (rule.isMenu == "1") {
        if (rule.sort == "") {
          callback(new Error("请输入序号"));
        }
      }
      callback();
    };
    var validateIndex = (rule, value, callback) => {
      if (rule.isMenu == "1") {
        var regu = /^((?!\/).)*$/;
        var re = new RegExp(regu);
        if (!re.test(rule.index)) {
          callback(new Error("菜单为单路径（menus)"));
        }
      }
      callback();
    };
    var validateVueSuperior = (rule, value, callback) => {
      if (rule.isMenu == "1") {
        if (rule.levels == "1" && rule.vueSuperior == "") {
          callback(new Error("请输入前置路径"));
        }
      }
      callback();
    };
    var validateReq = (rule, value, callback) => {
      if (rule.isMenu == "0") {
        if (rule.req == "") {
          callback(new Error("请选择请求方式"));
        }
      }
      callback();
    };
    var validatePid = (rule, value, callback) => {
      if (rule.isMenu == "0") {
        if (rule.levels !== 2) {
          callback(new Error("是权限请选择第二层菜单"));
        }
      } else if (rule.isMenu == "1") {
        if (rule.levels !== 0 || rule.levels !== 1) {
          callback(new Error("是菜单请选择顶层和一级菜单"));
        }
      }
      callback();
    };
    return {
      //左侧菜单数据
      treeMenusListAll: [],

      defaultProps: {
        children: "subs",
        label: "title"
      },
      //请求参数
      queryinfo: {
        id: "",
        title: "",
        levels: "",
        pagenum: 1,
        pagesize: 10
      },
      totalpage: 0,
      tableData: [],
      //批量选中data
      selectList: [],
      addFormVisible: false,
      addForm: {
        index: "",
        title: "",
        isMenu: "1",
        sort: "",
        req: "get",
        levels: "",
        vueSuperior: "",
        icon: "",
        pid: "",
        pidTitle: ""
      },
      addInnerVisible: false,
      FormRules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "菜单名称在1-10个字符之间",
            trigger: "blur"
          }
        ],
        index: [
          { required: true, message: "请输入路径", trigger: "blur" },
          { min: 1, max: 50, message: "路径在1-50个字符之间", trigger: "blur" },
          {
            validator: validateIndex,
            trigger: "blur"
          }
        ],
        vueSuperior: [
          { validator: validateVueSuperior, trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "前置路径在1-50个字符之间",
            trigger: "blur"
          }
        ],
        pid: [
          { validator: validatePid, trigger: "blur" },
          { required: true, message: "请选择上级菜单", trigger: "blur" }
        ],
        sort: [{ validator: validateSort, trigger: "blur" }],
        req: [{ validator: validateReq, trigger: "blur" }]
      },
      editFormVisible: false,
      editForm: {
        id: "",
        index: "",
        title: "",
        isMenu: "1",
        sort: "",
        req: "get",
        levels: "",
        vueSuperior: "",
        icon: "",
        pid: "",
        pidTitle: ""
      },
      editInnerVisible: false
    };
  },
  computed: {
    //菜单选择新增或修改时候用
    treeMenusListAllSelect() {
      return [
        {
          id: "0",
          subs: this.treeMenusListAll,
          title: TOPMENU,
          levels: "0"
        }
      ];
    }
  },
  mounted() {
    this.getTreeMenusListAll();
    this.getMenuList();
    console.log(this.treeMenusListAll);
  },
  methods: {
    //获取左侧树状图数据
    async getTreeMenusListAll() {
      const res = await this.$http.get("menus/treeListAll");
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
      }

      this.treeMenusListAll = res.data;
      console.log(this.treeMenusListAll);
    },
    //选中节点查询数据
    handleNodeClick(data) {
      this.queryinfo.id = data.id;
      this.getMenuList();
    },
    //菜单列表
    async getMenuList() {
      if (this.$store.getters.getRole("menus", "get")) return;
      const res = await this.$http.get("menus", { params: this.queryinfo });
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      console.log("呵呵", res);
      this.tableData = res.data.datas;
      this.totalpage = res.data.totalpage;
      this.queryinfo.pagenum = res.data.pagenum;
    },
    //改变显示条数
    handleSizeChange(val) {
      this.queryinfo.pagesize = val;
      this.queryinfo.pagenum = 1;
      this.getMenuList();
    },
    //页数跳转
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getMenuList();
    },
    formatIsMenu(row, column) {
      return row.isMenu == 1 ? "是" : row.isMenu == 0 ? "否" : "未知";
    },

    //新增
    handleAdd() {
      if (this.$store.getters.getRole("menus", "post")) return;
      this.addFormVisible = true;
      //默认给个图标
      this.addForm.icon = 'el-icon-link'
    },
    addCancel() {
      this.addForm = { isMenu: "1", req: "get" };
      this.addFormVisible = false;
      this.$refs.addForm.resetFields();
    },
    //打开选择上级菜单
    addPidSelect() {
      this.addInnerVisible = true;
    },
    //选择上级菜单后进行添加
    addInnerNodeClick(data) {
      console.log(data);
      if (this.addForm.isMenu == "1") {
        if (data.levels != "1" && data.levels != "0") {
          this.$message.error("菜单只能设置为两层");
          return;
        }
      } else {
        if (data.levels != "2") {
          this.$message.error("权限只能设置在第二层菜单内");
          return;
        }
      }
      this.addForm.pid = data.id;
      this.addForm.pidTitle = data.title;
      this.addForm.levels = parseInt(data.levels) + 1;
      this.addInnerVisible = false;
    },
    addSubmit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return;
        }
        if (this.addForm.isMenu === "1") {
          this.addForm.req = "";
        } else {
          this.addForm.vueSuperior = "";
          this.addForm.icon = "";
          this.addForm.sort = "";
        }
        const res = await this.$http.post("menus", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$refs.addForm.resetFields();
        this.$message.success(res.meta.msg);
        this.addFormVisible = false;
        this.getTreeMenusListAll();
        this.getMenuList();
        this.addForm.req = "get";
        this.addForm.pidTitle = "";
      });
    },
    //删除
    async handleDelete(index, row) {
      if (this.$store.getters.getRole("menus", "delete")) return;
      this.$confirm("确认删除吗？", "提示", {})
        .then(async () => {
          const res = await this.$http.delete(`menus/${row.id}`);
          if (res.meta.status !== 204) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
          this.getMenuList();
          this.getTreeMenusListAll();
        })
        .catch(() => {});
    },
    handleEdit(index, row) {
      if (this.$store.getters.getRole("menus", "put")) return;
      this.editFormVisible = true;
      if (row.pid == "0") {
        row.pidTitle = TOPMENU;
      }
      this.editForm = JSON.parse(JSON.stringify(row));
    },
    editCancel() {
      this.editForm = { isMenu: "1", req: "get" };
      this.editFormVisible = false;
      this.$refs.editForm.resetFields();
    },
    //打开选择上级菜单
    editPidSelect() {
      this.editInnerVisible = true;
    },
    //选择上级菜单后进行添加
    editInnerNodeClick(data) {
      console.log(data);
      if (this.editForm.isMenu == "1") {
        if (data.levels != "1" && data.levels != "0") {
          this.$message.error("菜单只能设置为两层");
          return;
        }
      } else {
        if (data.levels != "2") {
          this.$message.error("权限只能设置在第二层菜单内");
          return;
        }
      }
      this.editForm.pid = data.id;
      this.editForm.pidTitle = data.title;
      this.editForm.levels = parseInt(data.levels) + 1;
      this.editInnerVisible = false;
    },
    editSubmit() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return;
        }
        if (this.editForm.isMenu === "1") {
          this.editForm.req = "";
        } else {
          this.editForm.vueSuperior = "";
          this.editForm.icon = "";
          this.editForm.sort = "";
        }
        const res = await this.$http.put("menus", this.editForm);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
          return;
        }
        this.$refs.editForm.resetFields();
        this.$message.success(res.meta.msg);
        this.editFormVisible = false;
        this.getTreeMenusListAll();
        this.getMenuList();
        this.editForm.req = "get";
      });
    },
    changeMenu() {
      if (this.editForm.isMenu == "0") {
        this.editForm.req = "get";
      }
    }
  }
};
</script>
