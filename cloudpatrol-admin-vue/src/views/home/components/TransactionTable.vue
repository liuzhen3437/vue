<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="地点名称" align="center">
      <template slot-scope="scope" >
        {{ scope.row.addressName}}
      </template>
    </el-table-column>
    <el-table-column label="高危概率"  align="center">
      <template slot-scope="scope">
        {{ scope.row.riskRate}}
      </template>
    </el-table-column>
    <el-table-column label="时间不合格数"  align="center">
      <template slot-scope="{row}">
        {{ row.typeMinimumError}}
      </template>
    </el-table-column>
		<el-table-column label="漏检数"  align="center">
		  <template slot-scope="{row}">
		    {{ row.typeMissing}}
		  </template>
		</el-table-column>
		<el-table-column label="错序数" align="center">
		  <template slot-scope="{row}">
		    {{ row.typeSeqError}}
		  </template>
		</el-table-column>
		<el-table-column label="异常次数" align="center">
		  <template slot-scope="{row}">
		    {{ row.typeUnusual}}
		  </template>
		</el-table-column>
  </el-table>
</template>

<script>
import {listHighrisk} from '@/api/home/home'


const defaultListQuery = {
	  startDate: new Date(new Date(new Date().toLocaleDateString()).getTime() -24 * 60 * 60 * 1000*7).getTime(),
	  endDate: new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000-1).getTime(),
		pageNum:1,
		pageSize:5
	};
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null,
			listQuery: Object.assign({}, defaultListQuery),
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      listHighrisk(this.listQuery).then(response => {
        console.log(response);
				this.list=response.data.list
      })
    }
  }
}


function startDateTimestamp(){
	
			var data = new Date(); //本月
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
			
			var data1 = new Date(); // 下月
			if (data.getMonth() == 11){
				data1.setMonth(0)
			}else{
				data1.setMonth(data.getMonth() + 1)
			}
			data1.setDate(1);
			data1.setHours(0);
			data1.setSeconds(0);
			data1.setMinutes(0);
			return data.getTime()
		}
		
		function endDateTimestamp(){
			var data = new Date(); //本月
			data.setDate(1);
			data.setHours(0);
			data.setSeconds(0);
			data.setMinutes(0);
			var data1 = new Date(); // 下月
			if (data.getMonth() == 11){
				data1.setMonth(0)
			}else{
				data1.setMonth(data.getMonth() + 1)
			}
			data1.setDate(1);
			data1.setHours(0);
			data1.setSeconds(0);
			data1.setMinutes(0);
			return data1.getTime()-1000
		}
</script>
