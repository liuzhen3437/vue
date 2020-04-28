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
					<el-form-item label="查询条件：">
					  <el-select v-model="queryCondition" class="input-width" placeholder="全部" clearable>
					    <el-option v-for="item in queryConditionOptions"
					               :key="item.value"
					               :label="item.label"
					               :value="item.value">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item label="排序列：">
					  <el-select v-model="state" class="input-width" placeholder="全部" clearable>
					    <el-option v-for="item in stateOptions"
					               :key="item.value"
					               :label="item.label"
					               :value="item.value">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item label="排序方式：">
					  <el-select v-model="sortord" class="input-width" placeholder="全部" clearable>
					    <el-option v-for="item in sortordOptions"
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
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>

	<div id="homeChart" style="height: 600px;padding: 15px;padding-top:30px;display: flex;justify-content: center;"></div>
  </div>
</template>
<script>
	var  echarts=require('echarts');
	import {chartTotalAddress,chartTotalDevice,chartTotalInspector,chartTotalLine} from '@/api/reportData/comparison'

  const defaultListQuery = {
    startDate: startDateTimestamp(),
    endDate: endDateTimestamp()
  };

  export default {
    name: "orderList",
    components:{},
    data() {
      return {
				startDatePicker: this.beginDate(),
				endDatePicker: this.processDate(),
				stateSort:'',
				state:1,
				stateOptions: [
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
				sortord:0,
				sortordOptions:[
					{
					label: '降序',
					value: 0
					},
					{
					label: '升序',
					value: 1
					}
				],
				queryCondition:0,
				queryConditionOptions:[
						{
						label: '地点',
						value: 0
						},
						{
						label: '设备',
						value: 1
						},
						{
						label: '人员',
						value: 2
						},
						{
						label: '线路',
						value: 3
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
        logisticsDialogVisible:false
      }
    },
    created() {
      this.getList();

    },
		mounted(){
			setTimeout(()=>{
				//初始化  默认是合格降序
				this.DescendingOrder(this.list,'typePass');
				this.chart()
			},200)
		},
    methods: {
			AscendingOrder(array, key) {//升序
				return array.sort(function(a,b){
					let x = Number(a[key])
					let y = Number(b[key])
					return((x<y)?-1:((x>y)?1:0))
				})
			},
			DescendingOrder(array, key) {//降序
				return array.sort(function(a,b){
					let x = Number(a[key])
					let y = Number(b[key])
					return((x<y)?1:((x>y)?-1:0))
				})
			},
			beginDate(){
				const self = this
				return {
				disabledDate(time){
					if (self.listQuery.endDate) {  //如果结束时间不为空，则小于结束时间
					return new Date(self.listQuery.endDate).getTime() < time.getTime() || time.getTime() > Date.now()
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
					if (self.listQuery.startDate) {  //如果开始时间不为空，则结束时间大于开始时间
					return new Date(self.listQuery.startDate).getTime() > time.getTime() || time.getTime() > Date.now()
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
				console.log(this.queryCondition);
				switch(this.queryCondition){
				case 0:
						this.getList();
						break;
				case 1:
						this.chartTotalDevice();
						break;
				case 2:
						this.chartTotalInspector();
						break;
				case 3:
						this.chartTotalLine();
						break;
				};

				console.log(this.state)

				switch(this.state){
				case 0:
						this.stateSort='typePending';//待巡
						break;
				case 1:
						this.stateSort='typePass';//合格
						break;
				case 2:
						this.stateSort='typeMissing';//漏检数
						break;
				case 3:
						this.stateSort='typeSeqError';//错序数
						break;
				case 9:
						this.stateSort='typeMinimumError';//时间不合格数
						break;
				};



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
        chartTotalAddress(self.listQuery).then(response => {
          self.list = response.data;
					self.chart();
        }).catch(function (err) {
					self.listQuery = Object.assign({}, defaultListQuery);
				});
      },
			chartTotalDevice(){
				const self = this
				chartTotalDevice(self.listQuery).then(response => {
				  self.list = response.data;
					console.log(self.list)
					self.chart();
				}).catch(function (err) {
					self.listQuery = Object.assign({}, defaultListQuery);
				});
			},
			chartTotalInspector(){
				const self = this
				chartTotalInspector(self.listQuery).then(response => {
				  self.list = response.data;
					self.chart();
				}).catch(function (err) {
					self.listQuery = Object.assign({}, defaultListQuery);
				});
			},
			chartTotalLine(){
				const self = this
				chartTotalLine(self.listQuery).then(response => {
				  self.list = response.data;
					self.chart();
				}).catch(function (err) {
					self.listQuery = Object.assign({}, defaultListQuery);
				});
			},
			chart(){
				console.log('chart')
				var self=this;
				var myChart=echarts.init(document.getElementById('homeChart'));
						var typeMinimumError = '时间不合格数 ';//
						var typePass   = '合格数';//
						var typeMissing  = '漏检数';//
						var typePending  = '待巡数';//
						var typeSeqError  = '错序数';
				    // 指定图表的配置项和数据
					var option = {
						title : {
								text: '(图例可点选)',//图例可点选
								// subtext: '纯属虚构'
						},
						tooltip : {
								trigger: 'axis'
						},
						legend: {
								data:[typeMinimumError,typePass,typeMissing,typePending,typeSeqError]
						},
						toolbox: {
								show : true,
								feature : {
										dataView : {show: false, readOnly: false},
										magicType : {show: true, type: ['line', 'bar']},
										restore : {show: false},
										saveAsImage : {show: true}
								}
						},
						calculable : true,
						xAxis : [
								{
										type : 'category',
										data : []//统计内容列表名称，例如，按地点排，显示所有地点名称
								}
						],
						yAxis : [
								{
										type : 'value'
								}
						],
						series : [
								{
										name:typeMinimumError,
										type:'bar',
										data:[],
								},
								{
										name:typePass,
										type:'bar',
										data:[],
								},
								{
										name:typeMissing,
										type:'bar',
										data:[],
								},
								{
										name:typePending,
										type:'bar',
										data:[],
								},
								{
										name:typeSeqError,
										type:'bar',
										data:[],
								},
						],
					}

					console.log(self.sortord)
					switch(self.sortord){
					case 0:
							self.DescendingOrder(self.list,self.stateSort);
							break;
					case 1:
							self.AscendingOrder(self.list,self.stateSort);
							break;
					};
					var ContrastData=self.list;
					console.log(self.list);

					option.xAxis[0].data.length = ContrastData.length;
					var seriesLen = option.series.length;
					for(var j = 0;j < seriesLen;j++)
					{
						option.series[j].data.length = ContrastData.length;
					}
					for(var i = 0;i < ContrastData.length;i++)
					{
							switch(this.queryCondition){
							case 0:
									option.xAxis[0].data[i] = ContrastData[i].addressName;//地点
									break;
							case 1:
									option.xAxis[0].data[i] = ContrastData[i].deviceName;//设备
									break;
							case 2:
									option.xAxis[0].data[i] = ContrastData[i].inspectorName;//人员
									break;
							case 3:
									option.xAxis[0].data[i] = ContrastData[i].lineName;//线路
									break;
							}

							option.series[0].data[i] = ContrastData[i].typeMinimumError ;
							option.series[1].data[i] = ContrastData[i].typePass ;
							option.series[2].data[i] = ContrastData[i].typeMissing ;
							option.series[3].data[i] = ContrastData[i].typePending;
							option.series[4].data[i] = ContrastData[i].typeSeqError ;
					}
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption(option);
			},

    }
  }

	function startDateTimestamp(){

			var data = new Date(); //本月
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);

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
			return data.getTime()
		}

		function endDateTimestamp(){
			var data = new Date(); //本月
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
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
			return data1.getTime()-1000
		}
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>
