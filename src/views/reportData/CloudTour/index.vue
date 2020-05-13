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
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
     <div id="pdfDom" style="padding-bottom: 50px;">
    <div class="table-container">
      <el-table ref="orderTable"
                id="out-table"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
				<el-table-column label="上传时间" width="180" align="center">
				  <template slot-scope="scope">{{scope.row.createDateTime | formatCreateTime}}</template>
				</el-table-column>
				<el-table-column label="巡检时间" width="180" align="center">
				  <template slot-scope="scope">{{scope.row.patrolDateTime | formatCreateTime}}</template>
				</el-table-column>
				<el-table-column label="地点" align="center">
				  <template slot-scope="scope">{{scope.row.addressName}}</template>
				</el-table-column>
				<el-table-column label="卡号"  align="center">
				  <template slot-scope="scope">{{scope.row.card}}</template>
				</el-table-column>
				<el-table-column label="设备" align="center">
				  <template slot-scope="scope">{{scope.row.deviceName}}</template>
				</el-table-column>
				<el-table-column label="人员"  align="center">
				  <template slot-scope="scope">{{scope.row.inspectorName}}</template>
				</el-table-column>
        <el-table-column label="线路"  align="center">
          <template slot-scope="scope">{{scope.row.lineName}}</template>
        </el-table-column>
				<el-table-column label="附件数"  align="center">
				  <template slot-scope="scope">
            <span style="cursor:pointer; display: block;" @click="LookAttachment(scope.$index, scope.row)" v-if='scope.row.attachmentCount==0'>{{scope.row.attachmentCount}}</span>
            <span style="cursor:pointer; display: block; color: #0000FF;" @click="LookAttachment(scope.$index, scope.row)" v-if='scope.row.attachmentCount!=0'>{{scope.row.attachmentCount}}</span>
          </template>
				</el-table-column>
				<el-table-column label="事件数"  align="center">
				  <template slot-scope="scope"><span style="cursor:pointer; display: block;" @click="LookParticulars(scope.$index, scope.row)">{{scope.row.eventCount}}</span></template>
				</el-table-column>



		<el-table-column label="单位"  align="center">
		  <template slot-scope="scope">{{scope.row.companyName}}</template>
		</el-table-column>
    <!-- <el-table-column label="操作"  align="center">
      <template slot-scope="scope">
      	<el-button
      	  size="mini"
      	  @click="LookParticulars(scope.$index, scope.row)">查看详情
      	</el-button>
      </template>
    </el-table-column> -->
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
	import {listRecord} from '@/api/reportData/CloudTour'
  import { showLoading, hideLoading } from '@/api/loading';
  import { limitTime } from '@/api/limitTime';
  const startDate = new Date(new Date(new Date().toLocaleDateString()).getTime());
  const endDate = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    startDateTime: startDate.getTime(),
    endDateTime: endDate.getTime(),
    inspectorName: null,
    deviceName: null,
    addressName: null
  };

  export default {
    name: "orderList",
    components:{},
    data() {
      return {
        htmlTitle:'巡检记录',
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
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
      		   await listRecord(this.rangeDialogVisibleData).then(response => {
               for(var i=0;i<response.data.list.length;i++){
                response.data.list[i].createDateTime=this.$options.filters.formatCreateTime(response.data.list[i].createDateTime);
                response.data.list[i].patrolDateTime=this.$options.filters.formatCreateTime(response.data.list[i].patrolDateTime)
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
          data.type='巡检记录'
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
                 const tHeader = ['上传时间', '巡检时间', '地点', '卡号', '设备', '人员', '线路', '附件数', '事件数', '单位'];
                 //表头对应的内容, 会从下行定义的 list 里去找相应的数据
                 const filterVal = ['createDateTime','patrolDateTime','addressName','card','deviceName','inspectorName','lineName','attachmentCount','eventCount','companyName'];
                 //数据来源
                 const list = this.excelList;
                 const data = this.formatJson(filterVal, list);
                 //fileName: 要导出的表格名称
                 export_json_to_excel(tHeader, data, '巡检记录');
                 this.rangeDialogVisible=false
                 hideLoading();
             })
         },
         formatJson(filterVal, jsonData) {
             return jsonData.map(v => filterVal.map(j => v[j]))
         },
      exportExcel () {
					 /* out-table关联导出的dom节点  */
					 var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
					 /* get binary string as output */
					 var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
					 try {
							 FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '巡检记录.xlsx')
					 } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
					 return wbout
			 },
      downLoad(){
        this.getPdf();//参数是下载的pdf文件名
      },
		beginDate(){
		  const self = this
		  return {
			disabledDate(time){
			  if (self.listQuery.endDateTime) {  //如果结束时间不为空，则小于结束时间
				return new Date(self.listQuery.endDateTime).getTime() < time.getTime() || time.getTime() > Date.now() || time.getTime() < limitTime()
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
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },

      getList() {
				const self = this
        this.listLoading = true;
				console.log(this.listQuery)
        listRecord(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        }).catch(function (err) {
					this.listQuery = Object.assign({}, defaultListQuery);
				});

      },
      LookParticulars(index,row){
        console.log(row)
        this.$router.push({path: 'CloudTour/LookIncident', query: {id: row.id}})
      },
			LookAttachment(index,row){
				this.$router.push({path: 'CloudTour/attachment', query: {id: row.id}})
			}

    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>
