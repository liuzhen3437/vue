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
        <!-- <el-button style="float:right;margin-right: 15px" type="success" @click="getPdf()">
        	导出pdf
        </el-button>
        <el-button style="float:right;margin-right: 15px" type="success" @click="exportExcel()">
        	导出excel
        </el-button> -->
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
			<el-form-item label="事件：">
				<el-input v-model="listQuery.eventName" class="input-width" placeholder="地点名称"></el-input>
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
<!--        <el-table-column label="线路"  align="center">
          <template slot-scope="scope">{{scope.row.lineName}}</template>
        </el-table-column> -->



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
  </div>
</template>
<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
	import {formatDate} from '@/utils/date';
	import {listRecordEvent} from '@/api/reportData/IncidentReport'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    startDateTime: null,
    endDateTime: null,
    inspectorName: null,
    deviceName: null,
    addressName: null,
		eventName: null
  };

  export default {
    name: "orderList",
    components:{},
    data() {
      return {
        htmlTitle:'事件报表',
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
        logisticsDialogVisible:false
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
      exportExcel () {
               /* out-table关联导出的dom节点  */
               var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
               /* get binary string as output */
               var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
               try {
                   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '事件报表.xlsx')
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
				return new Date(self.listQuery.endDateTime).getTime() < time.getTime()
			  } else {
				// return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
			  }
			}
		  }
		},
		processDate() {
		  const  self = this
		  return {
			disabledDate(time) {
			  if (self.listQuery.startDateTime) {  //如果开始时间不为空，则结束时间大于开始时间
				return new Date(self.listQuery.startDateTime).getTime() > time.getTime()
			  } else {
				// return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
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
        listRecordEvent(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        }).catch(function (err) {
					this.listQuery = Object.assign({}, defaultListQuery);
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
