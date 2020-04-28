<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <span style="position: absolute; font-size: 14px; right:100px;" class="title_name">
		<span>{{name.groupName}}</span><span>/</span>
		<span v-if="name.companyName">{{name.companyName}}</span><span v-if="name.companyName">/</span>
		<span>{{type}}</span><span>/</span>
		<span>{{name.nickName}}</span>
	</span>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper" style="margin-top:0px">
        <!-- <img class="user-avatar" :src="avatar"> -->
				<img class="user-avatar" src="./ren.png">
        <!-- <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 60px;display: inline-block;">{{name.usernameInput}}</span> -->
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
				<el-dropdown-item divided>
				  <span @click="dialogVisible = true" style="display:block;">修改密码</span>
				</el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
		<el-dialog
			title="修改密码"
			:visible.sync="dialogVisible"
			width="30%"
			:before-close="handleClose">
				<el-form :model="line" :rules="rules" ref="lineFrom" >
				  <el-form-item label="密码：" prop="password" :label-width="formLabelWidth">
				    <el-input v-model="line.password" type="password" ></el-input>
				  </el-form-item>
				</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateMyPassword">确 定</el-button>
			</span>
		</el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {updateMyPassword,adminInfo} from '@/api/account/manage'
const defaultLine={
    password  : ''
  };
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },

	data() {
      return {
        dialogVisible: false,
				line:Object.assign({}, defaultLine),
				rules: {
				  password: [
				    {required: true, message: '请输入密码', trigger: 'blur'},
				    {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
				  ]
				},
				formLabelWidth:'120px',
        name:{
          groupName:'',
          companyName:'',
          type:'',
          nickName:''
        },
		type:'',
      };
    },
    created() {
      this.getList();
    },
  methods: {
    getList() {

      adminInfo().then(response => {
        this.name=response.data
        console.log(response)
		if(this.name.type==0){
			this.type=' 管理员'
		}else if(this.name.type==1){
			this.type=' 查看员'
		}else if(this.name.type==2){
			this.type=' 超级管理员'
		}
      });
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
		updateMyPassword(){
			updateMyPassword(this.line).then(response => {
			  this.$refs[formName].resetFields();
			  this.line = Object.assign({},defaultLine);
			  this.$message({
			    message: '提交成功',
			    type: 'success',
			    duration:1000
			  });
			  this.dialogVisible=false;
			});

		},
		handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.title_name span{ padding:0px 5px;max-width:100px; white-space:nowrap;overflow:hidden;text-overflow:ellipsis; display:inline-block}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 55px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        margin-top: 8px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
