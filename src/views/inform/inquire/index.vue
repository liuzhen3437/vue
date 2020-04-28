<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column label="Id" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="发布人" align="center">
          <template slot-scope="scope">{{scope.row.adminName}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.seen==0">未读</span>
            <span v-if="scope.row.seen==1">已读</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">{{scope.row.startDateTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">{{scope.row.text}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.seen==0" @click="unread(scope.$index, scope.row)">未查阅通知</span>
            <span v-if="scope.row.seen==1">已查阅通知</span>
          </template>
        </el-table-column>
      </el-table>
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
</template>

<script>

import {fetchList,seen} from '@/api/inform/inquire'
import {formatDate} from '@/utils/date';

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
			unread(index, row){
				//this.$router.push({path: '/setting/line/lineAddress', query: {id: row.id}})
        seen(row.id).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
			},
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
        this.$router.push({path: '/setting/line/update', query: {id: row.id}})
      },
      handleDelete(index, row) {

        this.$confirm('是否要删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLine(row.id).then(response => {
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
        this.$router.push({path: '/setting/line/add'})
      }
    }
  }
</script>
