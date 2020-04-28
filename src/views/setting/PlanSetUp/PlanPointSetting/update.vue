<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="PlanAddress" :rules="rules" ref="PlanAddressFrom" label-width="150px">
			<el-form-item label="顺序号：" prop="seq" >
				<div class="inw200">
					<el-input v-model.number="PlanAddress.seq" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
			</el-form-item> 
			<el-form-item label="时长：" prop="duration" v-if="this.query.type==2">
				<div class="inw200">
					<el-input v-model.number="PlanAddress.duration" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
			</el-form-item>
			<el-form-item label="开始间隔：" prop="offsetStart" v-if="this.query.type==2">
				<div class="inw200">
					<el-input v-model.number="PlanAddress.offsetStart" oninput="value=value.replace(/^\.+|[^\d.]/g,'')"></el-input>
				</div>
			</el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('PlanAddressFrom')">提交</el-button>
        <!-- <el-button v-if="!isEdit" @click="resetForm('addressFrom')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {getPlanAddress,planAddressUpdate} from '@/api/setting/PlanPointSetting'
  const defaultAddress={
    
  };
  export default {
    name: 'PlanPointSettingUpdate',
    data() {
      return {
        PlanAddress:Object.assign({}, defaultAddress),
				query:this.$route.query,
        rules: {
          seq: [
						{required: true, message: '请输入顺序号', trigger: 'blur'},
          ],
          duration: [
						{required: true, message: '请输入时长', trigger: 'blur'}
          ],
					offsetStart: [
						{required: true, message: '请输入开始间隔', trigger: 'blur'}
					]
        },
				companyList: [],
      }
    },
    created() {
			console.log(this.query)
        getPlanAddress(this.$route.query.id).then(response => {
          this.PlanAddress = response.data;
					console.log(response.data)
        });
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
								console.log(this.PlanAddress)
                planAddressUpdate(this.$route.query.id, this.PlanAddress).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              
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

    }
  }
</script>
<style scoped>
	.inw200{ width: 217px; display: inline-block;}
</style>


