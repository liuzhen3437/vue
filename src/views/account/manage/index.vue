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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>
        <!-- <el-table-column label="工作组名称" align="center">
          <template slot-scope="scope">{{scope.row.groupName}}</template>
        </el-table-column> -->
        <el-table-column label=" 头像" align="center">
          <template slot-scope="scope">
					<img width="100%" :src="scope.row.icon" alt=""></template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickName}}</template>
        </el-table-column>
        <el-table-column label="账户类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type==0">管理员</span>
            <span v-if="scope.row.type==1">查看员</span>
            <span v-if="scope.row.type==2">超级管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
						<el-button
						  size="mini"
						  @click="resetPassword(scope.$index, scope.row)">重置密码
						</el-button>
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

import {fetchList, deleteBatch , deleteLine,resetPassword} from '@/api/account/manage'


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
				if(to.path==='/account/manage'){
					this.getList();
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
        this.$router.push({path: '/account/manage/manage/update', query: {id: row.id}})
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
        this.$router.push({path: '/account/manage/manage/add'})
      },
			resetPassword(index, row){
				this.$confirm('是否要重置该成员密码', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  resetPassword(row.id).then(response => {
				    this.$message({
				      message: '重置成功',
				      type: 'success',
				      duration: 1000
				    });
				    // this.getList();
				  });
				});
			}
    }
  }
</script>
