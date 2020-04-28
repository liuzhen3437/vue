<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="overflow: hidden;">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>

        	<el-button  style="float:right;margin-right: 15px" size="small" type="success" @click="rangeDialogVisible = true;exportType='pdf'">
        		导出pdf
        	</el-button>
          <el-button  style="float:right;margin-right: 15px" size="small" type="success" @click="rangeDialogVisible = true;exportType='excel'">
          	导出excel
          </el-button>

      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
			<el-form-item label="开始时间"  >
				<div class="input-width">
					<el-date-picker v-model="listQuery.startDateTime"  format="yyyy-MM-dd HH:mm:ss"  clearable style="width: 100%"
							  :picker-options="startDatePicker"  type="datetime"  placeholder="选择开始日期" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="结束时间" >
				<div class="input-width">
					<el-date-picker v-model="listQuery.endDateTime"  format="yyyy-MM-dd HH:mm:ss"  clearable style="width: 100%"
							  :picker-options="endDatePicker"   type="datetime"  placeholder="选择结束日期" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="巡检员：">
				<el-input v-model="listQuery.inspectorName" class="input-width" placeholder="巡检员名称"></el-input>
			</el-form-item>
			<el-form-item label="设备：">
				<el-input v-model="listQuery.deviceName" class="input-width" placeholder="设备名称"></el-input>
			</el-form-item>
			<el-form-item label="地点：">
				<el-input v-model="listQuery.addressName" class="input-width" placeholder="地点名称"></el-input>
			</el-form-item>
			<el-form-item label="线路：">
				<el-input v-model="listQuery.lineName" class="input-width" placeholder="线路名称"></el-input>
			</el-form-item>
			<el-form-item label="考核结果：">
			  <el-select v-model="listQuery.state" class="input-width" placeholder="全部" clearable>
			    <el-option v-for="item in stateOptions"
			               :key="item.value"
			               :label="item.label"
			               :value="item.value">
			    </el-option>
			  </el-select>
			</el-form-item>

        </el-form>
      </div>
    </el-card>
	<el-card class="operate-container" shadow="never">
		<el-row>
			<el-col :span="4"><div>合格数：<span style="color:#409EFF">{{listTaskPointTotal.typePass}}</span></div></el-col>
			<el-col :span="4"><div>漏检数：<span style="color:#EE6250">{{listTaskPointTotal.typeMissing}}</span></div></el-col>
			<el-col :span="4"><div>错序数：<span style="color:#25B3E5">{{listTaskPointTotal.typeSeqError}}</span></div></el-col>
			<el-col :span="4"><div>待巡数：<span style="color:#FFD4A7">{{listTaskPointTotal.typePending}}</span></div></el-col>
			<el-col :span="4"><div>时间不合格数：<span style="color:#CB29E8">{{listTaskPointTotal.typeMinimumError}}</span></div></el-col>
			<el-col :span="4"><div>合格率：<span>{{listTaskPointTotal.passRate}}%</span></div></el-col>
		</el-row>
	</el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
 <div id="pdfDom" style="padding-bottom: 50px;">
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                id="out-table"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
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
		  <template slot-scope="scope">
        <span v-if="scope.row.state==0">待巡</span>
        <span v-if="scope.row.state==1">合格</span>
        <span v-if="scope.row.state==2">漏检</span>
        <span v-if="scope.row.state==3">错序</span>
        <span v-if="scope.row.state==4">请假</span>
        <span v-if="scope.row.state==5">时间不合格</span>
      </template>
		</el-table-column>
		<el-table-column label="单位"  align="center">
		  <template slot-scope="scope">{{scope.row.companyName}}</template>
		</el-table-column>
    </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
  <!-- <el-button type="text" @click="rangeDialogVisible = true">点击打开 Dialog</el-button> -->
  <el-dialog
    title="选择范围"
    :visible.sync="rangeDialogVisible"
    width="30%"
    :before-close="handleClose">
    <el-row>
      <el-col :span="8"><el-input :inline="true"  v-model.number="pageStart" @keyup.enter.native="handleClickStart"/></el-col>
      <el-col :span="8"><div style='text-align: center; height: 40px; line-height: 40px;'>至</div></el-col>
      <el-col :span="8"><el-input :inline="true" v-model.number="pageEnd" @keyup.enter.native="handleClickEnd"/></el-col>


    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="rangeDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="rangeDialogVisibleOk">确 定</el-button>
    </span>
  </el-dialog>


  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
	import {formatDate} from '@/utils/date';
	import {listTaskPoint,listTaskPointTotal} from '@/api/reportData/inspectionRecords'
  import { showLoading, hideLoading } from '@/api/loading';


  function endDateTimestamp(){
    var day = new Date(new Date().toLocaleDateString()).getTime();

    var getTime=day+24*60*60*1000;
    console.log(getTime)
  	return getTime
  }
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
				exportType:'',
				excelList:[],
      }
    },
    created() {
      // this.getList();
    },
    filters: {
      formatCreateTime(time) {
        if(time==null){

        }else{
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
      }
    },
    methods: {

      async rangeDialogVisibleOk(){
				var that=this
				if(this.pageStart>this.pageEnd){
					this.$message({
					  message: '开始页不能大于结束页',
					  type: 'error',
					  duration:1000
					});
					return false
				}
				if(this.pageStart==this.pageEnd){
					this.$message({
					  message: '开始页不能等于结束页',
					  type: 'error',
					  duration:1000
					});
					return false
				}
				if(this.exportType=='excel'){
          showLoading();
					this.tpreviousData=this.list;
					console.log(this.rangeDialogVisibleData)
					this.rangeDialogVisibleData=this.listQuery;
					for(var i=this.pageStart;i<=this.pageEnd;i++){
					  this.rangeDialogVisibleData.pageNum=i;
					   await listTaskPoint(this.rangeDialogVisibleData).then(response => {
               for(var i=0;i<response.data.list.length;i++){
                response.data.list[i].taskRoundDate=this.$options.filters.formatCreateTime(response.data.list[i].taskRoundDate);
                response.data.list[i].taskRoundStartDateTime=this.$options.filters.formatCreateTime(response.data.list[i].taskRoundStartDateTime)
                response.data.list[i].taskRoundEndDateTime=this.$options.filters.formatCreateTime(response.data.list[i].taskRoundEndDateTime);
                response.data.list[i].startDateTime=this.$options.filters.formatCreateTime(response.data.list[i].startDateTime)
                response.data.list[i].endDateTime=this.$options.filters.formatCreateTime(response.data.list[i].endDateTime)
                response.data.list[i].recordDateTime=this.$options.filters.formatCreateTime(response.data.list[i].recordDateTime)
               }
					    this.excelList=this.excelList.concat(response.data.list)
					    console.log(this.excelList)
					  }).catch(function (err) {
					  	that.rangeDialogVisibleData = Object.assign({}, defaultListQuery);
					  });
					}
					this.exportData()
				}else{
					var data=this.rangeDialogVisibleData;
					data.pageStart=this.pageStart;
					data.pageEnd=this.pageEnd;
          data.type='计划考核'
					let routeUrl = this.$router.resolve({path: '/template', query:data})

					window.open(routeUrl.href, '_blank');
				}
      },
      handleClickStart(){
        this.pageStart = this.pageStart.replace(/[^\w]/g, '');
      },
      handleClickEnd(){
        this.pageEnd = this.pageEnd.replace(/[^\w]/g, '');
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },


			exportData(){

             require.ensure([], () => {
                 const { export_json_to_excel } = require('@/vendor/Export2Excel');
                 //要输出的表头
                 const tHeader = ['序号', '线路', '计划', '开始时间', '结束时间', '地点', '人员', '巡检器', '巡检时间', '巡检顺序', '巡检结果','单位'];
                 //表头对应的内容, 会从下行定义的 list 里去找相应的数据
                 const filterVal = ['id','lineName','planName','startDateTime','endDateTime','addressName','inspectorName','deviceName','recordDateTime','seq','state','companyName'];
                 //数据来源
                 const list = this.excelList;
                 const data = this.formatJson(filterVal, list);
                 //fileName: 要导出的表格名称
                 export_json_to_excel(tHeader, data, '计划考核');
                 this.rangeDialogVisible=false
                 hideLoading();
             })
         },

         formatJson(filterVal, jsonData) {
             return jsonData.map(v => filterVal.map(j => v[j]))
         },


      downLoad(){
        this.getPdf();//参数是下载的pdf文件名
      },
		beginDate(){
		  const self = this
		  return {
			disabledDate(time){
			  if (self.listQuery.endDateTime) {  //如果结束时间不为空，则小于结束时间
				return new Date(self.listQuery.endDateTime).getTime() < time.getTime()
			  } else {
          return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
			  }
			}
		  }
		},

    processDate() {
      const  self = this
      return {
    	disabledDate(time) {
    	  if (self.listQuery.startDateTime) {  //如果开始时间不为空，则结束时间大于开始时间
    		return new Date(self.listQuery.startDateTime).getTime() > time.getTime() || time.getTime() > Date.now()
    	  } else {
    		 return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
    	  }
    	}
      }
    },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
				console.log(this.listQuery)
        this.getList();
      },

      handleSizeChange(val){
				console.log(0)
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
				console.log(val)
        this.listQuery.pageNum = val;
				console.log(this.listQuery.pageNum)
        this.getList();
      },

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
