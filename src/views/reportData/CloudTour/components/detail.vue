<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container" v-if="isEdit==true">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.text}}</template>
        </el-table-column>
      </el-table>
    </div>
		<div class="table-container" v-else>
		  <el-table ref="brandTable"
		            :data="list"
		            style="width: 100%"
		            v-loading="listLoading"
		            border>
		    <el-table-column label="编号" width="100" align="center">
		      <template slot-scope="scope">{{scope.row.id}}</template>
		    </el-table-column>
		    <el-table-column label="类型" align="center">
		      <template slot-scope="scope">
						<span v-if="scope.row.type==0">图片</span>
						<span v-if="scope.row.type==1">音频</span>
						<span v-if="scope.row.type==2">视频</span>
					</template>
		    </el-table-column>
		    <el-table-column label="创建时间" align="center">
		      <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
		    </el-table-column>
				<el-table-column label="操作" align="center">
				  <template slot-scope="scope">
						<span v-if="scope.row.type==0" @click="LookImage(scope.$index, scope.row)">查看</span>
						<span v-if="scope.row.type==1" @click="LookMp3(scope.$index, scope.row)">播放</span>
						<span v-if="scope.row.type==2" @click="LookMp4(scope.$index, scope.row)">播放</span>
					</template>
				</el-table-column>
		  </el-table>
		</div>
		
		<el-image-viewer 
		 v-if="showViewer" 
		 :on-close="closeViewer" 
		 :url-list="[ImageUrl]" />
		 
		 
		<div class="multimedia" style="" v-if="showMp3">
			<span @click="closeViewer()" class="el-image-viewer__btn el-image-viewer__close"><i class="el-icon-circle-close"></i></span>
			<div class="zzc"></div>
			<div class="flex">
				<audio controls  >
					<source :src="Mp3Url" type="audio/mpeg">
				您的浏览器不支持 audio 元素。
				</audio>
			</div>
		</div>
		
		
		<div class="multimedia" style="" v-if="showMp4">
			<span @click="closeViewer()" class="el-image-viewer__btn el-image-viewer__close"><i class="el-icon-circle-close"></i></span>
			<div class="zzc"></div>
			<div class="flex">
				<video :src="Mp4Url" controls="controls">
					您的浏览器不支持 video 标签。
				</video>
			</div>
		</div>
		
		
  </div>
</template>
<script>
	import {formatDate} from '@/utils/date';
	import {listEvent,listAttachment} from '@/api/reportData/CloudTour'
	// 导入组件
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
	
  export default {
    name: 'lineList',
		components: { ElImageViewer },
		props: {
		  isEdit: {
		    type: Boolean,
		    default: false
		  }
		},
    data() {
      return {
        operates: [
          {
            label: "批量删除",
            value: "deleteBatch"
          }
        ],
				ImageUrl:null,
				showViewer:false,
				showMp3:false,
				Mp3Url:null,
				showMp4:false,
				Mp4Url:null,
        operateType: null,
        listQuery: {
          recordId:null
        },
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: []
      }
    },
    created() {
			console.log(this.isEdit)
      this.listQuery.recordId=this.$route.query.id
      this.getList();
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
      getList() {
        this.listLoading = true;
				if(this.isEdit==true){
					listEvent(this.listQuery).then(response => {
					  this.listLoading = false;
					  this.list = response.data;
					});
				}else{
					listAttachment(this.listQuery).then(response => {
					  this.listLoading = false;
					  this.list = response.data;
					});
				}
      },
			LookImage(index,row){
				this.showViewer = true;
				this.ImageUrl=row.url
			},
			// 关闭查看器
			closeViewer() {
				this.showViewer = false;
				this.showMp3 = false;
				this.showMp4 = false;
			},
			LookMp3(index,row){
				this.showMp3 = true;
				 this.Mp3Url=row.url
				//this.Mp3Url='http://www.0dutv.com/plug/down/up2.php/244625442.mp3'
			},
			LookMp4(index,row){
				this.showMp4 = true;
				 this.Mp4Url=row.url
				//this.Mp3Url='http://www.0dutv.com/plug/down/up2.php/244625442.mp3'
			}
      // handleSizeChange(val) {
      //   this.listQuery.pageNum = 1;
      //   this.listQuery.pageSize = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {
      //   this.listQuery.pageNum = val;
      //   this.getList();
      // }
    }
  }
</script>

<style scoped>
	.table-container span{ display: block; cursor:pointer;}
	.multimedia{    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0; z-index: 2000;}
	.zzc{position:fixed;width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: .5;
    background: #000;}
	.multimedia .flex{display: flex; height: 100%; -webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;-webkit-box-align: center;-ms-flex-align: center;align-items: center;}
	</style>
