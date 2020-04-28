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
				</el-form>
		  </div>
		</el-card>
	</div>
    <div class="amap-page-container" style="width: 100%; height: 50vh;">
		<el-amap ref="map" vid="amapDemo" :amap-manager="amapManager"  :center="center" :zoom="zoom" :plugin="plugin"  class="amap-demo">
				<el-amap-marker vid="amapDemo" :position="center" v-if="amapDemo"></el-amap-marker>
		</el-amap>
    </div>

	</div>
  </template>


<style>
    .amap-demo {
      height: 60vh;
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
		import {deviceEventList} from '@/api/setting/equipment'
		import {lastPoint} from '@/api/reportData/historicalRoute'

    import AMap from "vue-amap";
    import AMap1 from "AMap";
    Vue.use(AMap);
    AMap.initAMapApiLoader({
      key: "5e9626bffdee967b9f32a39b84fc278b",
      plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType",'AMap.Geolocation'],
      uiVersion: "1.0.11", // ui库版本，不配置不加载,
      v: "1.4.4"
    });

		const defaultList = {

		  deviceId:null,

		};

	// import AMap from "vue-amap";
	let amapManager = new AMap.AMapManager();
    export default {
      name: 'site',
			data(){
        let self = this;
					return{


						amapManager,
						listQuery:Object.assign({}, defaultList),


						amapDemo:false,
						equipmentList:[],

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
				this.getList();

			},
      mounted(){
        this.getMap()
      },
      methods: {
        getMap() {
          var self=this;
          AMap1.plugin('AMap.CitySearch', function () {
            var citySearch = new AMap1.CitySearch()
            citySearch.getLocalCity(function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                console.log(result)
                // 查询成功，result即为当前所在城市信息
                var resultArr=result.rectangle.split(";");
                var Arr=resultArr[1].split(",")
                self.center=[result.bounds.xc.lng,result.bounds.xc.lat];
              }
            })
          })

        },

		getList() {

			deviceEventList({pageNum: 1, pageSize: 100}).then(response => {
			  this.equipmentList = response.data.list;
			});

		},

		handleSearchList(){
			console.log(this.listQuery);

			lastPoint(this.listQuery).then(response => {
			  console.log(response)
			  if(response.code==200){

				this.center=[response.data.gpsX,response.data.gpsY];
				this.amapDemo=true
			  }else{

			  }

			});
		}
      }
    };
</script>
