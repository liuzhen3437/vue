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
      <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager"  :center="center" :zoom="zoom" :plugin="plugin"  class="amap-demo">
				<el-amap-polyline :editable="polyline.editable"  :path="polyline.path" :events="polyline.events"></el-amap-polyline>
			</el-amap>
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
		 
    import AMap from "vue-amap";
    Vue.use(AMap);
    AMap.initAMapApiLoader({
      key: "5e9626bffdee967b9f32a39b84fc278b",
      plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType",'AMap.Geolocation'],
      uiVersion: "1.0.11", // ui库版本，不配置不加载,
      v: "1.4.4"
    });
		
		const defaultList = {
		  planId:null,
		  deviceId:null,
		  roundSeq:null,
			startDate:null
		};
		
	// import AMap from "vue-amap";
	let amapManager = new AMap.AMapManager();
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
						
						amapManager,
						listQuery:Object.assign({}, defaultList),
						
						disabled:true, 
						planList: [],
						equipmentList:[],
						numberList:[],
						zoom: 16,
						center: [116.478935,39.997761],
						polyline: {
							path: [],
							events: {
								click(e) {
									alert('click polyline');
								},
								end: (e) => {
									let newPath = e.target.getPath().map(point => [point.lng, point.lat]);
									console.log(newPath);
								}
							},
							
							editable: false
						},
						plugin: [
							{
							          pName: 'Geolocation',   //定位
							          events: {
							            init(o) {
							              // o 是高德地图定位插件实例
							              o.getCityInfo((status, result) => {
						                  console.log(result)
						
							                  // self.lng = result.position.lng;             //设置经度
							                  // self.lat = result.position.lat;             //设置维度
							                  self.center = [result.center[0],result.center[1]];         //设置坐标
							                  self.loaded = true;                         //load
							                  self.$nextTick();                           //页面渲染好后
						
							              })
							            }
							          }
							        },
						
						],
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
      methods: {
        getMap() {
          // amap vue component
          console.log(amapManager._componentMap);
          // gaode map instance
          console.log(amapManager._map);
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
				addMarker: function() {
          let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
          let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
          this.markers.push([lng, lat]);
        },
				onSearchResult(pois) {
					console.log(pois)
          let latSum = 0;
          let lngSum = 0;
          if (pois.length > 0) {
            pois.forEach(poi => {
              let {lng, lat} = poi;
              lngSum += lng;
              latSum += lat;
              this.markers.push([poi.lng, poi.lat]);
            });
            let center = {
              lng: lngSum / pois.length,
              lat: latSum / pois.length
            };
            this.center = [center.lng, center.lat];
          }
        },
		handleSearchList(){
			console.log(this.listQuery);
			taskTrackList(this.listQuery).then(response => {
			  console.log(response)
			  if(response.code==200&&response.data.length>0){
				var path1 = [];
				for(var i=0;i<response.data.length;i+=1){
					path1.push([response.data[i].gpsX,response.data[i].gpsY])
				}
				this.polyline.path=path1;

				this.center=[response.data[0].gpsX,response.data[0].gpsY]
			  }else{
				  
			  }
					
			});
		}
      }
    };
</script>
