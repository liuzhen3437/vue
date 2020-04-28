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
				<el-table-column label="路线"  align="center">
					<template slot-scope="scope">{{scope.row.lineName}}</template>
				</el-table-column>
        <el-table-column label="日期"  align="center">
        	<template slot-scope="scope">{{scope.row.dateTime}}</template>
        </el-table-column>
        <el-table-column label="时间不合格"  align="center">
        	<template slot-scope="scope">{{scope.row.typeMinimumErrorSum}}</template>
        </el-table-column>
        <el-table-column label="合格"  align="center">
        	<template slot-scope="scope">{{scope.row.typeMissingSum}}</template>
        </el-table-column>
        <el-table-column label="漏检"  align="center">
        	<template slot-scope="scope">{{scope.row.typePassSum}}</template>
        </el-table-column>
        <el-table-column label="待巡"  align="center">
        	<template slot-scope="scope">{{scope.row.typePendingSum}}</template>
        </el-table-column>
        <el-table-column label="错序"  align="center">
        	<template slot-scope="scope">{{scope.row.typeSeqErrorSum}}</template>
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

import {monthTotalLine} from '@/api/reportData/monthlyCalendar'


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
          companyId: this.$route.query.row.companyId,
          startDate: this.$route.query.dateTimeTimestamp.startDate,
          endDate: this.$route.query.dateTimeTimestamp.endDate
        },
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: []
      }
    },
    created() {
			console.log(this.$route.query)
			
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        monthTotalLine(this.listQuery).then(response => {
          this.listLoading = false;
					for(var i=0;i<response.data.length;i++){
						//console.log(this.list[i])
						var typeMinimumErrorSum=0;
						var typeMissingSum=0;
						var typePassSum=0;
						var typePendingSum=0;
						var typeSeqErrorSum=0;
						for(var j=0;j<response.data[i].dailyResultList.length;j++){
							typeMinimumErrorSum+=response.data[i].dailyResultList[j].typeMinimumError;
							typeMissingSum+=response.data[i].dailyResultList[j].typeMissing;
							typePassSum+=response.data[i].dailyResultList[j].typePass;
							typePendingSum+=response.data[i].dailyResultList[j].typePending;
							typeSeqErrorSum+=response.data[i].dailyResultList[j].typeSeqError;
						}
						response.data[i]['typeMinimumErrorSum']=typeMinimumErrorSum;
						response.data[i]['typeMissingSum']=typeMissingSum;
						response.data[i]['typePassSum']=typePassSum;
						response.data[i]['typePendingSum']=typePendingSum;
						response.data[i]['typeSeqErrorSum']=typeSeqErrorSum;
						response.data[i]['dateTime']=this.$route.query.date;
						
					}
          this.list = response.data;
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

