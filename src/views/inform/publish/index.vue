<template> 
<div>
  <div class="app-container" v-show='$route.meta.showRole'>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAdd()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <!-- <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
		<el-table-column label="序号" width="100" align="center" type="index">
		
		</el-table-column>
        <!-- <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.adminName}}</template>
        </el-table-column> -->
        <el-table-column label="发布人" align="center">
          <template slot-scope="scope">{{scope.row.adminName}}</template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">{{scope.row.text}}</template>
        </el-table-column>
        <el-table-column label="发布日期" align="center">
          <template slot-scope="scope">{{scope.row.startDateTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="截止日期" align="center">
          <template slot-scope="scope">{{scope.row.endDateTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="通知类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.noticeType==0">管理端通知</span>
            <span v-if="scope.row.noticeType==1">巡检端通知</span>
          </template>
        </el-table-column>
        <el-table-column label="对象类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.targetType==0">公司</span>
            <span v-if="scope.row.targetType==1">人员</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
  <router-view ></router-view>
</div>
</template>

<script>
import {formatDate} from '@/utils/date';
import {fetchList,deleteNotice,deleteBatch} from '@/api/inform/publish'


  export default {
    name: 'lineList',
    data() {
      return {
        operates: [
          {
            label: "批量删除",
            value: "deleteBatch"
          }
        ],
        operateType: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
    },
		watch: {
		    $route(to,from) {
				console.log(to)
				if(to.path==='/inform/publish'){
					this.getList();
				}
			}
		},
    filters: {
      formatCreateTime(time) {

        if(time==null){

        }else{
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }

      }
    },
    methods: {

      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleUpdate(index, row) {
        this.$router.push({path: 'publish/publish/update', query: {id: row.id}})
      },
      handleDelete(index, row) {

        this.$confirm('是否要删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNotice(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });

      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleBatchOperate() {
        console.log(this.multipleSelection);
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === 'deleteBatch') {

          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          let data = new URLSearchParams();
          data.append("ids", ids);
          deleteBatch(data).then(response => {
            this.getList();
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
          });

        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
      },
      handleAdd() {
        this.$router.push({path: 'publish/publish/add'})
      }
    }
  }
</script>
