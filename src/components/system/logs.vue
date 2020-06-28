<template>
  <section>
    <div class="table">
      <!-- 页面表格begin -->
      <div id="table" class="container">
        <!-- 页面内容区begin -->
        <div class="handle-box">
          <!-- 搜索区begin -->
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="queryinfo">
              <el-form-item>
                用户名：
                <el-input
                  v-model="queryinfo.name"
                  placeholder="请输入用户名"
                  style="width:200px;"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                起止时间：
                <el-date-picker
                  v-model="queryinfo.starStopTime"
                  type="daterange"
                  align="left"
                  unlink-panels
                  style="width:250px; "
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                日志类型：
                <el-select clearable v-model="queryinfo.type" placeholder="请选择">
                  <el-option label="操作日志" value="0"></el-option>
                  <el-option label="错误日志" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getLogList">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" icon="el-icon-search" @click="deleteLog">清除日志</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </div>

        <template>
          <!--表格数据及操作-->
          <el-table
            ref="multipleTable"
            :data="tableData"
            highlight-current-row
            border
            class="el-tb-edit mgt20"
            :max-height="table.maxHeight"
          >
            <!--索引-->
            <el-table-column type="index" label=""></el-table-column>
            <el-table-column prop="userName" label="操作人"></el-table-column>
            <el-table-column prop="describes" label="具体操作"></el-table-column>
            <el-table-column prop="type" :formatter="formatType" label="日志类型"></el-table-column>
            <el-table-column prop="errorCode" label="错误类型"></el-table-column>
            <el-table-column prop="ip" label="ip"></el-table-column>
            <el-table-column prop="createTime" label="时间" sortable></el-table-column>
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
  </section>
</template>

<script>
function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
export default {
  data() {
    return {
      //请求参数
      queryinfo: {
        pagenum: 1,
        pagesize: 10,
        name: "",
        starStopTime: "",
        type: ""
      },
      table: {
        maxHeight: 0
      },
      totalpage: 0,
      tableData: [],
      //批量选中data
      selectList: [],
      deleteListId: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              let end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              end = dateFormat("YYYY-mm-dd", end);
              start = dateFormat("YYYY-mm-dd", start);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              let end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              end = dateFormat("YYYY-mm-dd", end);
              start = dateFormat("YYYY-mm-dd", start);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              let end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              end = dateFormat("YYYY-mm-dd", end);
              start = dateFormat("YYYY-mm-dd", start);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {
    this.getLogList();
  },
  methods: {
    //性别显示转换
    formatType: function(row, column) {
      return row.type == "0"
        ? "登陆日志"
        : row.type == "1"
        ? "错误日志"
        : "未知";
    },
    //改变显示条数
    handleSizeChange(val) {
      this.queryinfo.pagesize = val;
      this.queryinfo.pagenum = 1;
      this.getLogList();
    },
    //页数跳转
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getLogList();
    },

    async getLogList() {
      if (this.$store.getters.getRole("logs", "get")) return;
      const res = await this.$http.get("logs", { params: this.queryinfo });
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return;
      }
      console.log(res);
      this.tableData = res.data.datas;
      this.totalpage = res.data.totalpage;
      this.queryinfo.pagenum = res.data.pagenum;
      this.table = this.$store.getters.table;
    },
    async deleteLog() {
      if (this.$store.getters.getRole("logs", "delete")) return;
      this.$confirm("确认删除全部日志吗？", "提示", {})
        .then(async () => {
          const res = await this.$http.delete("logs");
          if (res.meta.status !== 204) {
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success(res.meta.msg);
          this.getLogList();
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
</style>