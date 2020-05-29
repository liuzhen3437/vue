<template>
  <div >
	 <div id="pdfDom" style="padding-bottom: 50px;" ref="print" v-if="queryType=='计划考核'">
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

    <div id="pdfDom" style="padding-bottom: 50px;" ref="print" v-if="queryType=='巡检记录'">
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
      </el-table>
      </div>

    </div>

    <div id="pdfDom" style="padding-bottom: 50px;" ref="print" v-if="queryType=='事件报表'">
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                id="out-table"
                style="width: 100%;"
                v-loading="listLoading" border>
    		<el-table-column label="卡号"  align="center">
    		  <template slot-scope="scope">{{scope.row.card}}</template>
    		</el-table-column>
    		<el-table-column label="上传时间" width="180" align="center">
    		  <template slot-scope="scope">{{scope.row.createDateTime | formatCreateTime}}</template>
    		</el-table-column>
    		<el-table-column label="巡检时间" width="180" align="center">
    		  <template slot-scope="scope">{{scope.row.patrolDateTime | formatCreateTime}}</template>
    		</el-table-column>
    		<el-table-column label="地点" align="center">
    		  <template slot-scope="scope">{{scope.row.addressName}}</template>
    		</el-table-column>
    		<el-table-column label="事件" align="center">
    		  <template slot-scope="scope">{{scope.row.eventName}}</template>
    		</el-table-column>

    		<el-table-column label="设备" align="center">
    		  <template slot-scope="scope">{{scope.row.deviceName}}</template>
    		</el-table-column>
    		<el-table-column label="人员"  align="center">
    		  <template slot-scope="scope">{{scope.row.inspectorName}}</template>
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
  import {listRecord} from '@/api/reportData/CloudTour'
  import {listRecordEvent} from '@/api/reportData/IncidentReport'
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

        listLoading:false,
				list: [],
				query:this.$route.query,
        queryType:this.$route.query.type,
        proceedPage:0,
        loadingInstance:null
      }
    },
    created() {
      var type=this.queryType;
      if(type=='计划考核'){
        this.getListjihua();
      }else if(type=='巡检记录'){
        this.getListxunjian();
      }else if(type=='事件报表'){
        this.getListshijian();
      }

      this.loadingInstance = this.$loading({
                  lock: true,//lock的修改符--默认是false
                  text: '当前进行页数'+this.proceedPage,//显示在加载图标下方的加载文案
                  spinner: 'el-icon-loading',//自定义加载图标类名
                  background: 'rgba(0, 0, 0, 0.7)',//遮罩层颜色
      });

      //showLoading()
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
      async getListjihua(){
      	var rangeDialogVisibleData=JSON.parse(JSON.stringify(this.query));
      	delete rangeDialogVisibleData.pageStart;
      	delete rangeDialogVisibleData.pageEnd;
        delete rangeDialogVisibleData.type;
      	for(var i=this.query.pageStart;i<=this.query.pageEnd;i++){
      		rangeDialogVisibleData.pageNum=i;
      		 await listTaskPoint(rangeDialogVisibleData).then(response => {
      			 console.log(response)
      			this.list=this.list.concat(response.data.list)
      			console.log(this.list)
            this.proceedPage++
            this.loadingInstance.setText('当前进行页数'+this.proceedPage);
            console.log(this.proceedPage)
      		}).catch(function (err) {

      		});
      	}
        this.loadingInstance.close()
      	this.$print(this.$refs.print)
        //hideLoading()
      	//window.print()
      	 //this.getPdf();
      },
      async getListxunjian(){
      	var rangeDialogVisibleData=JSON.parse(JSON.stringify(this.query));
      	delete rangeDialogVisibleData.pageStart;
      	delete rangeDialogVisibleData.pageEnd;
        delete rangeDialogVisibleData.type;
      	for(var i=this.query.pageStart;i<=this.query.pageEnd;i++){
      		rangeDialogVisibleData.pageNum=i;
      		 await listRecord(rangeDialogVisibleData).then(response => {
      			 console.log(response)
      			this.list=this.list.concat(response.data.list)
      			console.log(this.list)
            this.proceedPage++
            this.loadingInstance.setText('当前进行页数'+this.proceedPage);
            console.log(this.proceedPage)
      		}).catch(function (err) {

      		});
      	}
        this.loadingInstance.close()
      	this.$print(this.$refs.print)
        //hideLoading()
      	//window.print()
      	 //this.getPdf();
      },
      async getListshijian(){
      	var rangeDialogVisibleData=JSON.parse(JSON.stringify(this.query));
      	delete rangeDialogVisibleData.pageStart;
      	delete rangeDialogVisibleData.pageEnd;
        delete rangeDialogVisibleData.type;
      	for(var i=this.query.pageStart;i<=this.query.pageEnd;i++){
      		rangeDialogVisibleData.pageNum=i;
      		 await listRecordEvent(rangeDialogVisibleData).then(response => {
      			 console.log(response)
      			this.list=this.list.concat(response.data.list)
      			console.log(this.list)
            this.proceedPage++
            this.loadingInstance.setText('当前进行页数'+this.proceedPage);
            console.log(this.proceedPage)
      		}).catch(function (err) {

      		});
      	}
        this.loadingInstance.close()
      	this.$print(this.$refs.print)
        //hideLoading()
      	//window.print()
      	 //this.getPdf();
      },

    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
	body{width:100%}
</style>
<style media="print">
    @page {
      size: auto;  /* auto is the initial value */
      margin: 0mm; /* this affects the margin in the printer settings */
    }
</style>
