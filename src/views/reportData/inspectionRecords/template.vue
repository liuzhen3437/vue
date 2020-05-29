<template> 
  <div class="app-container">
	 <div id="pdfDom" style="padding-bottom: 50px;">
			<div class="table-container">
				<el-table ref="orderTable"
									:data="list"
									id="out-table"
									style="width: 100%;"
									v-loading="listLoading" border>
					<!-- <el-table-column label="序号" align="center">
						<template slot-scope="scope">{{scope.row.id}}</template>
					</el-table-column> -->
					<el-table-column label="序号" width="100" align="center" type="index">
					
					</el-table-column>
					<el-table-column label="线路"  align="center">
						<template slot-scope="scope">{{scope.row.lineName}}</template>
					</el-table-column>
					<el-table-column label="计划"  align="center">
						<template slot-scope="scope">{{scope.row.planName}}</template>
					</el-table-column>
					<el-table-column label="开始时间" width="180" align="center">
						<template slot-scope="scope">{{scope.row.startDateTime | formatCreateTime}}</template>
					</el-table-column>
					<el-table-column label="结束时间" width="180" align="center">
						<template slot-scope="scope">{{scope.row.endDateTime | formatCreateTime}}</template>
					</el-table-column>
					<el-table-column label="地点" align="center">
						<template slot-scope="scope">{{scope.row.addressName}}</template>
					</el-table-column>
					<el-table-column label="人员"  align="center">
						<template slot-scope="scope">{{scope.row.inspectorName}}</template>
					</el-table-column>
					<el-table-column label="巡检器"  align="center">
						<template slot-scope="scope">{{scope.row.deviceName}}</template>
					</el-table-column>
					<el-table-column label="巡检时间" width="180" align="center">
						<template slot-scope="scope">{{scope.row.recordDateTime | formatCreateTime}}</template>
					</el-table-column>
			<el-table-column label="巡检顺序"  align="center">
				<template slot-scope="scope">{{scope.row.seq}}</template>
			</el-table-column>
			<el-table-column label="考核结果"  align="center">
				<template slot-scope="scope">{{scope.row.state}}</template>
			</el-table-column>
			<el-table-column label="单位"  align="center">
				<template slot-scope="scope">{{scope.row.companyName}}</template>
			</el-table-column>
			</el-table>
			</div>
		</div>
  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
	import {formatDate} from '@/utils/date';
	import {listTaskPoint,listTaskPointTotal} from '@/api/reportData/inspectionRecords'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    startDateTime: null,
    endDateTime: null,
    inspectorName: null,
    deviceName: null,
    addressName: null,
    lineName: null,
		state:null
  };
  const listTaskPointTotalData={
	  typePass:0,
	  typeMissing:0,
	  typeSeqError:0,
	  typePending:0,
	  typeMinimumError:0,
	  passRate:0
  }
  export default {
    name: "orderList",
    components:{},
    data() {
      return {
        htmlTitle:'计划考核',
		  listTaskPointTotal:Object.assign({}, listTaskPointTotalData),
		startDatePicker: this.beginDate(),
		endDatePicker: this.processDate(),
		stateOptions: [
			{
			  label: '全部',
			  value: null
			},
		  {
			label: '待巡',
			value: 0
		  },
		  {
			label: '合格',
			value: 1
		  },
		  {
			label: '漏检',
			value: 2
		  },
		  {
			label: '错序',
			value: 3
		  },
		  {
			label: '所有不合格',
			value: 9
		  }
		],
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: false,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrder:{
          dialogVisible:false,
          content:null,
          orderIds:[]
        },

        logisticsDialogVisible:false,
        tpreviousData:[],
        rangeDialogVisible:false,
        pageStart:0,
        pageEnd:0,
        rangeDialogVisibleData:Object.assign({}, defaultListQuery),
				exportType:''
      }
    },
    created() {
			console.log(1)
			console.log(this.$route)
      // this.getList();
    },

    methods: {
      getList() {
				const self = this
        this.listLoading = true;
				console.log(this.listQuery)
        listTaskPoint(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        }).catch(function (err) {
					this.listQuery = Object.assign({}, defaultListQuery);
				});

				var listTaskPointTotalQuery=JSON.parse(JSON.stringify(this.listQuery))
				delete listTaskPointTotalQuery.pageNum;
				delete listTaskPointTotalQuery.pageSize;
				listTaskPointTotal(listTaskPointTotalQuery).then(response => {
					this.listTaskPointTotal=response.data
				}).catch(function (err) {
					console.log(self.listTaskPointTotal)
					self.listTaskPointTotal=Object.assign({}, listTaskPointTotalData);
				});
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>
