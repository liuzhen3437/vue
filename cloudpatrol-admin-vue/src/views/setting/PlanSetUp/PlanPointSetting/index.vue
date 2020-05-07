<template> 
  <div>
  <div class="app-container" v-show='$route.meta.showRole2'>
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
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
				<el-table-column label="计划" align="center">
				  <template slot-scope="scope">{{query.planName}}</template>
				</el-table-column>
				<el-table-column label="线路" align="center">
				  <template slot-scope="scope">{{query.lineName}}</template>
				</el-table-column>
				<el-table-column label="单位" align="center">
				  <template slot-scope="scope">{{query.companyName}}</template>
				</el-table-column>
				<el-table-column label="顺序号" align="center" v-if="query.type==1||query.type==2">
				  <template slot-scope="scope">{{scope.row.seq}}</template>
				</el-table-column>
				<el-table-column label="开始间隔(分钟)" align="center" v-if="query.type==2">
				  <template slot-scope="scope">{{scope.row.offsetStart}}</template>
				</el-table-column>
				<el-table-column label="时长(分钟)" align="center" v-if="query.type==2">
				  <template slot-scope="scope">{{scope.row.duration}}</template>
				</el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.addressName}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
							:disabled="query.type===0"
              @click="update(scope.$index, scope.row)">编辑
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="batch-operate-container">
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
    </div> -->
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
	import {fetchList} from '@/api/setting/PlanPointSetting'
  import {listByCompany,deleteAddressEvent,deleteBatch} from '@/api/setting/lineAddress'
  export default {
    name: 'lineList',
    data() {
      return {
        // operates: [
        //   {
        //     label: "批量删除绑定事件",
        //     value: "deleteBatch"
        //   }
        // ],

				// type:this.$route.query.type,
				// companyName:this.$route.query.companyName,
				// planName:this.$route.query.planName,
				// lineName:this.$route.query.lineName,
				query:this.$route.query,
        operateType: null,
        listQuery: {
					planId:this.$route.query.id,
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
			console.log(this.query)
      this.getList();
    },
		watch: {
		    $route(to,from) {
				console.log(to)
				if(to.path==='/setting/PlanSetUp/PlanSetUp/PlanPointSetting'){
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
					console.log(response.data.list)
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleDelete(index, row) {

        this.$confirm('是否要删除该绑定事件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAddressEvent(row.id).then(response => {
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
			update(index,row){
				this.$router.push({name: 'PlanPointSettingUpdate', query: {id: row.id,addressId:row.addressId,companyId:row.companyId,planId:row.planId,type:this.query.type}})
			}
//       handleBatchOperate() {
//         console.log(this.multipleSelection);
//         if (this.multipleSelection < 1) {
//           this.$message({
//             message: '请选择一条记录',
//             type: 'warning',
//             duration: 1000
//           });
//           return;
//         }
//         if (this.operateType === 'deleteBatch') {
//
//           let ids = [];
//           for (let i = 0; i < this.multipleSelection.length; i++) {
//             ids.push(this.multipleSelection[i].id);
//           }
//           let data = new URLSearchParams();
//           data.append("ids", ids);
//           deleteBatch(data).then(response => {
//             this.getList();
//             this.$message({
//               message: '删除成功',
//               type: 'success',
//               duration: 1000
//             });
//           });
//
//         } else {
//           this.$message({
//             message: '请选择批量操作类型',
//             type: 'warning',
//             duration: 1000
//           });
//           return;
//         }
//       }
    }
  }
</script>
