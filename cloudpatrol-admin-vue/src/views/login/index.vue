<template>
  <div class="page-header" filter-color="orange">
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center">
          <!-- <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon> -->
					<img :src="logo" style="width:20%"/>
        </div>
        <h2 class="login-title color-main">e控-实时巡</h2>
				<el-form-item prop="groupName">
				  <el-input name="groupName"
				            type="text"
				            v-model="loginForm.groupName"
				            autoComplete="on"
				            placeholder="请输入工作组名">
				  <span slot="prefix">
				    <svg-icon icon-class="user" class="color-main"></svg-icon>
				  </span>
				  </el-input>
				</el-form-item>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
				
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px">
          <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <img :src="login_center_bg" class="login-center-layout"> -->
		<div class="page-header-image"></div>
  </div>
</template>

<script>

  import {isvalidUsername} from '@/utils/validate';
  import login_center_bg from '@/assets/images/login_center_bg.png'
	import login from '@/assets/images/login.jpg'
	import logo from '@/assets/images/logo.png'
  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        /*
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
        */
        callback()
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };

			
      return {
        loginForm: {
          username: '',
					groupName:'',
          password: '',
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
					groupName:[{required: true, trigger: 'blur', message: '请输入工作组名'}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
				logo
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
				console.log(this.loginForm)
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
      },

    }
  }
</script>

<style scoped>

	.page-header[filter-color="orange"] {
		height: 100vh;
    background: rgba(44, 44, 44, 0.2);
    /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(90deg, rgba(44, 44, 44, 0.2), rgba(224, 23, 3, 0.6));
    /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(90deg, rgba(44, 44, 44, 0.2), rgba(224, 23, 3, 0.6));
    /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(90deg, rgba(44, 44, 44, 0.2), rgba(224, 23, 3, 0.6));
    /* For Firefox 3.6 to 15 */
    background: linear-gradient(0deg, rgba(44, 44, 44, 0.2), rgba(224, 23, 3, 0.6));
    /* Standard syntax */
}
.page-header {
    height: 100vh;
    max-height: 1050px;
    padding: 0;
    color: #FFFFFF;
    position: relative;
    background-position: center center;
    background-size: cover;
}
.page-header:before {
    background-color: rgba(0, 0, 0, 0.5);
}
.page-header .page-header-image {
	  background-image: url('../../assets/images/login.jpg');
    position: absolute;
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    z-index: -1;
}
.page-header:after,
.page-header:before {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: block;
    left: 0;
    top: 0;
    content: "";
}
.login-form-layout{
	z-index: 99;
	position: absolute;
    top: 50%;
    left: 50% !important;
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    padding: 0 15px;
    color: #FFFFFF;
    width: 90%;
		margin: 0px !important;
    max-width: 350px;
}
	.container {
			height: 100%;
			z-index: 1;
			text-align: center;
			position: relative;
	}
	
	
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
