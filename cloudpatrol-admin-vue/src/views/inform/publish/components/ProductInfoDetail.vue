<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="公司：" prop="companyId" >
        <el-select
      	 :disabled="isEdit"
          v-model="value.companyId"
          placeholder="请选择公司">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="发布人：" prop="adminId" >
			  <el-select
				 :disabled="isEdit"
			    v-model="value.adminId"
			    placeholder="请选择发布人">
			    <el-option
			      v-for="item in adminList"
			      :key="item.id"
			      :label="item.nickName"
			      :value="item.id">
			    </el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="开始时间"  prop="startDateTime">
				<div class="input-width">
					<el-date-picker v-model="value.startDateTime"  format="yyyy-MM-dd"  clearable style="width: 100%"
							  :picker-options="startDatePicker"  type="date"  placeholder="生效时间" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="结束时间" prop="endDateTime">
				<div class="input-width">
					<el-date-picker v-model="value.endDateTime"  format="yyyy-MM-dd"  clearable style="width: 100%"
							  :picker-options="endDatePicker"   type="date"  placeholder="截止时间" value-format="timestamp">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item label="通知类型：" prop="noticeType">
			  <el-radio-group v-model="value.noticeType">
			       <el-radio :label="0">管理端通知</el-radio>
			       <el-radio :label="1">巡检端通知</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="目标类型：" prop="targetType">
			  <el-radio-group v-model="value.targetType">
			       <el-radio :label="0">按公司</el-radio>
			       <el-radio :label="1">按人员</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="文本：" prop="text">
			  <el-input v-model="value.text" type="textarea" ></el-input>
			</el-form-item>

      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Bus from '@/utils/Bus'
	import {getCompanyList} from '@/api/address'
	import {getAdminList} from '@/api/inform/publish'

  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        brandOptions: [],
        rules: {
					companyId: [{required: true, message: '请选择公司', trigger: 'blur'}],
					adminId: [{required: true, message: '请选择发布人', trigger: 'blur'}],
					startDateTime:[{required: true, message: '请选择开始时间', trigger: 'blur'}],
					endDateTime:[{required: true, message: '请选择结束时间', trigger: 'blur'}],
					noticeType:[{required: true, message: '请选择通知类型', trigger: 'blur'}],
					targetType:[{required: true, message: '请选择目标类型', trigger: 'blur'}],
					text:[{required: true, message: '请输入文本内容', trigger: 'blur'}],
        },

				companyList:[],
				adminList:[],
				startDatePicker: this.beginDate(),
				endDatePicker: this.processDate(),
      };
    },
    created() {
      this.getCompanyList();
			this.getAdminList();
    },
    computed:{
      //商品的编号
      productId(){
        return this.value.id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        // this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName= this.getCateNameById(this.value.productCategoryId);
        } else {
          this.value.productCategoryId = null;
          this.value.productCategoryName=null;
        }
      }
    },
    methods: {
			getCompanyList() {
			  getCompanyList({pageNum: 1, pageSize: 100}).then(response => {
			    this.companyList = response.data.list;
			  });
			},
			getAdminList(){
				getAdminList({pageNum: 1, pageSize: 100}).then(response => {
					console.log(response)
				  this.adminList = response.data.list;
				});
			},
			beginDate(){
				const self = this
				return {
				disabledDate(time){
					if (self.value.endDateTime) {  //如果结束时间不为空，则小于结束时间
					return new Date(self.value.endDateTime).getTime() < time.getTime()
					} else {
					 //return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
					}
				}
				}
			},
			processDate() {
				const  self = this
				return {
				disabledDate(time) {
					if (self.value.startDateTime) {  //如果开始时间不为空，则结束时间大于开始时间
			
			return new Date(self.value.startDateTime).getTime() > time.getTime();
					} else {
						//return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
					}
				}
				}
			},
			// processDate() {
			// 	const  self = this
			// 	return {
			// 	disabledDate(time) {
			// 		if (self.value.startDateTime) {  //如果开始时间不为空，则结束时间大于开始时间
			// 
			// return new Date(self.value.startDateTime).getTime() > time.getTime()||time.getTime() > new Date(self.value.startDateTime).getTime() + (30 * 24 * 60 * 60 * 1000)*1||time.getTime() > endDateTimestamp();
			// 		} else {
			// 			return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
			// 		}
			// 	}
			// 	}
			// },

      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
            this.$emit('noticeType', this.value.noticeType,this.value.targetType);//通知类型   0 管理端通知   1巡检端   目标类型   0 公司   1人员
						if(this.value.targetType==1){
							Bus.$emit('targetType', this.value.targetType,this.value.noticeType);//目标类型   0 公司   1人员
						}else{
							Bus.$emit('targetType', this.value.targetType);//目标类型   0 公司   1人员
						}
            
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },

    }
  }


	function endDateTimestamp(){
			//明天的时间
			var day = new Date(new Date().toLocaleDateString()).getTime();
			var getTime=day+24*60*60*1000;
				return getTime
			}
</script>

<style scoped>
</style>
