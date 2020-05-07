<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="address" :rules="rules" ref="addressFrom" label-width="150px">
      <!-- <el-form-item label="名称：" prop="name">
        <el-input v-model="address.name"></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="description">
        <el-input v-model="address.description"></el-input>
      </el-form-item>
			
			<el-form-item label="卡号：" prop="card">
			  <el-input v-model="address.card"></el-input>
			</el-form-item> -->
			<el-form-item label="卡号：">
			  <el-input v-model="address.card"></el-input>
			</el-form-item>
			<el-form-item label="名称：" prop="name">
			  <el-input v-model="address.name"></el-input>
			</el-form-item>
			<el-form-item label="设备用户名：" prop="usernameInput">
			  <el-input v-model="address.usernameInput"></el-input>
			</el-form-item>
			<el-form-item label="是否修改密码：" prop="radio" v-if="isEdit">
					<el-switch
					  v-model="radio"
					  :active-value="1"
						@change="lineCycleTimesButtonChange"
					  :inactive-value="0">
					</el-switch>
				</el-form-item>
			<el-form-item label="设备密码：" prop="passwordInput" v-if="passwordShow">
			  <el-input v-model="address.passwordInput" type="password"></el-input>
			</el-form-item>
			<el-form-item label="描述：" >
			  <el-input v-model="address.description"></el-input>
			</el-form-item>
			<el-form-item label="公司：" prop="companyId" >
			  <el-select 
					:disabled="isEdit"
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit('addressFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('addressFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {create,updateInspector,getInspector,getCompanyList} from '@/api/setting/InspectorController'
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
        address:Object.assign({}, defaultAddress),
        rules: {
					usernameInput: [
					  {required: true, message: '请输入用户名', trigger: 'blur'},
					  {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
					],
					passwordInput: [
					  {required: true, message: '请输入密码', trigger: 'blur'},
					  {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
					],
          name: [
						{required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          description: [
						{required: true, message: '请输入描述内容', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
					companyId: [
						{required: true, message: '请选择单位', trigger: 'blur'}
					]
        },
				companyList: [],
				radio:0,
				passwordShow:true
      }
    },
    created() {
			this.getCompanyList();
      if (this.isEdit) {
				this.passwordShow=false
        getInspector(this.$route.query.id).then(response => {
          this.address = response.data;
        });
      }else{
        this.address = Object.assign({},defaultAddress);
      }
    },
    methods: {
			lineCycleTimesButtonChange(val){
				if(val===0){
					this.passwordShow=false
				}else{
					this.passwordShow=true
				}
			},
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
                updateInspector(this.$route.query.id, this.address).then(response => {
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
										card: this.address.card,
										companyId: this.address.companyId,
										description:this.address.description,
										name:this.address.name,
										passwordInput:this.address.passwordInput,
										usernameInput:this.address.usernameInput
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


