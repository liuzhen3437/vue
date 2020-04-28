<template>
    <div class="trackquery">
      <div id="container" class="map" style="height: 500px;"></div>
        <div class="contbtn" v-if="lineArr.length > 0">
            <!-- <flexbox>
                <flexbox-item><div class="flex-demo">
                    <x-button v-if="starshow" class="btncol" type="primary" @click.native="starmove">开始动画</x-button>
                    <x-button v-if="!starshow" class="btncol" type="primary" @click.native="stopAnimation">停止动画</x-button>
                </div></flexbox-item>
                <flexbox-item><div class="flex-demo">
                    <x-button :disabled="btndisabled" v-if="endshow" class="btncol" type="primary" @click.native="endmove" style="background-color: rgb(68, 138, 202);">暂停动画</x-button>
                    <x-button :disabled="btndisabled" v-if="!endshow" class="btncol" type="primary" @click.native="resumeAnimation" style="background-color: rgb(68, 138, 202);">继续动画</x-button>
                </div></flexbox-item>
            </flexbox> -->
			<div @click="starmove">开始动画</div>
			<div @click="stopAnimation">停止动画</div>
			<div @click="endmove">暂停动画</div>
			<div @click="resumeAnimation">继续动画</div>
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
			data() {
        return {
            btndisabled: true,
            loadshow: false,
            loadtext: '提交中',
            showtop: true,
            starshow: true,
            endshow: true,
            userinfo: {},
            cphList: [],
            sjmcList: [],
            cphid: '',
            cphmc: '',
            sjmcid: '',
            sjmc: '',
            startime: '',
            endtime: '',
            sigInfo: {},
            map: "",
            lineArr: [],
            lineArrlast: [],
            lineArrPre: [],
            marker: '',
            k: 0,
        }
    },
  created() {

    },
    mounted() {
        // 初始化地图
        this.getmap()
    },
  methods: {
      getmap() {
            //  测试数据
            this.lineArr = ["37.8733379449,112.55877766927|37.8732877604,112.55876600477|37.8733064779,112.5587516276|37.8732354058,112.55877929688|37.8731488715,112.55866102431|37.8730938043,112.55855604384|37.8729125977,112.55849093967|37.872827691,112.55837158203|37.8727848307,112.55822238498|37.8727718099,112.55802517361|37.8728314887,112.55778184679|37.8729033746,112.55748616536|37.8728721788,112.5572781033|37.8728428819,112.55718641493|37.8728192817,112.55690456814|37.872827691,112.55672688802|37.8728881836,112.55657172309|37.8728849284,112.55644504123|37.8727517361,112.55618109809|37.8724210612,112.55612792969|37.8722357856,112.55611328125|37.8721343316,112.55603135851|37.8721443685,112.5558710395|37.8721072049,112.5559375|37.8720486111,112.55637315538|37.8722252062,112.55630886502|37.8722734918,112.5563031684|37.8730498589,112.55625108507"]
            let self = this;
            let polylineX,nColorLength,currentLen,latlonarr,pointList
            let colors = ["#3366cc", "#dc3912", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#316395", "#994499", "#22aa99", "#6633cc", "#329262", "#5574a6", "#3b3eac"];
            this.map = new AMap.Map("container", {
                resizeEnable: true,
                
                zoom: 12
            });
            if(this.lineArr.length > 0) {
                for(let j = 0; j < this.lineArr.length; j++) {
                    polylineX = "polyline" + j;
                    //计算取颜色的函数
                    nColorLength = colors.length;
                    currentLen = 0;
                    if (j > nColorLength) {
                        currentLen = j % 14;
                    }
                    else {
                        currentLen = j;
                    }
                    latlonarr = this.lineArr[j].split('|')
                    if(latlonarr.length > 0) {
                        if(j < this.lineArr.length - 1) {
                            this.lineArrPre = []
                            for(let i = 0; i < latlonarr.length; i++) {
                                pointList = latlonarr[i].split(',');
                                if (pointList.length > 0) {
                                    this.lineArrPre.push(new AMap.LngLat(pointList[1], pointList[0]));
                                }
                            }
                            polylineX = new AMap.Polyline({
                                map: this.map,
                                path: this.lineArrPre,
                                showDir: true,
                                strokeColor: colors[currentLen],  //线颜色
                                strokeWeight: 6      //线宽
                            });
                        } else {    //最后一条轨迹绘制移动轨迹
                            for(let i = 0; i < latlonarr.length; i++) {
                                pointList = latlonarr[i].split(',');
                                if (pointList.length > 0) {
                                    this.lineArrlast.push(new AMap.LngLat(pointList[1], pointList[0]));
                                }
                            }
                            polylineX = new AMap.Polyline({
                                map: this.map,
                                path: this.lineArrlast,
                                showDir: true,
                                strokeColor: colors[currentLen],  //线颜色
                                strokeWeight: 6      //线宽
                            });
                            if(this.lineArrlast.length > 0) {
                                 this.marker = new AMap.Marker({
                                    map: this.map,
                                    position: [this.lineArrlast[0].lng,this.lineArrlast[0].lat],
                                    icon: "https://webapi.amap.com/images/car.png",
                                    offset: new AMap.Pixel(-26, -13),
                                    autoRotation: true,
                                    angle:-90,
                                });
                            }
                            var passedPolyline = new AMap.Polyline({
                                map: this.map,
                                // path: lineArr,
                                strokeColor: "#AF5", //线颜色
                                strokeOpacity: 1, //线透明度
                                strokeWeight: 6 //线宽
                                // strokeStyle: "solid"  //线样式
                            });
                            this.marker.on('moving', function (e) {
                                passedPolyline.setPath(e.passedPath);
                            });
                        }
                    }
                }
            }
            this.map.setFitView();
        },
      starmove() {
            this.starshow = false
            this.btndisabled = false
            this.marker.moveAlong(this.lineArrlast, 500);
        },
        endmove() {
            this.endshow = false
            this.marker.pauseMove();
        },
        resumeAnimation() {
            this.endshow = true
            this.marker.resumeMove();
        },
        stopAnimation() {
            this.starshow = true
            this.endshow = true
            this.btndisabled = true
            this.marker.stopMove();
        },
  }
    };
</script>
