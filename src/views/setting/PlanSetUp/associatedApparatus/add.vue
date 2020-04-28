<template> 
  <div class="app-container">
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.deviceId}}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.deviceName}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
						<el-button
						  size="mini"
							type="danger"
						  @click="binding(scope.$index, scope.row)">绑定
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
</template>
<script>
  import {listUnchecked,lineAddressEventCreateBatch} from '@/api/setting/associatedApparatus'
  export default {
    name: 'lineList',
    data() {
      return {
        operates: [
          {
            label: "批量绑定",
            value: "addBatch"
          }
        ],
        operateType: null,
        listQuery: {
					planId:this.$route.query.id,
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
			console.log(this.listQuery)
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        listUnchecked(this.listQuery).then(response => {
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
			binding(index, row){
					this.$confirm('是否要绑定', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
						let data = new URLSearchParams();
						data.append("planId", this.$route.query.id);
						data.append("deviceIds", row.deviceId);
					  lineAddressEventCreateBatch(data).then(response => {
					    this.$message({
					      message: '绑定成功',
					      type: 'success',
					      duration: 1000
					    });
					    this.getList();
							this.$router.back();
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
        if (this.operateType === 'addBatch') {
          
          let deviceIds = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            deviceIds.push(this.multipleSelection[i].deviceId);
          }
          let data = new URLSearchParams();
					data.append("planId", this.$route.query.id);
					data.append("deviceIds", deviceIds);
					console.log(data)
          lineAddressEventCreateBatch(data).then(response => {
            this.getList();
            this.$message({
              message: '批量添加绑定成功',
              type: 'success',
              duration: 1000
            });
						this.$router.back();
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

