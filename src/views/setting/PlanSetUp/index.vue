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
					<el-table-column label="名称" align="center">
						<template slot-scope="scope">{{scope.row.name}}</template>
					</el-table-column>
			<el-table-column label="开始日期" align="center" :formatter="timestampToTime" prop="startDate">
				<!-- <template slot-scope="scope">{{scope.row.name}}</template> -->
			</el-table-column>
			<el-table-column label="类型" align="center" >
					<template slot-scope="scope">
					<span v-if="scope.row.type==0">无序</span>
					<span v-if="scope.row.type==1">有序</span>
					<span v-if="scope.row.type==2">精准</span>
					</template>
			</el-table-column>
					<el-table-column label="单位" align="center">
						<template slot-scope="scope">{{scope.row.companyName}}</template>
					</el-table-column>
			<el-table-column label="路线名称"  align="center">
				<template slot-scope="scope">{{scope.row.lineName}}</template>
			</el-table-column>
			<el-table-column label="设置"  align="center" width='400'>
				<template slot-scope="scope">
					<el-button
						size="mini"
						:disabled="scope.row.isEqualDevice===0"
						@click="associatedApparatus(scope.$index, scope.row)">绑定设备
					</el-button>
					<el-button
						size="mini"
						:disabled="scope.row.isEqualInspector===0"
						@click="AssociatedPersonnel(scope.$index, scope.row)">绑定巡检员
					</el-button>
					<el-button
						size="mini"
						@click="PlanPointSetting(scope.$index, scope.row)">计划点设置
					</el-button>
				</template>
			</el-table-column>
					<el-table-column label="操作" width="300" align="center">
						<template slot-scope="scope">
							<el-button
								size="mini"
								:disabled="scope.row.isChanged!=1"
								@click="alteration(scope.$index, scope.row)">变更立即生效
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

import {fetchList,deletePlan,deleteBatch,updateTaskRound} from '@/api/setting/PlanSetUp'


  export default {
    name: 'lineList',
    data() {
      return {
				route:true,
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
			this.route=true;
      this.getList();
    },
		watch: {
		    $route(to,from) {
				console.log(to)
				if(to.path==='/setting/PlanSetUp'){
					this.getList();
				}
			}
		},
    methods: {
		timestampToTime (row, column) {
		    var date = new Date(row.startDate) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		    var Y = date.getFullYear() + '-'
		    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
		    var D = date.getDate() + ' '
		    var h = date.getHours() + ':'
		    var m = date.getMinutes() + ':'
		    var s = date.getSeconds()
		    // return Y+M+D+h+m+s
			return Y+M+D

		},
		lineAddress(index, row){
			this.$router.push({path: '/setting/line/lineAddress', query: {id: row.id}})
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
        this.$router.push({path: '/setting/PlanSetUp/PlanSetUp/update', query: {id: row.id}})
      },
      handleDelete(index, row) {

        this.$confirm('是否要删除该分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePlan(row.id).then(response => {
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
        this.$router.push({name: 'PlanSetUpAdd'});
				this.route=false
      },
	  PlanPointSetting(index, row){
		this.$router.push({path: '/setting/PlanSetUp/PlanSetUp/PlanPointSetting', query: {id: row.id,type: row.type,planName:row.name,companyName:row.companyName,lineName:row.lineName}})
	  },
	  associatedApparatus(index, row){
		 this.$router.push({path: '/setting/PlanSetUp/PlanSetUp/associatedApparatus', query: {id: row.id}})
	  },
	  AssociatedPersonnel(index, row){
		this.$router.push({path: '/setting/PlanSetUp/PlanSetUp/AssociatedPersonnel', query: {id: row.id}})
	  },
    alteration(index, row){
      updateTaskRound(row.id).then(response => {
        this.$message({
          message: '变更成功',
          type: 'success',
          duration:1000
        });
        this.getList();
      });
    }
    }
  }
</script>
