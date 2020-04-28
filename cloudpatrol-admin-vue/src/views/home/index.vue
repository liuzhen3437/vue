<template>
  <div class="app-container">
    <!-- <el-card >
      <div style="text-align: center">
        <img :src="img_home" width="150px" height="150px" >
      </div>
      <div style="text-align: center">兰德华-巡更产品的领导品牌</div>
      <div style="text-align: center;margin-top: 5px"><span class="color-main">全球十万用户</span>，安全信任之举。</div>
    </el-card> -->
		<el-row :gutter="40" class="panel-group">
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper icon-addressCount">
					  <svg-icon icon-class="addressCount" class-name="card-panel-icon" />
					</div>
					<div class="card-panel-description">
					  <div class="card-panel-text">
					    地点
					  </div>
					  <span style="font-size:20px">{{addressCount}}</span>
					</div>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper icon-people">
					  <svg-icon icon-class="peoples" class-name="card-panel-icon" />
					</div>
					<div class="card-panel-description">
					  <div class="card-panel-text">
					    人员
					  </div>
					  <span style="font-size:20px">{{inspectorCount}}</span>
					</div>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper icon-money">
					  <svg-icon icon-class="deviceCount" class-name="card-panel-icon" />
					</div>
					<div class="card-panel-description">
					  <div class="card-panel-text">
					    设备
					  </div>
					  <span style="font-size:20px">{{deviceCount}}</span>
					</div>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel">
					<div class="card-panel-icon-wrapper icon-shopping">
					  <svg-icon icon-class="planCount" class-name="card-panel-icon" />
					</div>
					<div class="card-panel-description">
					  <div class="card-panel-text">
					    计划
					  </div>
					  <span style="font-size:20px">{{planCount}}</span>
					</div>
				</div>
			</el-col>
		</el-row>
		<div>
			<list-summarizing />	
		</div>
		
		<!-- <div id="homeChart" style="height: 600px;padding: 15px;padding-top:30px;display: flex;justify-content: center;"></div> -->
		<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
		  <line-chart :chart-data="lineChartData" />
		</el-row>
		<el-row :gutter="8">
			<el-col :span="12"><raddar-chart /></el-col>
			<el-col :span="12"><transaction-table /></el-col>
		</el-row>

		
  </div>
</template>

<script>
	import {monthTotalDashboardCount} from '@/api/home/home'
	import RaddarChart from './components/RaddarChart'
	import LineChart from './components/LineChart'
	import ListSummarizing from './components/ListSummarizing'
	import TransactionTable from './components/TransactionTable'
	import { mapGetters } from 'vuex'
	
	var  echarts=require('echarts');
  // import img_home from '@/assets/images/home.png';
	import {chartTotalAddress} from '@/api/reportData/comparison'
	const lineChartData = {
	  newVisitis: {
	    expectedData: [100, 120, 161, 134, 105, 160, 165],
	    actualData: [120, 82, 91, 154, 162, 140, 145]
	  },
	  messages: {
	    expectedData: [200, 192, 120, 144, 160, 130, 140],
	    actualData: [180, 160, 151, 106, 145, 150, 130]
	  },
	  purchases: {
	    expectedData: [80, 100, 121, 104, 105, 90, 100],
	    actualData: [120, 90, 100, 138, 142, 130, 130]
	  },
	  shoppings: {
	    expectedData: [130, 140, 141, 142, 145, 150, 160],
	    actualData: [120, 82, 91, 154, 162, 140, 130]
	  }
	}
	const defaultListQuery = {
	  startDate: new Date(new Date(new Date().toLocaleDateString()).getTime() -24 * 60 * 60 * 1000*7).getTime(),
	  endDate: new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000-1).getTime(),
	};
  export default {
    name: 'home',
		components:{
			RaddarChart,
			LineChart,
			ListSummarizing,
			TransactionTable
		},
		computed: {
    ...mapGetters([
				'roles'
			])
		},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
				sortord:0,
				queryCondition:0,
				lineChartData: lineChartData.newVisitis,
				addressCount:0,// 地点数 ,
				deviceCount:0,// 设备数 ,
				
				inspectorCount:0,// 人员数 ,
				planCount:0,// 计划数 ,
      }
    },
		mounted() {
		  this.$nextTick(() => {
		    
				this.monthTotalDashboardCount()
		  })
		},
    created(){
			console.log(this.roles)
    },
    methods:{
			monthTotalDashboardCount(){
				monthTotalDashboardCount(this.listQuery).then(response => {
					//console.log(response.data)
					this.addressCount=response.data.addressCount;
					this.deviceCount =response.data.deviceCount ;
					this.inspectorCount =response.data.inspectorCount ;
					this.planCount =response.data.planCount ;
				});
			},
    }
  }
	
	
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
			.icon-addressCount{
				background:#FF7F00;
			}
      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #36a3f7
      }
    }
		.icon-addressCount{
			color:#FF7F00;
		}
		
    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #36a3f7
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>