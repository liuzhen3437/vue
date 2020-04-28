<template>
<div>
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
					<el-form-item label="计划：" prop="companyId" >
						<el-select 
							v-model="listQuery.planId"
							@change="selectTrigger"
							placeholder="请选择计划">
							<el-option
								v-for="item in planList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备：" prop="companyId" >
						<el-select 
							v-model="listQuery.deviceId"
							placeholder="请选择设备">
							<el-option
								v-for="item in equipmentList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="圈数 ：" prop="companyId" >
						<el-select 
						 :disabled="disabled"
							v-model="listQuery.roundSeq"
							placeholder="请选择圈数">
							<el-option
								v-for="item in numberList"
								:key="item.id"
								:label="item.name"
								:value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择日期"  >
						<div class="input-width">
							<el-date-picker v-model="listQuery.startDate"  format="yyyy-MM-dd HH:mm:ss"  clearable style="width: 100%"
									  :picker-options="startDatePicker"  type="datetime"  placeholder="选择日期" value-format="timestamp">
							</el-date-picker>
						</div>
					</el-form-item>
				</el-form>
		  </div>
		</el-card>
	</div>
    <div class="amap-page-container" style="width: 100%; height: 50vh;">
      <!-- <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager"  :center="center" :zoom="zoom" :plugin="plugin"  class="amap-demo">
				<el-amap-polyline :editable="polyline.editable"  :path="polyline.path" :events="polyline.events"></el-amap-polyline>
			</el-amap> -->
			<div style="height:500px" id="container" tabindex="0"></div>
    </div>

	</div>
  </template>


<style>
    .amap-demo {
      height: 300px;
    }

    .search-box {
      position: absolute;
      top: 10px;
      left: 70px;
    }
    .el-vue-search-box-container{position: absolute !important;}

    .amap-page-container {
      position: relative;
    }
  </style>
  <script>
		import Vue from 'vue'
		import {formatDate} from '@/utils/date';
		import {fetchList} from '@/api/setting/PlanSetUp'
		import {deviceEventList} from '@/api/setting/equipment'
		import {taskTrackList} from '@/api/reportData/historicalRoute' 
		 
    // import AMap from "vue-amap";
    // Vue.use(AMap);
    // AMap.initAMapApiLoader({
    //   key: "5e9626bffdee967b9f32a39b84fc278b",
    //   plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType",'AMap.Geolocation'],
    //   uiVersion: "1.0.11", // ui库版本，不配置不加载,
    //   v: "1.4.4"
    // });
	
	import AMap from 'AMap'
		
		const defaultList = {
		  planId:null,
		  deviceId:null,
		  roundSeq:null,
			startDate:null
		};
		
	// import AMap from "vue-amap";
	// let amapManager = new AMap.AMapManager();
    export default {
      name: 'site',
			data(){
        let self = this;
					return{
						startDatePicker: {
							disabledDate(date) {
									return date.getTime() >= Date.now();
							}
						},
						
					
						listQuery:Object.assign({}, defaultList),
						
						disabled:true, 
						planList: [],
						equipmentList:[],
						numberList:[],
						
						
					}
			},
			created() {
				this.getList()

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
			mounted () {
			  this.init()

			},
			methods: {


				init: function () {
				  var  map = new AMap.Map('container', {
					  resizeEnable: true, //是否监控地图容器尺寸变化
					  zoom: 12, //初始地图级别
					  //center: [121.498586, 31.239637], //初始地图中心点
					  showIndoorMap: false //关闭室内地图
					});
				},

				getList() {
				  fetchList({pageNum: 1, pageSize: 100}).then(response => {
				    this.planList = response.data.list;
				  });
					deviceEventList({pageNum: 1, pageSize: 100}).then(response => {
					  this.equipmentList = response.data.list;
					});
					
				},
				selectTrigger(val){
					console.log(val)
					console.log(this.planList)
					var lineCycleTimes;
					for(var i=0;i<this.planList.length;i++){
						if(this.planList[i].id==val){
							lineCycleTimes=this.planList[i].lineCycleTimes
						}
					}
					
					var arr2 = new Array();
					for(var i=0;i<lineCycleTimes;i++){
						arr2.push(i+1);
					}
					this.disabled=false
					this.numberList=arr2;
				},
				
				handleSearchList(){
					console.log(this.listQuery);
					taskTrackList(this.listQuery).then(response => {
					  console.log(response)
					  if(response.code==200&&response.data.length>0){
						var arr=[];
						for(var i =0;i<response.data.length;i+=1){
							arr[i] = new Object(); 
							arr[i].x=parseFloat(response.data[i].gpsX);
							arr[i].y=parseFloat(response.data[i].gpsY);
							arr[i].sp=response.data[i].gpsSpeed;
							arr[i].ag=response.data[i].gpsAngle;
							arr[i].tm=response.data[i].createTime;
						} 
						console.log(arr)
						var map = new AMap.Map('container', {
							  resizeEnable: true
						});
						var graspRoad;
						if(!graspRoad) {
							graspRoad = new AMap.GraspRoad()
						}
						graspRoad.driving(arr,function(error,result){
						  if(!error){
							var path2 = [];
							var newPath = result.data.points;
							for(var i =0;i<newPath.length;i+=1){
							  path2.push([newPath[i].x,newPath[i].y])
							}
							var newLine = new AMap.Polyline({
							  path:path2,
							  strokeWeight:8,
							  strokeOpacity:0.8,
							  strokeColor:'#0091ea',
							  showDir:true
							})
							map.add(newLine)
							map.setFitView()
						  }
						})
					  }else{
						  
					  }
							
					});
				}
      }
    };
</script>
