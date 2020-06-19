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
                  v-model="queryinfo.mc"
                  placeholder="请输入姓名"
                  style="width:200px; heght:30px;"
                  size="mini"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                警号：
                <el-input
                  v-model="queryinfo.mc"
                  placeholder="请输入警号"
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
            <el-table-column prop="mc" label="姓名"></el-table-column>
            <el-table-column prop="xb" label="性别"></el-table-column>
            <el-table-column prop="mz" label="民族"></el-table-column>
            <el-table-column prop="jh" label="警号"></el-table-column>
            <el-table-column prop="ssdw" label="所属单位"></el-table-column>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.mc" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="性别" prop="xb">
          <template>
            <el-radio v-model="addForm.xb" label="1">男</el-radio>
            <el-radio v-model="addForm.xb" label="2">女</el-radio>
          </template>
        </el-form-item>
        <br />
        <el-form-item label="民族" prop="name" style="width:100%">
          <el-select v-model="addForm.mz" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="警号" prop="name">
          <el-input v-model="addForm.mc" auto-complete="off" placeholder="请输入警号"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="所属单位" prop="name">
          <el-input v-model="addForm.mc" auto-complete="off" placeholder="请输入所属单位"></el-input>
        </el-form-item>
        <br />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取消</el-button>
        <el-button type="primary" @click="addSubmit">提交</el-button>
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
        mz: "",
        xb: "1"
      },
      file: "",
      fileList: [],
      progressFlag:"",
      progressPercent: 0,
      options: [{
          value: '01',
          label: '汉族'
        }, {
          value: '02',
          label: '蒙古族'
        }],
    }
  },
  computed: {},
  mounted() {
   
  },
  methods: {
     //打开添加数据
    handleAdd() {
      //if (this.$store.getters.getRole("roles", "post")) return;

      this.addFormVisible = true;
    },
  }
};
</script>

<style>
</style>