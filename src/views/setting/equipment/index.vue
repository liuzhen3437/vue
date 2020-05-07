<template> 
  <div>
  <div class="app-container" v-show='$route.meta.showRole'>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
			<!-- <el-button
			  class="btn-add"
			  @click="DotAdd()"
			  size="mini">
			  添加
			</el-button> -->
    </el-card>
    <div class="table-container">
          <el-table ref="addressTable"
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
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="有效期限" align="center" :formatter="timestampToTime" prop="expiry">

            </el-table-column>
						<el-table-column label="描述" align="center">
						  <template slot-scope="scope">{{scope.row.description}}</template>
						</el-table-column>
            <el-table-column label="设备唯一码" align="center">
              <template slot-scope="scope">{{scope.row.number }}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleUpdate(scope.$index, scope.row)">编辑
                </el-button>
								<el-button
								  size="mini"
								  @click="DeleteSingle(scope.$index, scope.row)">删除
								</el-button>
              </template>
            </el-table-column>
          </el-table>
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
  </div>
  <router-view ></router-view>
  </div>
</template>

<script>

 import {deviceEventList,deleteDeviceEvent,deleteDeviceEventBatch} from '@/api/setting/equipment'


  export default {
    name: 'addressList',
    data() {
      return {
        activeName: 'first',

        operates: [
					{
					  label: "批量删除",
					  value: "deleteBatches"
					}
        ],
        operateType: null,
        listQuery: {
          state: 1,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
      }
    },
    created() {
      this.getList();
    },
		watch: {
		    $route(to,from) {
				console.log(to)
				if(to.path==='/setting/equipment'){
					this.getList();
				}
			}
		},
    methods: {
			timestampToTime (row, column) {
         var date = new Date(row.expiry) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
         var Y = date.getFullYear() + '-'
         var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
         var D = date.getDate() + ' '
         var h = date.getHours() + ':'
         var m = date.getMinutes() + ':'
         var s = date.getSeconds()
         // return Y+M+D+h+m+s
				 return Y+M+D

     },
			DotAdd(){
				this.$router.push({path: '/setting/equipment/equipment/add'})
			},
      getList() {
        this.listLoading = true;

        deviceEventList().then(response => {
          this.listLoading = false;
					console.log(response)

          this.list = response.data.list;

          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
			DeleteSingle(index, row){
				this.$confirm('是否要删除', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  deleteDeviceEvent(row.id).then(response => {
				    this.$message({
				      message: '删除成功',
				      type: 'success',
				      duration: 1000
				    });
				    this.getList();
				  });
				});
			},
      handleUpdate(index, row) {
        this.$router.push({path: '/setting/equipment/equipment/update', query: {id: row.id}})
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
        if(this.operateType ==='deleteBatches'){
					this.$confirm('是否要批量删除', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
						let ids = [];
						for (let i = 0; i < this.multipleSelection.length; i++) {
						  ids.push(this.multipleSelection[i].id);
						}
						let data = new URLSearchParams();
						data.append("ids", ids);
						deleteDeviceEventBatch(data).then(response => {
						  this.$message({
						    message: '删除成功',
						    type: 'success',
						    duration: 1000
						  });
						  this.getList();
						  this.getListTempCard();
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
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
