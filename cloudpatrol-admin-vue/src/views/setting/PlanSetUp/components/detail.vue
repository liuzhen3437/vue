<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="line" :rules="rules" ref="lineFrom" label-width="150px">
      <el-form-item label="名称：" prop="name">
				<div class="inw200">
					<el-input v-model="line.name"></el-input>
				</div>
      </el-form-item>
			<el-form-item label="路线：" prop="lineId">
				<el-select
					v-model="line.lineId"
					@change="handleCompanyChange"
					placeholder="请选择路线">
					<el-option
						v-for="item in lineOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="绑定人员：">
			  <el-switch
			    v-model="line.isEqualInspector"
			    :active-value="1"
			    :inactive-value="0">
			  </el-switch>
			</el-form-item>
			<el-form-item label="绑定设备：">
			  <el-switch
			    v-model="line.isEqualDevice"
			    :active-value="1"
			    :inactive-value="0">
			  </el-switch>
			</el-form-item>
			<el-form-item label="开始日期：" prop="startDate">
			    <el-date-picker
			      v-model="line.startDate"
			      value-format="timestamp"
			      type="date"
			      :picker-options="pickerOptions1"
			      placeholder="选择开始日期">
			    </el-date-picker>
			</el-form-item>
			<el-form-item label="开始时间：" prop="startTime">
<!-- 			    <el-date-picker
			      v-model="line.startTime"
			      value-format="timestamp"
			      type="time"
			      :picker-options="pickerOptions1"
			      placeholder="选择开始时间">
			    </el-date-picker> -->
					<!-- <el-time-picker
						v-model="line.startTime"
						:picker-options="{
							selectableRange: '00:00:00 - 23:59:59'
						}"
						placeholder="选择开始时间">
					</el-time-picker> -->
					
					<el-time-picker
						v-model="line.startTime"
						:picker-options="{
						  selectableRange: '00:00:00 - 23:59:59'
						}"
						 value-format="HH:mm" format="HH:mm"
						placeholder="任意时间点">
					 </el-time-picker>
					<!-- <el-time-select
						v-model="line.startTime"
						:picker-options="{
							start: '00:00',
							step: '00:01',
							end: '23:59'
						}"
						placeholder="选择开始时间">
					</el-time-select> -->
			</el-form-item>
			<el-form-item label="结束日期：">
					<el-switch
					  v-model="planinfo.endDateButton"
					  :active-value="1"
            @change="endDateButtonChange"
					  :inactive-value="0">
					</el-switch>
			    <el-date-picker
			      v-model="line.endDate"
			      value-format="timestamp"
			      type="date"
						:disabled="planinfo.endDateButton===0"
			      :picker-options="endDatePicker"
			      placeholder="选择结束时间">
			    </el-date-picker>
			</el-form-item>
			<el-form-item label="计划类型：">
			  <el-radio-group v-model="line.type" size="small">
			    <el-radio-button :label="0">无序</el-radio-button>
			    <el-radio-button :label="1">有序</el-radio-button>
			    <el-radio-button :label="2">精准</el-radio-button>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="单圈时长：" prop="lineSingleDuration">
				<div class="inw200">
					<el-input v-model="line.lineSingleDuration " oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
				分钟
			</el-form-item>
			<!-- <el-form-item label="单圈最短时长：" v-show="line.type===0||line.type===1" prop="name">
				<el-switch
				  v-model="planinfo.lineSingleMinimumDurationButton"
				  :active-value="1"
				  :inactive-value="0">
				</el-switch>
				<div class="inw200">
					<el-input v-model="line.lineSingleMinimumDuration" :disabled="planinfo.lineSingleMinimumDurationButton===0"></el-input>
				</div>
				分钟
			</el-form-item> -->
			<el-form-item label="同一点最短时长：" v-show="line.type===0" prop="linepointMinimumInterval">
				<!-- <el-switch
				  v-model="planinfo.linepointMinimumIntervalButton"
				  :active-value="1"
					@change="linepointMinimumIntervalButtonChange"
				  :inactive-value="0">
				</el-switch> -->
				<div class="inw200">
					<!-- <el-input v-model="line.linepointMinimumInterval" :disabled="planinfo.linepointMinimumIntervalButton===0" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input> -->
					<el-input v-model="line.linepointMinimumInterval"  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
				分钟
			</el-form-item>
			<el-form-item label="单圈重复次数：" v-show="line.type===0" prop="lineRepeatTimes">
				<!-- <el-switch
				  v-model="planinfo.lineRepeatTimesButton"
				  :active-value="2"
					@change="lineRepeatTimesButtonChange"
				  :inactive-value="1">
				</el-switch> -->
				<div class="inw200">
					<el-input v-model="line.lineRepeatTimes"    oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
					
				  <!-- <el-input v-model="line.lineRepeatTimes"  :disabled="planinfo.lineRepeatTimesButton===1"  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input> -->
				</div>
				次
			</el-form-item>
			<el-form-item label="单日执行次数：" prop="lineCycleTimes">
				<!-- <el-switch
				  v-model="planinfo.lineCycleTimesButton"
				  :active-value="2"
					@change="lineCycleTimesButtonChange"
				  :inactive-value="1">
				</el-switch> -->
				<div class="inw200">
					<!-- <el-input v-model="line.lineCycleTimes" :disabled="planinfo.lineCycleTimesButton===1" @blur="lineCycleTimesBlur" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input> -->
					<!-- <el-input v-model="line.lineCycleTimes" :disabled="planinfo.lineCycleTimesButton===1" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input> -->
					<el-input v-model="line.lineCycleTimes"  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
				次
			</el-form-item>
			<!-- <el-form-item label="单日执行间隔：" prop="lineCycleInterval" v-show="planinfo.lineCycleTimesButton===2"> -->
			<el-form-item label="单日执行间隔：" prop="lineCycleInterval" >
				<div class="inw200">
					<el-input v-model="line.lineCycleInterval" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
				分钟
			</el-form-item>
			<el-form-item label="计划循环类型：">
			  <el-radio-group v-model="line.planCycleType" size="small" @change="planCycleTypeChange">
			    <el-radio-button :label="0">按天</el-radio-button>
			    <el-radio-button :label="1">按周</el-radio-button>
			    <el-radio-button :label="2">自定义</el-radio-button>
			  </el-radio-group>
			</el-form-item>
			<div class="el-form-item" v-show="line.planCycleType===1">
			  <el-checkbox-group v-model="planinfo.whatDay" >
			    <el-checkbox :label="1">周一</el-checkbox>
			    <el-checkbox :label="2">周二</el-checkbox>
			    <el-checkbox :label="3">周三</el-checkbox>
					<el-checkbox :label="4">周四</el-checkbox>
					<el-checkbox :label="5">周五</el-checkbox>
					<el-checkbox :label="6">周六</el-checkbox>
					<el-checkbox :label="7">周日</el-checkbox>
			  </el-checkbox-group>
			</div>
			<el-form-item label="先执行：" prop="planCycleCustomWork" v-show="line.planCycleType===2">
				<div class="inw200">
					<el-input v-model="line.planCycleCustomWork" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
				天
			</el-form-item>
			<el-form-item label="后执行：" prop="planCycleCustomRest" v-show="line.planCycleType===2">
				<div class="inw200">
					<el-input v-model="line.planCycleCustomRest" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
				天
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit('lineFrom')">提交</el-button>
				<el-button v-if="!isEdit" @click="resetForm('lineFrom')">重置</el-button>
			</el-form-item>
		</el-form>
  </el-card>
</template>
<script>
  import {fetchList} from '@/api/line'
	import {planCreate,planupdate,getPlan,updatePlan} from '@/api/setting/PlanSetUp'
  const defaultLine={
    name: '',
		isEqualInspector:0,
		isEqualDevice:0,
		startDate:'',
		startTime:'',
		// endDateButton:0,
		endDate:'',
		type:0,
		lineSingleDuration:1,
		// lineSingleMinimumDurationButton:0,
		// lineSingleMinimumDuration:0,
		// linepointMinimumIntervalButton:0,
		linepointMinimumInterval:1,
		lineRepeatTimes:1,
		lineCycleTimes:1,
		lineCycleInterval:1,
		planCycleType:0,
		planCycleCustomWork:0,
		planCycleCustomRest:0
  };

	const planinfoInitial={
		endDateButton:0,
		// lineSingleMinimumDurationButton:0,
		linepointMinimumIntervalButton:0,
		lineRepeatTimesButton:1,
		lineCycleTimesButton:1,
		whatDay:[],
	}
  export default {
    name: 'CompanyDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
				endDatePicker: this.processDate(),
				//日期选择器配置
				pickerOptions1: {
				  disabledDate(time) {
				    // return time.getTime() < Date.now();
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
				  }
				},
				planinfo:Object.assign({}, planinfoInitial),
        line:Object.assign({}, defaultLine),
        lineOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          lineId: [{required: true, message: '请选择路线', trigger: 'blur'}],
					startDate:[{required: true, message: '请选择日期', trigger: 'blur'}],
					startTime:[{required: true, message: '请选择时间', trigger: 'blur'}],
					linepointMinimumInterval:[{required: true, message: '请输入分钟', trigger: 'blur'}],
					lineRepeatTimes:[{required: true, message: '请输入次数', trigger: 'blur'}],
					lineCycleTimes:[{required: true, message: '请输入次数', trigger: 'blur'}],
					lineCycleInterval:[{required: true, message: '请输入次数', trigger: 'blur'}],
					lineSingleDuration:[{required: true, message: '请输入次数', trigger: 'blur'}],
					planCycleCustomWork:[{required: true, message: '请输入天数', trigger: 'blur'}],
					planCycleCustomRest:[{required: true, message: '请输入天数', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getLineList();
			console.log(this.isEdit)
      if (this.isEdit) {
        getPlan(this.$route.query.id).then(response => {
          this.line = response.data;
					console.log(response.data);

					var hours = parseInt((response.data.startTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					var minutes = parseInt((response.data.startTime % (1000 * 60 * 60)) / (1000 * 60));
					console.log(hours)
					if(hours<10){
						hours='0'+hours
					}
					console.log(hours)
					if(minutes<10){
						minutes='0'+minutes
					}

					this.line.startTime=hours+':'+minutes

					if(response.data.endDate>0){
						this.planinfo.endDateButton=1;
					}
					// if(response.data.lineSingleMinimumDuration>0){
					// 	console.log(1)
					// 	this.planinfo.lineSingleMinimumDurationButton=1;
					// }
					if(response.data.linepointMinimumInterval>0){
						console.log(1)
						this.planinfo.linepointMinimumIntervalButton=1;
					}
					if(response.data.planCycleWeek!=null){

						var planCycleWeekStr=response.data.planCycleWeek.split('');
						var planCycleWeekInt=[];
						planCycleWeekStr.forEach(function(data,index,arr){
							planCycleWeekInt.push(+data);
					});
						this.planinfo.whatDay=planCycleWeekInt;
					}
        });
      }else{
        this.line = Object.assign({},defaultLine);
      }
    },
    methods: {
			processDate() {
				const self = this
				return {
					disabledDate(time) {
						if (self.line.startDate) {  //如果开始时间不为空，则结束时间大于开始时间
							return new Date(self.line.startDate).getTime() > time.getTime()
						} else {
							// return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
						}
					}
				}
			},
			lineRepeatTimesBlur(val){
				console.log(val)
				console.log(this.line.lineRepeatTimes)
				if(this.line.lineRepeatTimes>10){
					this.line.lineRepeatTimes=10;

				}
				if(this.line.lineRepeatTimes<=1){

					this.line.lineRepeatTimes=0;

					this.planinfo.lineRepeatTimesButton=1;
				}

			},
			lineCycleTimesBlur(val){
				if(this.line.lineCycleTimes>10){
					this.line.lineCycleTimes=10
				}
				if(this.line.lineCycleTimes<=1){
					this.line.lineCycleTimes=0;
					this.planinfo.lineCycleTimesButton=1;
				}
			},
			planCycleTypeChange(val){
				if(val==2){
					this.line.planCycleCustomWork=1;
					this.line.planCycleCustomRest=1
				}else{
					this.line.planCycleCustomWork=0;
					this.line.planCycleCustomRest=0
				}
				console.log(val);
			},
			linepointMinimumIntervalButtonChange(val){
				console.log(val)
				if(val===1){
					this.line.linepointMinimumInterval=1
				}else{
					this.line.linepointMinimumInterval=0
				}
			},
			lineRepeatTimesButtonChange(val){
				console.log(val)
				if(val===2){
					this.line.lineRepeatTimes=2
				}else{
					this.line.lineRepeatTimes=0
				}
			},
			lineCycleTimesButtonChange(val){
				if(val===2){
					this.line.lineCycleTimes=2;
					this.line.lineCycleInterval=1
				}else{
					this.line.lineCycleTimes=0;
					this.line.lineCycleInterval=0
				}
			},
      endDateButtonChange(val){
        if(val===0){
        	this.line.endDate=null
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
							// if(this.line.startDate!=0){
							// 	var newDate = new Date(this.line.startDate);
							// 	var y = newDate.getFullYear();
							// 	var m = newDate.getMonth() + 1;
							// 	var d = newDate.getDate();
							// 	var h = newDate.getHours();
							// 	var mm = newDate.getMinutes();
							// 	var s = newDate.getSeconds();
							// 	var data=new Date(y+'-'+m+'-'+d);
							// 	var time=(h * 60*60*1000) + (mm * 60*1000);
							//
							// 	this.line.startDate=data.getTime();
							// 	this.line.startTime=time;
							// }
							console.log(this.line.startDate)
							console.log(this.line.startTime);
							var variable;
							variable=JSON.parse(JSON.stringify(this.line))


							var strsArr = new Array(); //定义一数组
							console.log(this.line.startTime)
							strsArr = this.line.startTime.split(":"); //字符分割
							var time=(strsArr[0] * 60*60*1000) + (strsArr[1] * 60*1000);
							console.log(time)
							variable.startTime=time;
							variable.planCycleWeek=this.planinfo.whatDay.join('');
							if(this.line.lineRepeatTimes==0){
								variable.lineRepeatTimes=1
							}
							if(this.line.lineCycleTimes==0){
								variable.lineCycleTimes=1
							}


							console.log(variable)
							console.log(this.line)


              if (this.isEdit) {
                updatePlan(this.$route.query.id, variable).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                planCreate(variable).then(response => {
                  this.$refs[formName].resetFields();
                  this.line = Object.assign({},defaultLine);
				  this.planinfo=Object.assign({},planinfoInitial);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
									this.$router.back();
                });
              }
            });

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
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.line = Object.assign({},defaultLine);
				this.planinfo=Object.assign({}, planinfoInitial)
      },
      getLineList() {
        fetchList({pageNum: 1, pageSize: 100}).then(response => {
          this.lineOptions = [];
          let lineList = response.data.list;
          for (let i = 0; i < lineList.length; i++) {
            this.lineOptions.push({label: lineList[i].name, value: lineList[i].id});
          }
        });
      },
      handleCompanyChange(val) {
				console.log(val)
        // this.line.companyName = '';
        // for (let i = 0; i < this.lineOptions.length; i++) {
        //   if (this.lineOptions[i].value === val) {
        //     this.line.companyName = this.lineOptions[i].label;
        //     break;
        //   }
        // }
      },

    }
  }
</script>
<style scoped>
	.inw200{ width: 217px; display: inline-block;}
</style>
