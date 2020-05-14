<template> 
  <div>
  <div class="app-container" v-show='$route.meta.showRole'>
		<router-view/>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAdd()"
        size="mini">
        添加
      </el-button>



    </el-card>
    <div class="table-container">
			
      <el-card class="operate-container" shadow="never">
				
        <el-tree
          :data="treeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <span  class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
						<span>{{ data.region }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => handleUpdate(data)">
                修改
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => handleDelete( data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-card>
    </div>
  </div>
  <router-view ></router-view>
  </div>
</template>

<script>

import {fetchList,deleteCompany} from '@/api/company'

    var jsonTree = function (data,config) {
    //1.声明了变量，拿到传参过来的值，注意这里拿到的是string类型，不是对应的值
    var id = config.id || 'id',
        pid = config.pid || 'pid',
        children = config.children || 'children';
        var idMap = [],
        newIdMap = [],
        jsonTree = [];
  /*2.v[id]==v[“id”]==v.id
    idMap数组的下标对应着id为下标的相应json数据
    a[1]对应着id为1的json数据，以此类推*/
    data.forEach(function(v){
      idMap[v[id]] = v;
    });
    //3拿到当前遍历的父元素id
  /*			根据父元素id，判断数组里是否存在这样一条数据
        存在，就判断父元素是否有子元素数组，若没有就添加一个children数组（传参过来的）
        把当前元素添加父元素的children数组里
        不存在，就直接添加到jsonTree里*/
    data.forEach(function(v){
      var parent = idMap[v[pid]];
      //定义一个newIdMap
      //delete v.parent;//删除{v}的parent和id
      //delete v.id;
      v.label = v.name 
			v.region=v.province + ',' + v.city
      if(parent) {
        !parent[children] && (parent[children] = []);
        parent[children].push(v);
      } else {
        jsonTree.push(v);
      }
    });
		console.log(jsonTree)
    return jsonTree;
  };

  export default {
    name: 'companyList',
    data() {
      return {
        treeData: null,
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 100
        },
        list: null,
        total: null,
        listLoading: false,
      }
    },
    created() {
      this.getList();


    },
		watch: {
		    $route(to,from) {
				//console.log(to)
				if(to.path==='/setting/company'){
					this.getList();
				}
			}
		},
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
          this.totalPage = response.data.totalPage;
          this.pageSize = response.data.pageSize;

          	this.treeData = jsonTree(this.list, {
              id: 'id',
              pid: 'parentId',
              children: 'children'
				    })
						console.log(this.treeData)
        });
      },
      handleUpdate( row) {
        this.$router.push({path: '/setting/company/company/update', query: {id: row.id}})
      },
      handleDelete( row) {

        this.$confirm('是否要删除单位及其子单位', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCompany(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });

      },
      handleAdd() {
        this.$router.push({path: '/setting/company/company/add'})
      }
    }
  }
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
		
  }
	.el-tree-node__content{border-bottom:1px solid #ccc; padding:10px 0px; height:auto }

</style>
