<template>
  <div class="app-container">
    <el-form :inline="true" :model="userInfo" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="userInfo.authStatus" clearable placeholder="认证状态">
          <el-option label="已注册" value="registered"></el-option>
          <el-option label="资料未完善" value="autoAuditing"></el-option>
          <el-option label="等待审核中" value="waitingManual"></el-option>
          <el-option label="等待通过" value="waitingThrough"></el-option>
          <el-option label="认证通过" value="succeed"></el-option>
          <el-option label="认证失败" value="failed"></el-option>
          <el-option label="身份证已经注册" value="cardIdUsed"></el-option>
          <el-option label="永久拒绝" value="neverRefuse"></el-option>
          <el-option label="用户已销户" value="closed"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="userInfo.creditStatus" placeholder="信任状态" clearable>
          <el-option label="正常" value="0"></el-option>
          <el-option label="永久冻结" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="userInfo.idCard" placeholder="身份证"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="userInfo.name" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="userInfo.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="userInfo.username" placeholder="用户号"></el-input>
      </el-form-item>
      <el-form-item prop="proxyUserId">
        <el-input v-model="userInfo.proxyUserId" placeholder="代理编号"></el-input>
      </el-form-item>
      <el-form-item prop="time">
        <el-date-picker v-model="userInfo.time" type="daterange" align="left" placeholder="选择日期范围" :picker-options="pickerOptions"
          @change="dataChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button style='margin-bottom:20px;' type="primary" icon="search" @click="handleDownload" :loading="downloadLoading">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row height="500">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="客户编号" prop='id'>
      </el-table-column>
      <el-table-column label="注册时间" prop="time1">
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="author">
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile">
      </el-table-column>
      <el-table-column label="认证状态" align="center" prop="state">
      </el-table-column>
      <el-table-column label="信任状态" align="center" prop="creditStatus">
      </el-table-column>
      <el-table-column label="借款状态" align="center" prop="loanStatus">
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="cardId">
      </el-table-column>
      <el-table-column label="信任额度" align="center" prop="quota">
      </el-table-column>
      <el-table-column label="已使用额度" align="center" prop="quota">
      </el-table-column>
      <el-table-column label="累计借款" align="center" prop="quota">
      </el-table-column>
      <el-table-column label="代理人" align="center" prop="company">
      </el-table-column>
      <el-table-column label="渠道ID" align="center" prop="quota">
      </el-table-column>
      <el-table-column label="注册类型" align="center" prop="registerStatus">
      </el-table-column>
      <el-table-column label="平台" align="center" prop="registerStatus">
      </el-table-column>
      <el-table-column label="操作" align="center" prop="name">
        <template scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index, list)" type="text" size="small">
            客户档案
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, list)" type="text" size="small">
            冻结
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, list)" type="text" size="small">
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="30" layout="total, prev, pager, next, jumper"
        :total="totalNumber">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    fetchAuditList
  } from '@/api/customer'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        downloadLoading: false,
        userInfo: {
          idCard: null,
          name: null,
          creditStatus: null, // 信任状态
          authStatus: null, // 认证状态
          mobile: null, // 手机号
          userId: null, // 用户号
          username: null, // 用户名
          proxyUserId: null, // 代理编号
          time: null, // 时间范围
          auditUser: null, // 审核人
          claimUser: null // 认领人
        },
        userInfoState: {
          min: null, // 认领下限
          max: null // 认领上限
        },
        currentPage: 1,
        totalNumber: null,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        rules: {
          mobile: [{
            required: false,
            message: '情输入正确的手机号',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        fetchAuditList(this.currentPage).then(response => {
          this.list = response.data.items
          this.totalNumber = response.data.total
          this.listLoading = false
        })
      },
      handleDownload() {
        this.downloadLoading = true
        // 提交成功
        this.$message({
          message: '查询成功',
          type: 'success'
        })
        this.downloadLoading = false
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 分页模块回调函数
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      deleteRow(index, rows) {
        rows.splice(index, 1)
      }
    }
  }

</script>
