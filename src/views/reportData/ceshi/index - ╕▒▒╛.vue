<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
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
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
			<el-form-item label="开始时间"  >
				<div class="input-width">
					<el-date-picker v-model="listQuery.startDate"  format="yyyy-MM-dd HH:mm:ss"  clearable style="width: 100%"
							  :picker-options="startDatePicker"  type="datetime"  placeholder="选择开始日期" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="结束时间" >
				<div class="input-width">
					<el-date-picker v-model="listQuery.endDate"  format="yyyy-MM-dd HH:mm:ss"  clearable style="width: 100%"
							  :picker-options="endDatePicker"   type="datetime"  placeholder="选择结束日期" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
        </el-form>
      </div>
    </el-card>
		<div style="width: 80%; margin: 0 auto">
			<el-card class="operate-container" shadow="never" align="center">
				<el-calendar>
					<!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
					<template
						slot="dateCell"
						slot-scope="{date, data}">
						<div :class="data.isSelected ? 'is-selected' : ''" v-on:click="allcalendar(data,$event)" style="padding: 8px; height: 85px;margin: 0px; position: relative;" @mouseenter="changeActive(data,$event)" @mouseleave="removeActive(data,$event)">
							{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
							<div class="statistics">
									<p><span>时间不合格数</span>{{typeMinimumErrorADay}}</p>
									<p><span>漏检数</span>{{typeMissingADay}}</p>
									<p><span>合格数</span>{{typePassADay}}</p>
									<p><span>待巡数</span>{{typePendingADay}}</p>
									<p><span>错序数</span>{{typeSeqErrorADay}}</p>
							</div>
						</div>
					</template>
				</el-calendar>
			</el-card>
		</div>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
				<el-table-column label="单位"  align="center">
					<template slot-scope="scope">{{scope.row.companyName}}</template>
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
				<el-table-column label="操作"  align="center">
					<template slot-scope="scope">
						<el-button
						  size="mini"
						  @click="look(scope.$index,scope.row)">查看详情
						</el-button>
					</template>
				</el-table-column>

		
      </el-table>
    </div>
    
    <!-- <div class="pagination-container">
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
    </div> -->
  </div>
</template>
<script>

	import {monthTotalCompany} from '@/api/reportData/monthlyCalendar'
  
	function startDateTimestamp(){
			// 获取时间戳 (本月第一天00.00.00  本月最后一天23.59.59)
			var data = new Date(); //本月
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
			
			// dateObject 的月份字段，使用本地时间。返回值是 0（一月） 到 11（十二月） 之间的一个整数。
			// 感谢 xiaoli_ya（https://me.csdn.net/li15735929289）的批评指正
			var data1 = new Date(); // 下月
			if (data.getMonth() == 11){
				data1.setMonth(0)
			}else{
				data1.setMonth(data.getMonth() + 1)
			}
			data1.setDate(1);
			data1.setHours(0);
			data1.setSeconds(0);
			data1.setMinutes(0);
			//console.log('本月第一天0点' + data.getTime())
			//console.log('本月最后一天23点' + data1.getTime())
			// var timeStart = parseInt(data.getTime() / 1000);
			// var timeEnd = parseInt(data1.getTime() / 1000 )- 1;//(计算下月1号时间戳-1即可)
			return data.getTime()
		}
		
		function endDateTimestamp(){
			// 获取时间戳 (本月第一天00.00.00  本月最后一天23.59.59)
			var data = new Date(); //本月
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
			// dateObject 的月份字段，使用本地时间。返回值是 0（一月） 到 11（十二月） 之间的一个整数。
			// 感谢 xiaoli_ya（https://me.csdn.net/li15735929289）的批评指正
			var data1 = new Date(); // 下月
			if (data.getMonth() == 11){
				data1.setMonth(0)
			}else{
				data1.setMonth(data.getMonth() + 1)
			}
			data1.setDate(1);
			data1.setHours(0);
			data1.setSeconds(0);
			data1.setMinutes(0);
			//console.log('本月第一天0点' + data.getTime())
			//console.log('本月最后一天23点' + data1.getTime())
			// var timeStart = parseInt(data.getTime() / 1000);
			// var timeEnd = parseInt(data1.getTime() / 1000 )- 1;//(计算下月1号时间戳-1即可)
			return data1.getTime()-1000
		}
		
		const defaultListQuery = {
		  startDate: startDateTimestamp(),
		  endDate: endDateTimestamp()
		};
		
		
  export default {
    name: "orderList",
    components:{},
    data() {

      return {
				initial:false,
				typeMinimumErrorADay:0,
				typeMissingADay:0,
				typePassADay:0,
				typePendingADay:0,
				typeSeqErrorADay:0,
				
				value: new Date(),
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
      this.getList();
    },
    filters: {

    },
    methods: {
			changeActive(val,$event){
				$event.currentTarget.className="active";
				this.moveGetList(val.day);
			},
			removeActive(val,$event){
				$event.currentTarget.className="";
			},
			allcalendar(val,e){
				//console.log(e)
				var timeDate = new Date(val.day+' '+'00:00:00');
				this.listQuery.startDate=timeDate.getTime();
				this.listQuery.endDate=timeDate.getTime()+(24*60*60*1000-1);
				this.singleGetList(val.day);
			},
			beginDate(){
				const self = this
				return {
				disabledDate(time){
					if (self.listQuery.endDate) {  //如果结束时间不为空，则小于结束时间
					return new Date(self.listQuery.endDate).getTime() < time.getTime()
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
					if (self.listQuery.startDate) {  //如果开始时间不为空，则结束时间大于开始时间
					return new Date(self.listQuery.startDate).getTime() > time.getTime()
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
				
				this.initial=true;
				this.getList();
			},
      getList() {
      	const self = this
        this.listLoading = true;
        monthTotalCompany(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
      		var data = new Date(); //本月
      		for(var i=0;i<this.list.length;i++){
      			//console.log(this.list[i])
      			var typeMinimumErrorSum=0;
      			var typeMissingSum=0;
      			var typePassSum=0;
      			var typePendingSum=0;
      			var typeSeqErrorSum=0;
      			for(var j=0;j<this.list[i].dailyResultList.length;j++){
      				typeMinimumErrorSum+=this.list[i].dailyResultList[j].typeMinimumError;
      				typeMissingSum+=this.list[i].dailyResultList[j].typeMissing;
      				typePassSum+=this.list[i].dailyResultList[j].typePass;
      				typePendingSum+=this.list[i].dailyResultList[j].typePending;
      				typeSeqErrorSum+=this.list[i].dailyResultList[j].typeSeqError;
      			}
      			this.list[i]['typeMinimumErrorSum']=typeMinimumErrorSum;
      			this.list[i]['typeMissingSum']=typeMissingSum;
      			this.list[i]['typePassSum']=typePassSum;
      			this.list[i]['typePendingSum']=typePendingSum;
      			this.list[i]['typeSeqErrorSum']=typeSeqErrorSum;
						if(this.initial==false){
							this.list[i]['dateTime']=data.getFullYear()+'-'+(data.getMonth() + 1);
						}else{
							//console.log(this.listQuery.startDate);
							var startDate=new Date(this.listQuery.startDate);
							var startDateTime=startDate.getFullYear()+'年'+(startDate.getMonth()+1)+'月'+startDate.getDate()+'日';
							
							var endDate=new Date(this.listQuery.endDate);
							var endDateTime=endDate.getFullYear()+'年'+(endDate.getMonth()+1)+'月'+endDate.getDate()+'日';
							this.list[i]['dateTime']=startDateTime+'-'+endDateTime
						}
      			
      		}
      		//console.log(this.list)
          this.total = response.data.total;
        }).catch(function (err) {
      		self.listQuery = Object.assign({}, defaultListQuery);
      	});
      },
			singleGetList(date) {
				const self = this
			  this.listLoading = true;
			  monthTotalCompany(this.listQuery).then(response => {
			    this.listLoading = false;
			    this.list = response.data;
					for(var i=0;i<this.list.length;i++){
						//console.log(this.list[i])
						var typeMinimumErrorSum=0;
						var typeMissingSum=0;
						var typePassSum=0;
						var typePendingSum=0;
						var typeSeqErrorSum=0;
						for(var j=0;j<this.list[i].dailyResultList.length;j++){
							typeMinimumErrorSum+=this.list[i].dailyResultList[j].typeMinimumError;
							typeMissingSum+=this.list[i].dailyResultList[j].typeMissing;
							typePassSum+=this.list[i].dailyResultList[j].typePass;
							typePendingSum+=this.list[i].dailyResultList[j].typePending;
							typeSeqErrorSum+=this.list[i].dailyResultList[j].typeSeqError;
						}
						this.list[i]['typeMinimumErrorSum']=typeMinimumErrorSum;
						this.list[i]['typeMissingSum']=typeMissingSum;
						this.list[i]['typePassSum']=typePassSum;
						this.list[i]['typePendingSum']=typePendingSum;
						this.list[i]['typeSeqErrorSum']=typeSeqErrorSum;
						this.list[i]['dateTime']=date;
					}
					//console.log(this.list)
			    this.total = response.data.total;
			  }).catch(function (err) {
					self.listQuery = Object.assign({}, defaultListQuery);
				});
			},
			moveGetList(val){
				const self = this
				//console.log(val)
				var timeDate = new Date(val+' '+'00:00:00');

				var data={
					startDate:timeDate.getTime(),
					endDate:timeDate.getTime()+(24*60*60*1000-1)
				}
				monthTotalCompany(data).then(response => {
						//console.log(response)
						for(var i=0;i<response.data.length;i++){
							//console.log(response.data[i])
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
						}
						
						var typeMinimumErrorADay=0; 
						var typeMissingADay=0; 
						var typePassADay=0; 
						var typePendingADay=0; 
						var typeSeqErrorADay=0; 
						for(var i=0;i<response.data.length;i++){
							typeMinimumErrorADay+=response.data[i].typeMinimumErrorSum;
							typeMissingADay+=response.data[i].typeMissingSum;
							typePassADay+=response.data[i].typePassSum;
							typePendingADay+=response.data[i].typePendingSum;
							typeSeqErrorADay+=response.data[i].typeSeqErrorSum;
						}
						this.typeMinimumErrorADay=typeMinimumErrorADay;
						this.typeMissingADay=typeMissingADay;
						this.typePassADay=typePassADay;
						this.typePendingADay=typePendingADay;
						this.typeSeqErrorADay=typeSeqErrorADay;

					
				}).catch(function (err) {
					self.listQuery = Object.assign({}, defaultListQuery);
				});
			},
			look(index,row){
				console.log(index)
				console.log(row)
				const dateTimeTimestamp = {
				  startDate: this.listQuery.startDate,
				  endDate: this.listQuery.endDate
				};
				this.$router.push({path: 'reportLine', query: {row:row,dateTimeTimestamp:dateTimeTimestamp,date:row.dateTime}})
			}
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
	.el-calendar-day{ height: auto; padding: 0px;}
	
	.statistics{position: absolute; background: #999; border-radius: 0.4rem;z-index: 999;padding: 5px;left: 0px; top: 40px;width:120px ; display: none;}
	.statistics p{font-size: 12px; height: auto; padding: 0px; line-height: 16px;}
	.statistics span{display: inline-block;width: 80px;}
	.active .statistics{display: block;}
	
</style>


