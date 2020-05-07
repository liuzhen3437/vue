<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="line" :rules="rules" ref="lineFrom" label-width="150px">
      <el-form-item label="昵称：" prop="nickName">
        <el-input v-model="line.nickName"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="usernameInput">
        <el-input v-model="line.usernameInput"></el-input>
      </el-form-item>
      <!-- <el-form-item label="密码：" prop="passwordInput">
        <el-input v-model="line.passwordInput" type="password"></el-input>
      </el-form-item> -->
        <el-form-item label="公司：" prop="companyId">
        <el-select
					:disabled="isEdit"
          v-model="line.companyId"
          @change="handleCompanyChange"
          placeholder="请选择公司">
          <el-option
            v-for="item in companyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="头像：" >
			  <single-upload v-model="line.icon"></single-upload>
			</el-form-item>
      <el-form-item label="账户类型：" prop="type">
        <el-radio-group v-model="line.type">
             <el-radio :label="0">管理员</el-radio>
             <el-radio :label="1">查看员</el-radio>
             <!-- <el-radio :label="2">超级管理员</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('lineFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('lineFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {create, getList, update} from '@/api/account/manage'
	import SingleUpload from '@/components/Upload/singleUpload'
  import {fetchList as fetchCompanyList} from '@/api/company'

  const defaultLine={
    companyId : null,
    nickName  : '',
    // passwordInput  : '',
    type  : null,
    usernameInput  : '',
    icon :''
  };
  export default {
    name: 'CompanyDetail',
		components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        line:Object.assign({}, defaultLine),
        companyOptions: [],
        rules: {
          usernameInput: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          passwordInput: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ],
					touxiang: [
					  {required: true, message: '请输选择头像', trigger: 'blur'}
					],
          nickName: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
            {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
          ],
          companyId: [{required: true, message: '请选择公司', trigger: 'blur'}],
          type: [{required: true, message: '请选择账户类型', trigger: 'blur'}],
          /*
          logo: [
            {required: true, message: '请输入品牌logo', trigger: 'blur'}
          ],
          */
        }
      }
    },
    created() {
      this.getCompanyList();
      if (this.isEdit) {
        getList(this.$route.query.id).then(response => {
          this.line = response.data;
        });
      }else{
        this.line = Object.assign({},defaultLine);
      }
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
              if (this.isEdit) {
                
                update(this.$route.query.id, this.line).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                create(this.line).then(response => {
                  this.$refs[formName].resetFields();
                  this.line = Object.assign({},defaultLine);
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
      },
      getCompanyList() {
        fetchCompanyList({pageNum: 1, pageSize: 100}).then(response => {
          this.companyOptions = [];
          let companyList = response.data.list;
          for (let i = 0; i < companyList.length; i++) {
            this.companyOptions.push({label: companyList[i].name, value: companyList[i].id});
          }
        });
      },
      handleCompanyChange(val) {
        this.line.companyName = '';
        for (let i = 0; i < this.companyOptions.length; i++) {
          if (this.companyOptions[i].value === val) {
            this.line.companyName = this.companyOptions[i].label;
            break;
          }
        }
      },

    }
  }
</script>
<style>
</style>
