<template>
  <div class="fillContainer">
    <el-form :inline="true" ref="add_data" :medel="searchData">
      <!-- 筛选 -->
      <el-form-item label="按照时间筛选：">
        <el-date-picker v-model="searchData.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
        --
        <el-date-picker v-model="searchData.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" icon="search" @click="handleSearch" style="margin-left:10px;">筛选</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="primary" size="small" icon="view" @click="handleAdd" v-if="user.identity == 'manager'">添加</el-button>
      </el-form-item>
    </el-form>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%" max-height="450" border>
        <el-table-column type="index" label="序号" align="center" width="70"></el-table-column>
        <el-table-column prop="date" label="创建时间" width="250" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" width="150"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" width="170">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="220"></el-table-column>
        <el-table-column label="操作" align="center" width="320"  v-if="user.identity == 'manager'">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              icon="edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="delete"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
</template>
<script>
import Dialog from "../components/Dialog";
export default {
  name: "fundList",
  components: {
    Dialog
  },
  data() {
    return {
      searchData:{//筛选时间
        startTime:"",
        endTime:""
      },
      filterTableData:[],//筛选后的表数据
      paginations: {
        page_index: 1, //当前页
        total: 0, //总记录数
        page_size: 5, //页大小
        page_sizes: [5, 10, 15, 20],
        layout: "total, sizes, prev, pager, next, jumper" //翻页属性
      },
      allTableData: [],
      tableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      }
    };
  },
  computed: {
    user(){
      return this.$store.getters.user;
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    //刷新页面
    getProfile() {
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.allTableData = res.data;
          this.filterTableData = res.data;
          this.setPaginations();
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    },
    //获取分页数据
    setPaginations() {
      //分页属性设置 条数
      this.paginations.total = this.allTableData.length;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((iten, index) => {
        return index < this.paginations.page_size;
      });
    },
    //改变每页大小
    handleSizeChange(size) {
      this.paginations.page_size = size;
      this.tableData = this.allTableData.filter((iten, index) => {
        return index < size;
      });
    },
    //改变页码
    handleCurrentChange(page) {
      // 获取当前页
      let index = this.paginations.page_size * (page - 1);
      // 数据总数
      let nums = this.paginations.page_size * page;
      // tables容器
      let tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    // 编辑
    handleEdit(index, row) {
      // console.log(row);
      this.dialog = {
        title: "修改资金信息",
        show: true,
        option: "edit"
      };
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    // 删除
    handleDelete(index, row) {
      console.log(index, row);
      this.$axios
        .delete(`/api/profiles/delete/${row._id}`)
        .then(res => {
          this.$message({
            message: `数据删除成功`,
            type: "success"
          });
          this.getProfile();
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "error"
          });
        });
    },
    // 添加
    handleAdd() {
      this.dialog = {
        title: "添加资金信息",
        show: true,
        option: "add"
      };
    },
    // 筛选
    handleSearch() {
      if(!this.searchData.startTime || !this.searchData.startTime){
        this.$message({
          type: "warning",
          message: "请选择时间区间"
        })
        return;
      }
      // console.log(this.searchData);
      const sTime = this.searchData.startTime.getTime();
      const eTime = this.searchData.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        // console.log(item);
        let date = new Date(item.date);
        let time = date.getTime();
        return (time >= sTime && time <= eTime);   
      })
      this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>