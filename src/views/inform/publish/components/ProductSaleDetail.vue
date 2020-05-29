<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm"  >
        <!--人员-->
        <div v-if="targetType==1">
        <el-table ref="addressTable"
              :data="list"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="listLoading"
              border>
          <el-table-column type="selection" width="60" align="center"></el-table-column>
          <!-- <el-table-column label="序号" width="100" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column> -->
		  <el-table-column label="序号" width="100" align="center" type="index">
		  
		  </el-table-column>
          <el-table-column label="人员" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
      		<el-table-column label="单位" align="center">
      		  <template slot-scope="scope">{{scope.row.companyName}}</template>
      		</el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :page-size="listQuery.pageSize"
            :page-sizes="[5,10,15]"
            :current-page.sync="listQuery.pageNum"
            :total="total">
          </el-pagination>
        </div>
        </div>

        <!--公司-->
        <div v-else>
            <el-table ref="addressTable"
                  :data="listTempCard"
                  style="width: 100%"
                  @selection-change="handleSelectionChangeTempCard"
                  v-loading="listLoadingTempCard"
                  border>
              <el-table-column type="selection" width="60" align="center"></el-table-column>
              <!-- <el-table-column label="序号" width="100" align="center">
                <template slot-scope="scope">{{scope.row.id}}</template>
              </el-table-column> -->
			  <el-table-column label="序号" width="100" align="center" type="index">
			  
			  </el-table-column>
            	<el-table-column label="单位" align="center">
            	  <template slot-scope="scope">{{scope.row.name}}</template>
            	</el-table-column>
            </el-table>
         </div>
        <div style="clear: both;overflow: hidden;"></div>
      <el-form-item style="text-align: center;margin-top: 20px;">
        <el-button size="medium" @click="handlePrev">上一步</el-button>
        <el-button type="primary" size="medium" @click="handleNext">完成</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Bus from '@/utils/Bus'
  import {companyList,getAdminList} from '@/api/inform/publish'
  import {inspectorList,changeToTempCard,changeToTempCardBatch,DeleteSingle,deleteBatch} from '@/api/setting/InspectorController'

  export default {
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        targetType:null,
        activeName: 'first',
        operateType: null,
        listQuery: {
          state: 1,
          pageNum: 1,
          pageSize: 10
        },
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],


        operateTypeTempCard: null,
        listQueryTempCard: {
          state: 1,
          pageNum: 1,
          pageSize: 10
        },
        listTempCard: null,
        totalTempCard: null,
        listLoadingTempCard: false,
        multipleSelectionTempCard: [],
      }
    },
    created() {
       Bus.$on('targetType', (e,n) => {
         if(e==0){
           this.targetType=0;
					 this.companyListOn();
         }else{
           this.targetType=1;
					 this.getList(n);
         }
       })
			console.log(this.value)

    },
    // 解决$on接收多次的问题
     beforeDestroy(){
       Bus.$off("targetType")
     },
    computed: {

    },
    methods: {
      companyListOn(){
        this.listLoading = true;
        companyList({pageNum:1,pageSize:100}).then(response => {
          this.listLoading = false;
          this.listTempCard=response.data.list;
        });
      },
      getList(n) {
        this.listLoading = true;
				console.log(n)
				if(n==0){
					getAdminList(this.listQuery).then(response => {
					  this.listLoading = false;
						var data=[];
						response.data.list.map((value,index,arry)=>{
							 data.push({'id':value.id, 'name': value.nickName, 'companyName': value.companyName })
						})
					  this.list = data;
					  this.total = response.data.total;
					  this.totalPage = response.data.totalPage;
					  this.pageSize = response.data.pageSize;
					});
				}else{
					inspectorList(this.listQuery).then(response => {
					  this.listLoading = false;
					  this.list = response.data.list;
					  this.total = response.data.total;
					  this.totalPage = response.data.totalPage;
					  this.pageSize = response.data.pageSize;
					});
				}

      },
      handleSelectionChange(val) {
				console.log(val)
        this.multipleSelection = val;
				var targetType=this.targetType
				if(targetType==0){

				  this.$emit('NoticeTarget',this.multipleSelectionTempCard);
				}else{

				  this.$emit('NoticeTarget',this.multipleSelection);
				}
      },

      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },

      handleSelectionChangeTempCard(val) {
				console.log(val)
        this.multipleSelectionTempCard = val;
				var targetType=this.targetType
				if(targetType==0){
				  console.log(this.multipleSelectionTempCard)
				  this.$emit('NoticeTarget',this.multipleSelectionTempCard);
				}else{
				  console.log(this.multipleSelection)
				  this.$emit('NoticeTarget',this.multipleSelection);
				}
      },

      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('finishCommit',this.isEdit);
        // var targetType=this.targetType
        // if(targetType==0){
        //   console.log(this.multipleSelectionTempCard)
        //   this.$emit('NoticeTarget',this.multipleSelectionTempCard);
        // }else{
        //   console.log(this.multipleSelection)
        //   this.$emit('NoticeTarget',this.multipleSelection);
        // }

      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
