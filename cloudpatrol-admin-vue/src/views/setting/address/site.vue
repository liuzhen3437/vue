<template>
<div>
    <div class="amap-page-container" style="width: 100%; height: 70vh;">
			<el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager"  :center="center" :zoom="zoom" :plugin="plugin"
				:events="events" class="amap-demo">
				<el-amap-marker vid="amapDemo" :position="center" v-if="amapDemo"></el-amap-marker>
        <el-amap-circle   :center="center" v-if="amapDemo" :radius="address.gpsRadius" fill-opacity="0.5" ></el-amap-circle>
			</el-amap>
    </div>

    <el-row  style="margin-top: 15px">
      <el-form :inline="true" :model="address" size="small" label-width="140px">
      <el-form-item label="围栏半径：">
        <el-input v-model="address.gpsRadius" class="input-width" placeholder="围栏半径"></el-input>
      </el-form-item>
      </el-form>
    </el-row>
		<el-row style="text-align: center;margin-top: 20px;">
			<el-button type="primary" @click="save">保存</el-button>
			<el-button type="info" @click="cancel">返回</el-button>
		</el-row>
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

    import VueAMap from "vue-amap";
    Vue.use(VueAMap);
    VueAMap.initAMapApiLoader({
      key: "5e9626bffdee967b9f32a39b84fc278b",
      plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType",'AMap.Geolocation'],
      uiVersion: "1.0.11", // ui库版本，不配置不加载,
      v: "1.4.4"
    });
		import {getAddress, updateAddress} from '@/api/address'
    // NPM 方式
    // import { AMapManager } from 'vue-amap';
    // CDN 方式
	import {fetchList} from '@/api/address'
	// import AMap from "vue-amap";
	let amapManager = new VueAMap.AMapManager();
    export default {
      name: 'site',
			data(){
        let self = this;
					return{
						amapManager,
						zoom: 12,
						amapDemo:false,
						center: [116.434784, 39.850959],
						events: {
							init: o => {
								console.log(o.getCenter());
								// console.log(this.$refs.map.$$getInstance());
								o.getCity(result => {
									console.log(result);
								});
							},
							moveend: () => {},
							zoomchange: () => {},
							click: e => {
								console.log(e);
								self.amapDemo=true
								self.center = [e.lnglat.lng, e.lnglat.lat];//点击选择新地址为中心点
								const msg = {
									key: "5e9626bffdee967b9f32a39b84fc278b",
									location: self.center.join()
								};

							},
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
						address:{
              gpsRadius:1000
            },
						radio:null,
						total: null,
						listQuery: {
						  state: 1,
						  pageNum: 1,
						  pageSize: 10
						},
						listLoading: false,
						list: null,
						activeName: 'first',
						markers: [
							[121.59996, 31.197646],
							[121.40018, 31.197622],
							[121.69991, 31.207649]
						],
						searchOption: {
							city: '',
							citylimit: false
						},
						mapCenter: [121.59996, 31.197646]
					}
			},
			created() {
					getAddress(this.$route.query.id).then(response => {
						this.address = response.data;
						console.log(this.address)

            if(this.address.gpsX!=null&&this.address.gpsY!==null){

            	this.center = [this.address.gpsX, this.address.gpsY];
            	this.amapDemo=true
            }else{
            	this.$message('未设置点标记');
            	this.amapDemo=false
            }
						
						if(this.address.gpsRadius==null){
							this.address.gpsRadius=1000
						}
					});
			  // this.getList();
			},
      methods: {
        getMap() {
          // amap vue component
          console.log(amapManager._componentMap);
          // gaode map instance
          console.log(amapManager._map);
        },
				getList() {
				  this.listLoading = true;
				  fetchList(this.listQuery).then(response => {
				    this.listLoading = false;
				    this.list = response.data.list;
						console.log(this.list)
				  });
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
				handleSizeChange(val) {
				  this.listQuery.pageNum = 1;
				  this.listQuery.pageSize = val;
				  this.getList();
				},
				handleCurrentChange(val) {
				  this.listQuery.pageNum = val;
				  this.getList();
				},
				clickRow(row,event,column){
					this.amapDemo=true
					if(event.target.nodeName!="INPUT"){
						this.radio=row.id;
						if(row.gpsInfo.indexOf(",") != -1){
							var strs = new Array(); //定义一数组
							strs = row.gpsInfo.split(","); //字符分割
							this.center = [strs[0], strs[1]];
						}else{
							this.$message('未设置点标记');
							this.amapDemo=false
						}
					}
				},
				handleUpdate(index, row){
					row.gpsInfo=this.center[0]+','+this.center[1];
					updateAddress(row.id, row).then(response => {
					  this.$message({
					    message: '修改成功',
					    type: 'success',
					    duration:1000
					  });
					});
				},
				save(){
					this.address.gpsX=this.center[0];
          this.address.gpsY=this.center[1];
					updateAddress(this.address.id, this.address).then(response => {
					  this.$message({
					    message: '修改成功',
					    type: 'success',
					    duration:1000
					  });
					});
				},
				cancel(){
					this.$router.back();
				},
      }
    };
</script>
