<template> 
  <el-card class="form-container" shadow="never" >
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="第一步，通知基本信息"></el-step>
      <el-step title="第二步，选择通知目标"></el-step>
    </el-steps>
    <product-info-detail
      v-on:noticeType="noticeType"
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
			targetType="targetType"
      valueList="valueList"
      @nextStep="nextStep">
    </product-info-detail>
    <product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @NoticeTarget="NoticeTarget"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-sale-detail>
    <!-- <product-attr-detail
      v-show="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail> -->
    <!-- <product-relation-detail
      v-show="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail> -->
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductSaleDetail from './ProductSaleDetail';
  import {noticeCreate,getProduct,updateProduct} from '@/api/inform/publish'

  const defaultProductParam = {
    companyId:'',
    adminId:'',
    startDateTime:'',
    endDateTime:'',
    noticeType:0,
    targetType:0,
    text:'',
    noticeTargetList:[]

  };
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductSaleDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false],


        noticeTypeDate:null,
        NoticeTargetList:[],
				targetTypeDate:null,
      }
    },
    created(){
      if(this.isEdit){
        getProduct(this.$route.query.id).then(response=>{
          this.productParam=response.data;
					// console.log(response.data.noticeTargetList)
					// var data=[];
					// response.data.noticeTargetList.map((value,index,arry)=>{
					// 	 data.push({'targetId':value.targetId})
					// })
					// console.log(data);

        });
      }
    },
    methods: {
      noticeType(noticeType,targetType){
        console.log(noticeType);
				console.log(targetType);
        this.noticeTypeDate=noticeType;
				this.targetTypeDate=targetType;

      },
      NoticeTarget(date){
        this.NoticeTargetList=date;
				console.log(date)
      },
      spot(data){
        console.log(data)
      },
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit(isEdit) {

        var NoticeTargetList=this.NoticeTargetList;
        var arr=[];
				console.log(NoticeTargetList)
        if(NoticeTargetList.length>0){
         for(var i=0;i<NoticeTargetList.length;i++){
					 arr[i] = new Object();
           arr[i].targetId =NoticeTargetList[i].id;
         }
				 console.log(arr)

          this.$confirm('是否确认完成', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(isEdit){
              console.log(this.productParam)
              this.productParam.noticeTargetList=arr;
              updateProduct(this.$route.query.id,this.productParam).then(response=>{
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  duration:1000
                });
                this.$router.back();
              });
            }else{
              console.log(this.productParam);
              this.productParam.noticeTargetList=arr;
              noticeCreate(this.productParam).then(response=>{
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  duration:1000
                });
                this.$router.back();
              });
            }
          })
        }else{
          this.$message({
            type: 'error',
            message: '请选择列表',
            duration:1000
          });
        }

      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>
