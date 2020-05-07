<template> 
  <div>
  <div class="app-container" v-show='$route.meta.showRole'>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
			<el-button
			  class="btn-add"
			  @click="DotAdd()"
			  size="mini">
			  添加
			</el-button>
    </el-card>

    <div class="table-container">
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane label="事件设置" name="first">
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
            <el-table-column label="卡号" align="center">
              <template slot-scope="scope">{{scope.row.card}}</template>
            </el-table-column>
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template slot-scope="scope">{{scope.row.description}}</template>
            </el-table-column>
            <el-table-column label="单位" align="center">
              <template slot-scope="scope">{{scope.row.companyName}}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleUpdate(scope.$index, scope.row)">编辑
                </el-button>
								<el-button
								  size="mini"
								  @click="DeleteSingle(scope.$index, scope.row)">删除
								</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">设为临时事件
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

        </el-tab-pane>

        <el-tab-pane label="临时事件设置" name="second">
          <el-table ref="tempCardTable"
                :data="listTempCard"
                style="width: 100%"
                @selection-change="handleSelectionChangeTempCard"
                v-loading="listLoadingTempCard"
                border>
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="编号" width="100" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="卡号" align="center">
              <template slot-scope="scope">{{scope.row.card}}</template>
            </el-table-column>
            <el-table-column label="设备" align="center">
              <template slot-scope="scope">{{scope.row.deviceName}}</template>
            </el-table-column>
            <el-table-column label="上传时间" align="center" :formatter="timestampToTime" prop="uploadTime">
              <!-- <template slot-scope="scope">{{scope.row.uploadTime}}</template> -->
            </el-table-column>
            <el-table-column label="单位" align="center">
              <template slot-scope="scope">{{scope.row.companyName}}</template>
            </el-table-column>

            <el-table-column label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleUpdateTempCard(scope.$index, scope.row)">设置为事件
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDeleteTempCard(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="batch-operate-container">
            <el-select
              size="small"
              v-model="operateTypeTempCard" placeholder="批量操作">
              <el-option
                v-for="item in operatesTempCard"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button
              style="margin-left: 20px"
              class="search-button"
              @click="handleBatchOperateTempCard()"
              type="primary"
              size="small">
              确定
            </el-button>
          </div>
          <div class="pagination-container">
            <el-pagination
              background
              @size-change="handleSizeChangeTempCard"
              @current-change="handleCurrentChangeTempCard"
              layout="total, sizes,prev, pager, next,jumper"
              :page-size="listQueryTempCard.pageSize"
              :page-sizes="[5,10,15]"
              :current-page.sync="listQueryTempCard.pageNum"
              :total="totalTempCard">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <router-view ></router-view>
  </div>
</template>
<script>
import {eventList,deleteEven,deleteBatch,changeToTempCard,changeToTempCardBatch} from '@/api/setting/incident'
import {fetchList as fetchListTempCard,deleteBatch as deleteBatchTempCard, deleteTempCard ,changeToEvent,changeToEventBatch} from '@/api/tempCard'


  export default {
    name: 'addressList',
    data() {
      return {
        activeName: 'first',

        operates: [
          {
            label: "批量设置为临时事件",
            value: "changeToTempCardBatch"
          },
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


        operatesTempCard: [
          {
            label: "批量删除",
            value: "deleteBatch"
          },
          {
            label: "批量设置为事件",
            value: "changeToEventBatch"
          },
        ],
        operateTypeTempCard: null,
        listQueryTempCard: {
          state: 1,
          pageNum: 1,
          pageSize: 10
        },
        listTempCard: null,
        totalTempCard: null,
        listLoadingTempCard: false,
        multipleSelectionTempCard: [],

      }
    },
    created() {
      this.getList();
      this.getListTempCard();
    },
		watch: {
		    $route(to,from) {
				console.log(to)
				if(to.path==='/setting/incident'){
					this.getList();
					this.getListTempCard();
				}
			}
		},
    methods: {
			timestampToTime (row, column) {
			    var date = new Date(row.uploadTime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
				this.$router.push({path: '/setting/incident/incident/add'})
			},
      getList() {
        this.listLoading = true;
        eventList(this.listQuery).then(response => {
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
			DeleteSingle(index, row){
				this.$confirm('是否要删除', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  deleteEven(row.id).then(response => {
				    this.$message({
				      message: '删除成功',
				      type: 'success',
				      duration: 1000
				    });
				    this.getList();
				    this.getListTempCard();
				  });
				});
			},
      handleUpdate(index, row) {
        this.$router.push({path: '/setting/incident/incident/update', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('是否要设置为临时卡', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeToTempCard(row.id).then(response => {
            this.$message({
              message: '设置成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
            this.getListTempCard();
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
        if (this.operateType === 'changeToTempCardBatch') {
          this.$confirm('是否要批量设置为临时卡', '提示', {
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
						changeToTempCardBatch(data).then(response => {
						  this.$message({
						    message: '删除成功',
						    type: 'success',
						    duration: 1000
						  });
						  this.getList();
						  this.getListTempCard();
						});
          });
        }else if(this.operateType ==='deleteBatches'){
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
						deleteBatch(data).then(response => {
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

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////
      //临时卡

      getListTempCard() {
        this.listLoadingTempCard = true;
        fetchListTempCard(this.listQueryTempCard).then(response => {
          this.listLoadingTempCard = false;
          this.listTempCard = response.data.list;
          this.totalTempCard = response.data.total;
          this.totalPageTempCard = response.data.totalPage;
          this.pageSizeTempCard = response.data.pageSize;
        });
      },
      handleSelectionChangeTempCard(val) {
        this.multipleSelectionTempCard = val;
      },
      handleUpdateTempCard(index, row) {
        this.$confirm('是否要设置为事件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeToEvent(row.id).then(response => {
            this.$message({
              message: '设置成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
            this.getListTempCard();
          });
        });
      },
      handleDeleteTempCard(index, row) {

        this.$confirm('是否要删除该临时卡', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTempCard(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getListTempCard();
          });
        });

      },
      handleSizeChangeTempCard(val) {
        this.listQueryTempCard.pageNum = 1;
        this.listQueryTempCard.pageSize = val;
        this.getListTempCard();
      },
      handleCurrentChangeTempCard(val) {
        this.listQueryTempCard.pageNum = val;
        this.getListTempCard();
      },
      handleBatchOperateTempCard() {
        console.log(this.multipleSelectionTempCard);
        if (this.multipleSelectionTempCard < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateTypeTempCard === 'deleteBatch') {

          let ids = [];
          for (let i = 0; i < this.multipleSelectionTempCard.length; i++) {
            ids.push(this.multipleSelectionTempCard[i].id);
          }
          let data = new URLSearchParams();
          data.append("ids", ids);
          deleteBatchTempCard(data).then(response => {
            this.getListTempCard();
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
          });
        } else if(this.operateTypeTempCard === 'changeToEventBatch'){
          let ids = [];
          for (let i = 0; i < this.multipleSelectionTempCard.length; i++) {
            ids.push(this.multipleSelectionTempCard[i].id);
          }
          let data = new URLSearchParams();
          data.append("ids", ids);
          changeToEventBatch(data).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
            this.getListTempCard();
          });
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
