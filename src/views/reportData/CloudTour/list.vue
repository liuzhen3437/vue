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

                v-loading="listLoading"
                border>

        <!-- <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column> -->
		<el-table-column label="序号" width="100" align="center" type="index">
		
		</el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.text}}</template>
        </el-table-column>


      </el-table>
    </div>

    <!-- <div class="pagination-container">
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
    </div> -->
  </div>
</template>

<script>

import {listEvent} from '@/api/reportData/CloudTour'


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
          recordId:null
        },
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: []
      }
    },
    created() {
      this.listQuery.recordId=this.$route.query.id
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        listEvent(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
        });
      }
      // handleSizeChange(val) {
      //   this.listQuery.pageNum = 1;
      //   this.listQuery.pageSize = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {
      //   this.listQuery.pageNum = val;
      //   this.getList();
      // }
    }
  }
</script>
