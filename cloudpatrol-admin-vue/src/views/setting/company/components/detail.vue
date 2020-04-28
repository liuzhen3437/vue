<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="company" :rules="rules" ref="companyFrom" label-width="150px">
      <el-form-item label="单位名称：" prop="name">
        <el-input v-model="company.name"></el-input>
      </el-form-item>

      <!-- <el-form-item label="省份：" prop="province">
        <el-select v-model="company.province" placeholder="请选择省份">
          <el-option
            v-for="item in provinceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="城市：" prop="city">
        <el-select v-model="company.city" placeholder="请选择城市">
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
			<el-form-item label="所属省：" prop="province">
				<el-select v-model="company.province" placeholder="请选择" @change="provinceChanged">
					<el-option
					  :key="''"
					  :label="'全部'"
					  :value="''">
					</el-option>
					<el-option
					  v-for="item in provinces"
					  :key="item.code"
					  :label="item.name"
					  :value="item.code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="所属市："  prop="city" >
				<el-select v-model="company.city"
							 :loading="loadingCity"
							 @change="cityChanged"
							 placeholder="请选择">
					<el-option
					  :key="''"
					  :label="'全部'"
					  :value="''">
					</el-option>
					<el-option
					  v-for="item in cities"
					  :key="item.code"
					  :label="item.name"
					  :value="item.code">
					</el-option>
				</el-select>
			</el-form-item>
			
			
      <el-form-item label="上级单位：" prop="parentId" >
        <el-select :disabled="isEdit"
          v-model="company.parentId"
          placeholder="请选择上级单位">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit('companyFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('companyFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createCompany, getCompany, updateCompany,fetchList} from '@/api/company'
	import provinceCity from '@/json/provinceCity.json';
  const defaultCompany={
    //groupId: '',
    name: '',
    province: '',
    city: '',
    parentId: 0,
  };
  export default {
    name: 'CompanyDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
			provinceCode: {
			  type: String,
			  default: ''
			},
			cityCode: {
			  type: String,
			  default: ''
			}
    },
    data() {
      return {
				loadingCity: false,
				    province: '',
				    city: '',
				    provinces: [],
				    cities: [],
					ajax:{
						ajaxProvince:'',
						ajaxCitie:''
					},
						
        cityOptions: [{
          value: '北京',
          label: '北京'
        }, {
          value: '上海',
          label: '上海'
        },
],

        provinceOptions: [{
          value: '北京',
          label: '北京'
        }, {
          value: '上海',
          label: '上海'
        },
        {
          value: '河北',
          label: '河北'
        }],

        companyList: [],

        company:Object.assign({}, defaultCompany),
        rules: {
          name: [
            {required: true, message: '请输入单位名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          province: [{required: true, message: '请选择省份', trigger: 'blur'}],
          city: [{required: true, message: '请选择城市', trigger: 'blur'}],
          parentId: [{required: true, message: '请选择上级单位', trigger: 'blur'}],
        }
      }
    },
		mounted() {
		    this.province = this.provinceCode
		    this.provinceChanged(this.provinceCode)
		    this.city = this.cityCode
		  },
    created() {
			this.provinces = provinceCity.provinces;
      this.getCompanyList();
      if (this.isEdit) {
        getCompany(this.$route.query.id).then(response => {
          this.company = response.data;
        });
      }else{
        this.company = Object.assign({},defaultCompany);
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
                updateCompany(this.$route.query.id, this.company).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                createCompany(this.company).then(response => {
                  this.getCompanyList();
                  this.$refs[formName].resetFields();
                  this.company = Object.assign({},defaultCompany);
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
        this.company = Object.assign({},defaultCompany);
      },
      getCompanyList() {
        fetchList({pageNum: 1, pageSize: 100}).then(response => {
          this.companyList = response.data.list;
          this.companyList.unshift({id: 0, name: '无上级单位'});
        });
      },
			
			provinceChanged(value) {
				if (value !== '') {
				  this.ajax['ajaxCitie']='';	
				  var obj = {};
				  obj = this.provinces.find(item =>{
				  	return item.code === value 
				  });
				  this.ajax['ajaxProvince']=obj.name;
				  console.log(this.ajax);
					this.company.province=this.ajax.ajaxProvince;
					console.log(this.company)
				  this.loadingCity = true
				  for (var item of this.provinces) {
					if (item.code === value) {
					  this.cities = item.cities
					  this.city = ''
					  this.loadingCity = false
					  break
					} else {
					  continue
					}
				  }
				} else {
					this.cities = []
					this.city = ''
				}
				this.$emit('selectChange', this.province, this.city)
			},
			cityChanged(value) {
				var obj = {};
				obj = this.cities.find(item =>{
					return item.code === value 
				});
				this.ajax['ajaxCitie']=obj.name;
				console.log(this.ajax);
				this.company.city=this.ajax.ajaxCitie;
				console.log(this.company)
				this.$emit('selectChange', this.province, this.city)
			},
			resetProviceCity(province, city) {
				this.cities = []
				if (province && city) {
				  this.province = province
				  this.provinceChanged(this.province)
				  this.city = city
				} else {
				  this.province = ''
				  this.city = ''
				}
			},
    }
  }
</script>
<style>
</style>


