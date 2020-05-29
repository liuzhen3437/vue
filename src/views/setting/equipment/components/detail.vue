<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="address" :rules="rules" ref="addressFrom" label-width="150px">
			<el-form-item label="名称：" prop="name">
			  <el-input v-model="address.name"></el-input>
			</el-form-item>
			<el-form-item label="描述：" >
			  <el-input v-model="address.description"></el-input>
			</el-form-item>
			<el-form-item label="设备唯一码：" prop="number">
			  <el-input v-model="address.number " :disabled="isEdit"></el-input>
			</el-form-item>
			<el-form-item label="有效期限：" prop="expiry">
			  <el-date-picker
        :disabled="isEdit"
			  v-model="address.expiry"
			  type="date"
				format="yyyy 年 MM 月 dd 日"
				value-format="timestamp"
			  placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="公司：" prop="companyId" >
			  <el-select
				  
			    v-model="address.companyId"
			    placeholder="请选择公司">
			    <el-option
			      v-for="item in companyList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.id">
			    </el-option>
			  </el-select>
			</el-form-item>
    </el-date-picker>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('addressFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('addressFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {create,update,getdeviceEvent,getCompanyList} from '@/api/setting/equipment'
  const defaultAddress={
    name: '',
  };
  export default {
    name: 'AddressDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
				value1:'',
        address:Object.assign({}, defaultAddress),
        rules: {
          name: [
						{required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          description: [
          	{required: true, message: '请输入描述内容', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
					number: [
						{required: true, message: '请输入描述内容', trigger: 'blur'},
					  {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
					],
					expiry:[{required: true, message: '请输入描述内容', trigger: 'blur'}],
					companyId: [
						{required: true, message: '请选择单位', trigger: 'blur'}
					]
        },
				companyList: [],
      }
    },
    created() {
			this.getCompanyList();
      if (this.isEdit) {
        getdeviceEvent(this.$route.query.id).then(response => {
          this.address = response.data;
        });
      }else{
        this.address = Object.assign({},defaultAddress);
      }
    },
    methods: {
      onSubmit(formName) {

				console.log(this.isEdit)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                update(this.$route.query.id, this.address).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
								var addressDate={
										description: this.address.description,
										expiry:this.address.expiry,
										companyId:this.address.companyId,
										number:this.address.number,
										name:this.address.name
								}
                create(addressDate).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '添加成功',
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
        this.address = Object.assign({},defaultAddress);
      },
			getCompanyList() {
			  getCompanyList({pageNum: 1, pageSize: 100}).then(response => {
			    this.companyList = response.data.list;
			  });
			},
    }
  }
</script>
<style>
</style>
