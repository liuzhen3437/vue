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
        <el-button style="float:right;margin-right: 15px" type="success" @click="getPdf()">
        	导出pdf
        </el-button>
        <el-button style="float:right;margin-right: 15px" type="success" @click="exportExcel()">
        	导出excel
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
			<el-form-item label="开始时间"  >
				<div class="input-width">
					<el-date-picker v-model="listQuery.startDate"  format="yyyy-MM-dd"  clearable style="width: 100%"
							  :picker-options="startDatePicker"  type="date"  placeholder="选择开始日期" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="结束时间" >
				<div class="input-width">
					<el-date-picker v-model="listQuery.endDate"  format="yyyy-MM-dd"  clearable style="width: 100%"
							  :picker-options="endDatePicker"   type="date"  placeholder="选择结束日期" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>

        </el-form>

      </div>
    </el-card>
<div id="pdfDom" style="padding-bottom: 50px;">
		<div style="width: 80%; margin: 0 auto">
			<el-card class="operate-container" shadow="never" align="center">
				<el-calendar :range="rangeDate">
					<!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
					<template
						slot="dateCell"
						slot-scope="{date, data}">
						<div :class="data.isSelected ? 'is-selected' : ''" v-on:click="allcalendar(data,$event)"  style="padding: 8px; height: 85px;margin: 0px; position: relative;" @mouseenter="changeActive(data,$event)" @mouseleave="removeActive(data,$event)">
							{{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
							<div class="statistics" v-if="limit">
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
                id="out-table"
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
 import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
	import {monthTotalCompany} from '@/api/reportData/monthlyCalendar'

	var nowDate = new Date();
	var cloneNowDate = new Date();
	var fullYear = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1; // getMonth 方法返回 0-11，代表1-12月
	var endOfMonth = new Date(fullYear, month, 0).getDate(); // 获取本月最后一天
	function getFullDate(targetDate) {
		var D, y, m, d;
		if (targetDate) {
			D = new Date(targetDate);
			y = D.getFullYear();
			m = D.getMonth() + 1;
			d = D.getDate();
		} else {
			y = fullYear;
			m = month;
			d = date;
		}
		m = m > 9 ? m : '0' + m;
		d = d > 9 ? d : '0' + d;
		return y + '-' + m + '-' + d;
	};

		function startDateTimestamp(){
			var starDate = getFullDate(cloneNowDate.setDate(1));//当月第一天
			let d = new Date(starDate+' '+'00:00');
			let t = d.getTime(d);
			return t
		}

		function endDateTimestamp(){
			// var endDate = getFullDate(cloneNowDate.setDate(endOfMonth));//当月最后一天
			// let d = new Date(endDate+' '+'00:00');
			// let t = d.getTime(d);
       //明天的时间
      var day = new Date(new Date().toLocaleDateString()).getTime();

      var getTime=day+24*60*60*1000;
      console.log(getTime)
			return getTime
		}

    function getMonDayAndSunDay(datevalue) {
        let dateValue = datevalue;
        let arr = dateValue.split("-");
        //月份-1 因为月份从0开始 构造一个Date对象
        let date = new Date(arr[0], arr[1] - 1, arr[2]);
        let dateOfWeek = date.getDay();//返回当前日期的在当前周的某一天（0～6--周日到周一）
        let dateOfWeekInt = parseInt(dateOfWeek, 10);//转换为整型
        if (dateOfWeekInt == 0) {//如果是周日
            dateOfWeekInt = 7;
        }
        let aa = 7 - dateOfWeekInt;//当前于周末相差的天数
        let temp2 = parseInt(arr[2], 10);//按10进制转换，以免遇到08和09的时候转换成0
        let sunDay = temp2 + aa;//当前日期的周日的日期
        let monDay = sunDay - 6;//当前日期的周一的日期
        let startDate = new Date(arr[0], arr[1] - 1, monDay);
        let endDate = new Date(arr[0], arr[1] - 1, sunDay);
        let sm = parseInt(startDate.getMonth()) + 1;//月份+1 因为月份从0开始
        let em = parseInt(endDate.getMonth()) + 1;
        //  alert("星期一的日期："+startDate.getFullYear()+"-"+sm+"-"+startDate.getDate());
        //  alert("星期日的日期："+endDate.getFullYear()+"-"+em+"-"+endDate.getDate());
        let start = startDate.getFullYear() + "-" + sm + "-" + startDate.getDate();
        let end = endDate.getFullYear() + "-" + em + "-" + endDate.getDate();
        let result = [];
        result.push(start);
        result.push(end);

        return result;
    }


    function rangeDate(){
      var now = new Date();
      var nowTime = now.getTime() ;
      var day = now.getDay();
      console.log(nowTime)
      console.log(day)
      var oneDayTime = 24*60*60*1000 ;
      var MondayTime = (nowTime - (day-1)*oneDayTime)-7*oneDayTime ;//显示周一
      var SundayTime =  nowTime + (7-day)*oneDayTime ;//显示周日
      var getFullYear=new Date(MondayTime).getFullYear();
      var getMonth=new Date(MondayTime).getMonth()+1;
      var getDate=new Date(MondayTime).getDate();
      var date=getFullYear+'-'+getMonth+'-'+getDate;

      var getFullYearSundayTime=new Date(SundayTime).getFullYear();
      var getMonthSundayTime=new Date(SundayTime).getMonth()+1;
      var getDateSundayTime=new Date(SundayTime).getDate();
      var dateSundayTime=getFullYearSundayTime+'-'+getMonthSundayTime+'-'+getDateSundayTime;
      console.log(date)
      var arr=[date,dateSundayTime]
      return arr
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
				htmlTitle:'月历报表',
				limit:false,
				initial:false,
				typeMinimumErrorADay:0,
				typeMissingADay:0,
				typePassADay:0,
				typePendingADay:0,
				typeSeqErrorADay:0,

				value: new Date(),
				startDatePicker: this.beginDate(),
				endDatePicker: this.processDate(),
        rangeDate:rangeDate(),
        listQuery: Object.assign({}, defaultListQuery),
		scopelist:Object.assign({}, defaultListQuery),
		scopeData:null,
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
		startDateTimestamp()
      this.getList();
	  this.scope();
    },
    filters: {

    },
    methods: {
      exportExcel () {
               /* out-table关联导出的dom节点  */
               var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
               /* get binary string as output */
               var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
               try {
                   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '月历报表.xlsx')
               } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
               return wbout
           },

		downLoad(){
		  this.getPdf();//参数是下载的pdf文件名
		},
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
					return new Date(self.listQuery.endDate).getTime() < time.getTime()||time.getTime() < new Date(self.listQuery.endDate).getTime() - (30 * 24 * 60 * 60 * 1000)*1
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

            return new Date(self.listQuery.startDate).getTime() > time.getTime()||time.getTime() > new Date(self.listQuery.startDate).getTime() + (30 * 24 * 60 * 60 * 1000)*1||time.getTime() > endDateTimestamp();
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

        console.log(this.listQuery.startDate)
        console.log(this.listQuery.endDate)
        var Monday=new Date(this.listQuery.startDate)
        var Sunday=new Date(this.listQuery.endDate)
        var Mondaydate=getMonDayAndSunDay(Monday.getFullYear()+'-'+(Monday.getMonth()+1)+'-'+Monday.getDate())[0]
        var Sundaydate=getMonDayAndSunDay(Sunday.getFullYear()+'-'+(Sunday.getMonth()+1)+'-'+Sunday.getDate())[1]
        var arr=[Mondaydate,Sundaydate];
        console.log(arr)
        this.rangeDate=arr;


				this.initial=true;
				this.getList();
			},
			scope(){
				const self = this
				monthTotalCompany(this.scopelist).then(response => {
				  this.scopeData = response.data;
					var data = new Date(); //本月
					for(var i=0;i<this.scopeData.length;i++){
						//console.log(this.list[i])
						var typeMinimumErrorSum=0;
						var typeMissingSum=0;
						var typePassSum=0;
						var typePendingSum=0;
						var typeSeqErrorSum=0;
						for(var j=0;j<this.scopeData[i].dailyResultList.length;j++){
							typeMinimumErrorSum+=this.scopeData[i].dailyResultList[j].typeMinimumError;
							typeMissingSum+=this.scopeData[i].dailyResultList[j].typeMissing;
							typePassSum+=this.scopeData[i].dailyResultList[j].typePass;
							typePendingSum+=this.scopeData[i].dailyResultList[j].typePending;
							typeSeqErrorSum+=this.scopeData[i].dailyResultList[j].typeSeqError;
						}
						this.scopeData[i]['typeMinimumErrorSum']=typeMinimumErrorSum;
						this.scopeData[i]['typeMissingSum']=typeMissingSum;
						this.scopeData[i]['typePassSum']=typePassSum;
						this.scopeData[i]['typePendingSum']=typePendingSum;
						this.scopeData[i]['typeSeqErrorSum']=typeSeqErrorSum;
					}
					console.log(this.scopeData)
				  this.total = response.data.total;
				}).catch(function (err) {
					self.scopelist = Object.assign({}, defaultListQuery);
				});
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
				console.log(val);
				let d = new Date(val+' '+'00:00');
				let t = d.getTime(d);
				console.log(this.listQuery.startDate)
				console.log(t)
				console.log(this.listQuery.endDate)
				var response=this.scopeData;
				console.log(t>=this.listQuery.startDate&&t<=this.listQuery.endDate)
				if(t>=this.listQuery.startDate&&t<=this.listQuery.endDate){
					this.limit=true
				}else{
					this.limit=false
				}
				for(var i=0;i<response.length;i++){
					var typeMinimumErrorSum=0;
					var typeMissingSum=0;
					var typePassSum=0;
					var typePendingSum=0;
					var typeSeqErrorSum=0;
					for(var j=0;j<response[i].dailyResultList.length;j++){
						if(response[i].dailyResultList[j].dateTime==t){
							typeMinimumErrorSum+=response[i].dailyResultList[j].typeMinimumError;
							typeMissingSum+=response[i].dailyResultList[j].typeMissing;
							typePassSum+=response[i].dailyResultList[j].typePass;
							typePendingSum+=response[i].dailyResultList[j].typePending;
							typeSeqErrorSum+=response[i].dailyResultList[j].typeSeqError;
						}
					}
					response[i]['typeMinimumErrorSum']=typeMinimumErrorSum;
					response[i]['typeMissingSum']=typeMissingSum;
					response[i]['typePassSum']=typePassSum;
					response[i]['typePendingSum']=typePendingSum;
					response[i]['typeSeqErrorSum']=typeSeqErrorSum;
				}
				console.log(this.scopeData)
				console.log(response)
				var typeMinimumErrorADay=0;
				var typeMissingADay=0;
				var typePassADay=0;
				var typePendingADay=0;
				var typeSeqErrorADay=0;
				for(var i=0;i<response.length;i++){
					typeMinimumErrorADay+=response[i].typeMinimumErrorSum;
					typeMissingADay+=response[i].typeMissingSum;
					typePassADay+=response[i].typePassSum;
					typePendingADay+=response[i].typePendingSum;
					typeSeqErrorADay+=response[i].typeSeqErrorSum;
				}
				this.typeMinimumErrorADay=typeMinimumErrorADay;
				this.typeMissingADay=typeMissingADay;
				this.typePassADay=typePassADay;
				this.typePendingADay=typePendingADay;
				this.typeSeqErrorADay=typeSeqErrorADay;
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
.el-card{overflow: inherit;}
</style>
