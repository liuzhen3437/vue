<template>
	<div>
  <el-row :gutter="40" class="panel-group">
  	<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="jump()">
				<div class="card-panel-icon-wrapper icon-taskPointCount">
				  <svg-icon icon-class="taskPointCount" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
				  <div class="card-panel-text">
				    应寻数
				  </div>
				  <span style="font-size:20px">{{taskPointCount}}</span>
				</div>
			</div>
  	</el-col>
  	<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="jump()">
				<div class="card-panel-icon-wrapper icon-taskPointFaildCount">
				  <svg-icon icon-class="taskPointFaildCount" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
				  <div class="card-panel-text">
				    不合格数
				  </div>
				  <span style="font-size:20px">{{taskPointFaildCount}}</span>
				</div>
			</div>
  	</el-col>
  	<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="jump()">
				<div class="card-panel-icon-wrapper icon-eventCount">
				  <svg-icon icon-class="eventCount" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
				  <div class="card-panel-text">
				    事件数
				  </div>
				  <span style="font-size:20px">{{eventCount}}</span>
				</div>
			</div>
  	</el-col>
  	<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
			<div class="card-panel" @click="jump()">
				<div class="card-panel-icon-wrapper icon-recordCount">
				  <svg-icon icon-class="recordCount" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
				  <div class="card-panel-text">
				    记录数
				  </div>
				  <span style="font-size:20px">{{recordCount}}</span>
				</div>
			</div>
  	</el-col>
  </el-row>
	</div>
</template>

<script>
// import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
// import resize from './mixins/resize'
import {monthTotalDashboardCount} from '@/api/home/home'
const defaultListQuery = {
	  startDate: new Date(new Date(new Date().toLocaleDateString()).getTime() -24 * 60 * 60 * 1000*7).getTime(),
	  endDate: new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000-1).getTime(),
	};

export default {
  props: {
  },
  data() {
    return {
			listQuery: Object.assign({}, defaultListQuery),

			eventCount:0,//事件数 ,
			recordCount:0,
			taskPointCount:0,
			taskPointFaildCount :0,

    }
  },
  watch: {

  },
  mounted() {
    this.$nextTick(() => {

			this.monthTotalDashboardCount()
    })
  },
  methods: {
		monthTotalDashboardCount(){
			monthTotalDashboardCount(this.listQuery).then(response => {
				//console.log(response.data)
				this.eventCount=response.data.eventCount;
				this.recordCount =response.data.recordCount ;
				this.taskPointCount =response.data.taskPointCount ;
				this.taskPointFaildCount =response.data.taskPointFaildCount ;
			});
		},
    jump(){
      this.$router.push({path: '/data/inspectionRecords'})
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

      .icon-taskPointCount {

        background: #40c9c6;
      }

      .icon-taskPointFaildCount {

        background: #f4516c;
      }

      .icon-eventCount {
        background: #FF7F00 ;

      }

      .icon-recordCount {
        background: #36a3f7
      }
    }

    .icon-taskPointCount {
      color: #40c9c6;
    }

    .icon-taskPointFaildCount {
      color: #f4516c;
    }

    .icon-eventCount {
      color: #FF7F00 ;
    }

    .icon-recordCount {
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
