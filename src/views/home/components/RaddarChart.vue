<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
var  echarts=require('echarts');
import {listHighrisk} from '@/api/home/home'
const animationDuration = 3000
const defaultListQuery = {
	  startDate: new Date(new Date(new Date().toLocaleDateString()).getTime() -24 * 60 * 60 * 1000*7).getTime(),
	  endDate: new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000-1).getTime(),
		pageNum:1,
		pageSize:10
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
    }
  },
  data() {
    return {
      chart: null,
			listQuery: Object.assign({}, defaultListQuery),
			chartDate:[],
			legendDate:[],
			max:null
    }
  },
  mounted() {
    this.$nextTick(() => {
			this.listHighrisk();
      
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
		listHighrisk(){
			listHighrisk(this.listQuery).then(response => {
				var list=response.data.list
				var arr=[];
				var numberArr=[];
				for(var i=0;i<list.length;i++){
					 var valueArr=[];
					 arr[i] = new Object(); 
					 valueArr.push(list[i].riskRateForChartValue);
					 valueArr.push(list[i].typeMinimumErrorForChartValue);
					 valueArr.push(list[i].typeMissingForChartValue);
					 valueArr.push(list[i].typeSeqErrorForChartValue);
					 valueArr.push(list[i].typeUnusualForChartValue);
					 
					 numberArr.push(list[i].riskRate);
					 numberArr.push(list[i].typeMinimumError);
					 numberArr.push(list[i].typeMissing);
					 numberArr.push(list[i].typeSeqError);
					 numberArr.push(list[i].typeUnusual);
					 
					 arr[i].name=list[i].addressName;
					 arr[i].value=valueArr;
					 this.legendDate.push(list[i].addressName)
				}
				this.max=Math.max(...numberArr)
				this.chartDate=arr;
				//console.log(this.chartDate)
				this.initChart();
			});
		},
    initChart() {
			var self=this;
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '高危概率', max: 100 },
            { name: '时间不合格数', max: 100 },
            { name: '漏检数', max: 100 },
            { name: '错序数', max: 100 },
            { name: '异常次数', max: 100 },
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.legendDate
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: self.chartDate,
          animationDuration: animationDuration
        }]
      })
			//console.log(self.chartDate)
    }
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
