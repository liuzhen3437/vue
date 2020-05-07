<template>
<div>
    <div class="amap-page-container" style="width: 100%; height: 50vh;">

      <el-amap ref="map" vid="amapDemo" :amap-manager="amapManager"  :center="center" :zoom="zoom"
				 class="amap-demo">

				<el-amap-polyline :editable="polyline.editable"  :path="polyline.path" ></el-amap-polyline>
			</el-amap>
    </div>

	</div>
  </template>


<style lang="css">
.container {
  width: 700px;
  height: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  border: 1px solid #999;
}
.search-box {
  position: absolute;
  z-index: 5;
  width: 70%;
  left: 13%;
  top: 10px;
  height: 30px;
}
.search-box input {
  float: left;
  width: 80%;
  height: 100%;
  border: 1px solid #30ccc1;
  padding: 0 8px;
  outline: none;
}
.search-box button {
  float: left;
  width: 20%;
  height: 100%;
  background: #30ccc1;
  border: 1px solid #30ccc1;
  color: #fff;
  outline: none;
}
.tip-box {
  width: 100%;
  max-height:260px;
  position: absolute;
  top: 30px;
  overflow-y: auto;
  background-color: #fff;
}
</style>

  <script>
    import Vue from 'vue'

    import AMap from "vue-amap";
    Vue.use(AMap);
    AMap.initAMapApiLoader({
      key: "5e9626bffdee967b9f32a39b84fc278b",
      plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
      uiVersion: "1.0.11", // ui库版本，不配置不加载,
      v: "1.4.4"
    });


	// import AMap from "vue-amap";
	let amapManager = new AMap.AMapManager();
  let graspRoad = new amapManager.GraspRoad()
    export default {
      name: 'site',
			data(){
        let self = this;
					return{
						zoom: 16,
            amapManager,
						center: [116.478935,39.997761],
						polyline: {
							path: [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]],

							editable: false
						}
					}
			},
			created() {
        this. getMap()
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
      }
    };
</script>
