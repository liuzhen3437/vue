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
			<!-- <el-row>
				<el-button @click="setDot()">设置点坐标</el-button>
			</el-row> -->
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane label="地点设置" name="first">
          <el-table ref="addressTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"

                border>
            <el-table-column type="selection"  width="60" align="center"></el-table-column>
            <el-table-column label="编号" width="100" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="卡号" align="center">
              <template slot-scope="scope">{{scope.row.card}}</template>
            </el-table-column>
            <el-table-column label="地点" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template slot-scope="scope">{{scope.row.description}}</template>
            </el-table-column>
            <el-table-column label="单位" align="center">
              <template slot-scope="scope">{{scope.row.companyName}}</template>
            </el-table-column>
						<el-table-column label="设置" align="center" width="300">
						  <template slot-scope="scope">
								<el-button
								  size="mini"
								  @click="setDot(scope.$index, scope.row)">设置点坐标
								</el-button>
								<el-button
								  size="mini"
								  @click="LookCorrelation(scope.$index, scope.row)">查看绑定事件
								</el-button>
							</template>
						</el-table-column>
            <el-table-column label="操作" width="300" align="center">
              <template slot-scope="scope">
								<el-button
								  size="mini"
								  @click="handleDelete(scope.$index, scope.row)">设置为临时卡
								</el-button>
                <el-button
                  size="mini"
                  @click="handleUpdate(scope.$index, scope.row)">编辑
                </el-button>
								<el-button
								  size="mini"
									type="danger"
								  @click="handleSingleDelete(scope.$index, scope.row)">删除
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
        <el-tab-pane label="临时卡设置" name="second">
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
                  @click="handleUpdateTempCard(scope.$index, scope.row)">设置为地点
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
		<el-dialog
			title="关联事件"
			:visible.sync="dialogVisible"
			width="70%"
			:before-close="handleClose">

			<el-row style="margin-bottom:15px;" :gutter="5">
				<el-col  ><el-button type="primary"  size="small"  v-for="(tag,i) in siteList" :key="i" style="margin-bottom:5px; float: left;cursor:auto;margin-right:10px;margin-left: 0px;">{{tag}}</el-button></el-col>
			</el-row>
			<el-table ref="addressTable"
			      :data="Incidentlist"
			      style="width: 100%"
			      @selection-change="popupSelectionChange"
			      v-loading="InclidentlistLoading"
            row-key="id"
			      border>
			  <el-table-column type="selection" :reserve-selection="true"  width="60" align="center"></el-table-column>
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
			  <!-- <el-table-column label="操作" width="300" align="center">
			    <template slot-scope="scope">
			    </template>
			  </el-table-column> -->
			</el-table>
			<!-- <div class="batch-operate-container">
			  <el-select
			    size="small"
			    v-model="popupType" placeholder="批量操作">
			    <el-option
			      v-for="item in popupOperates"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			  <el-button
			    style="margin-left: 20px"
			    class="search-button"
			    @click="BulkbindingeventOperate()"
			    type="primary"
			    size="small">
			    确定
			  </el-button>
			</div> -->
			<div class="pagination-container">
			  <el-pagination
			    background
			    @size-change="IncidenthandleSizeChange"
			    @current-change="IncidenthandleCurrentChange"
			    layout="total, sizes,prev, pager, next,jumper"
			    :page-size="IncidentlistQuery.pageSize"
			    :page-sizes="[5,10,15]"
			    :current-page.sync="IncidentlistQuery.pageNum"
			    :total="Incidenttotal">
			  </el-pagination>
			</div>
			<div style="clear: both;"></div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary"@click="BulkbindingeventOperate()">确 定</el-button>
			</div>
		</el-dialog>
  </div>
	<router-view ></router-view>
	</div>
</template>

<script>
import {eventList,listByCompany} from '@/api/setting/incident'
import {fetchList, changeToTempCardBatch , changeToTempCard,Delete,DeleteBatch} from '@/api/address'
import {fetchList as fetchListTempCard,deleteBatch as deleteBatchTempCard, deleteTempCard ,changeToAddress,changeToAddressBatch} from '@/api/tempCard'
import {overwrite} from '@/api/setting/LookCorrelation'


  export default {
    name: 'addressList',
    data() {
      return {
        activeName: 'first',

        operates: [
          {
            label: "批量设置为临时卡",
            value: "changeToTempCardBatch"
          },
					{
					  label: "批量删除",
					  value: "DeleteBatch"
					},
					{
					  label: "批量绑定事件",
					  value: "BulkBindingEvent"
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
            label: "批量设置为地点",
            value: "changeToAddressBatch"
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


				dialogVisible:false,
				IncidentlistQuery: {
				  companyId: 1,
				  pageNum: 1,
				  pageSize: 10
				},
				Incidentlist: null,
				Incidenttotal: null,
				InclidentlistLoading: false,
				popupType:null,
				popupOperates:[
					{
					  label: "批量绑定事件",
					  value: "Bulkbindingevent"
					}
				],
				siteList:[],
				multipleSelectionPopup: [],

      }
    },
    created() {

      this.getList();
      this.getListTempCard();


    },
	watch: {
	    $route(to,from) {
			console.log(to)
			if(to.path==='/setting/address'){
				this.getList();
				this.getListTempCard();
			}
		}
	},
    methods: {

			popupSelectionChange(val){

        this.multipleSelectionPopup = val;
        console.log(this.multipleSelectionPopup)
			},
			BulkbindingeventOperate(){


				if (this.multipleSelectionPopup < 1) {
				  this.$message({
				    message: '请选择一条记录',
				    type: 'warning',
				    duration: 1000
				  });
				  return;
				}

				  this.$confirm('是否要绑定', '提示', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				    type: 'warning'
				  }).then(() => {
						let eventIds = [];
						for (let i = 0; i < this.multipleSelectionPopup.length; i++) {
						  eventIds.push(this.multipleSelectionPopup[i].id);
						}
						let addressIds = [];
						for (let i = 0; i < this.multipleSelection.length; i++) {
						  addressIds.push(this.multipleSelection[i].id);
						}

						let data = new URLSearchParams();

						data.append("addressIds",addressIds );
						data.append("eventIds", eventIds);
						// console.log(data)
						// var formData=new FormData();
						// formData.append("addressIds",'22,29')
						// formData.append("eventIds",'19,21')

						overwrite(data).then(response => {
						  this.$message({
						    message: '绑定成功',
						    type: 'success',
						    duration: 1000
						  });
						  this.getIncidentList(this.multipleSelection[0].companyId);
							this.dialogVisible = false;
						});
				  });

			},
			//查看关联事件
			LookCorrelation(index,row){
				this.$router.push({path: '/setting/address/LookCorrelation/', query: {id: row.id}})
			},
			// LookCorrelation(index,row){
			// 	this.siteList[0]=row;
			// 	console.log(this.siteList);
			// 	this.dialogVisible = true;
			// 	this.getIncidentList(row.companyId);
			// },
			handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
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
				this.$router.push({path: 'address/address/add'})
			},
			setDot(index,row) {
				console.log(index)
				console.log(row)
			  this.$router.push({path: '/setting/address/address/site', query: {id: row.id}})
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
			getIncidentList(companyId){
				this.IncidentlistLoading = true;
        this.IncidentlistQuery.companyId=companyId;
				listByCompany(this.IncidentlistQuery).then(response => {
				  this.IncidentlistLoading = false;
					console.log(response)
				  this.Incidentlist = response.data.list;
				  this.Incidenttotal = response.data.total;
				  this.IncidenttotalPage = response.data.totalPage;
				  this.IncidentpageSize = response.data.pageSize;
				});
			},
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/setting/address/address/update', query: {id: row.id}})
      },
			handleSingleDelete(index, row){
				this.$confirm('是否要删除', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  Delete(row.id).then(response => {
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
      handleDelete(index, row) {

        this.$confirm('是否要是否要设置为临时卡', '提示', {
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
			IncidenthandleSizeChange(val) {
			  this.IncidentlistQuery.pageNum = 1;
			  this.IncidentlistQuery.pageSize = val;
			  this.getIncidentList(this.IncidentlistQuery.companyId);
			},
			IncidenthandleCurrentChange(val) {
			  this.IncidentlistQuery.pageNum = val;
			  this.getIncidentList(this.IncidentlistQuery.companyId);
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
				console.log(this.operateType);

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
        }else if(this.operateType === 'DeleteBatch'){
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
						DeleteBatch(data).then(response => {
						  this.$message({
						    message: '删除成功',
						    type: 'success',
						    duration: 1000
						  });
						  this.getList();
						  this.getListTempCard();
						});
					});
				}else if(this.operateType === 'BulkBindingEvent'){
					console.log(this.multipleSelection.every(item => item.companyId === this.multipleSelection[0].companyId))
					var  sign=this.multipleSelection.every(item => item.companyId === this.multipleSelection[0].companyId)
					if(sign==true){
						this.dialogVisible = true;
						let name = [];
						for (let i = 0; i < this.multipleSelection.length; i++) {
						  name.push(this.multipleSelection[i].name);
						}
						console.log(name)
						this.siteList=name;
						this.getIncidentList(this.multipleSelection[0].companyId);
					}else{
						this.$message({
						  message: '批量绑定时请选择相同单位下的地点！',
						  type: 'warning',
						  duration: 1000
						});
					}


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
					console.log(response.data.list)
          this.totalTempCard = response.data.total;
          this.totalPageTempCard = response.data.totalPage;
          this.pageSizeTempCard = response.data.pageSize;
        });
      },
      handleSelectionChangeTempCard(val) {
        this.multipleSelectionTempCard = val;
      },
      handleUpdateTempCard(index, row) {
        this.$confirm('是否要设置为地点', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeToAddress(row.id).then(response => {
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
        } else if(this.operateTypeTempCard === 'changeToAddressBatch'){
          let ids = [];
          for (let i = 0; i < this.multipleSelectionTempCard.length; i++) {
            ids.push(this.multipleSelectionTempCard[i].id);
          }
          let data = new URLSearchParams();
          data.append("ids", ids);
          changeToAddressBatch(data).then(response => {
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
