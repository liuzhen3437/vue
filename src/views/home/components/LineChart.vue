<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
var  echarts=require('echarts');
import {monthTotalDashboard} from '@/api/home/home'


const defaultListQuery = {
	  startDate: new Date(new Date(new Date().toLocaleDateString()).getTime() -24 * 60 * 60 * 1000*7).getTime(),
	  endDate: new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000-1).getTime(),
	};

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
			listQuery: Object.assign({}, defaultListQuery),
			dateArr:[],
			listDate:[

			]
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
				console.log(val)
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {

			this.monthTotalDashboard()
    })
		// window.onresize = () => {
		// 	this.chart.resize();
	 // };


  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
		monthTotalDashboard(){
			monthTotalDashboard(this.listQuery).then(response => {
				console.log(response.data)
				var dateList=response.data;
				var arr=[];
				var typeMinimumErrorArr=[];
				var typeMissingArr=[];
				var typePassArr=[];
				var typeSeqErrorArr=[];
				for(var i=0;i<dateList.length;i++){
					arr.push(this.timestampToTime(dateList[i].dateTime));
					typeMinimumErrorArr.push(dateList[i].typeMinimumError)
					typeMissingArr.push(dateList[i].typeMissing)
					typePassArr.push(dateList[i].typePass)
					typeSeqErrorArr.push(dateList[i].typeSeqError)
				}
				this.dateArr=arr;


				this.initChart(typeMinimumErrorArr,typeMissingArr,typePassArr,typeSeqErrorArr);
			});
		},
    initChart(typeMinimumErrorArr,typeMissingArr,typePassArr,typeSeqErrorArr) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(typeMinimumErrorArr,typeMissingArr,typePassArr,typeSeqErrorArr)
    },
    setOptions(typeMinimumErrorArr,typeMissingArr,typePassArr,typeSeqErrorArr) {
      this.chart.setOption({
        xAxis: {
          data: this.dateArr,
          boundaryGap: false,
          axisTick: {
            show: false
          },
					nameLocation:'end',//坐标轴名称显示位置。
            // axisLabel : {//坐标轴刻度标签的相关设置。
            //     formatter: function(params) {
            //     var newParamsName = ''
            //     var paramsNameNumber = params.length
            //     var provideNumber = 5
            //     var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
            //     for (let row = 0; row < rowNumber; row++) {
            //       newParamsName +=
            //         params.substring(
            //           row * provideNumber,
            //           (row + 1) * provideNumber
            //         ) + '\n'
            //     }
            //     return newParamsName
            //   }
            // }

        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['时间不合格数', '漏检数', '合格数', '错序数']
        },
        series: [{
          name: '时间不合格数',
					itemStyle: {
            normal: {
              color: '#008000',
              lineStyle: {
                color: '#008000',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: typeMinimumErrorArr,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '漏检数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FF0000',
              lineStyle: {
                color: '#FF0000',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: typeMissingArr,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },{
          name: '合格数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: typePassArr,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },{
          name: '错序数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FFFF00',
              lineStyle: {
                color: '#FFFF00',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: typeSeqErrorArr,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
		timestampToTime (row, column) {
        var date = new Date(row) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return M+D
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
