<template>
  <div class="app-container">
    <el-form :inline="true" :model="userInfo" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="userInfo.idCard" placeholder="身份证"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="userInfo.name" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="userInfo.mobile" placeholder="手机号"></el-input>
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
      <el-table-column label="提交时间" align="center" prop="time2">
      </el-table-column>
      <el-table-column label="认领人" align="center" prop="author">
      </el-table-column>
      <el-table-column label="认领时间" align="center" prop="time3">
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="name">
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="mobile">
      </el-table-column>
      <el-table-column label="身份证号" align="center" prop="cardId">
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="state">
      </el-table-column>
      <el-table-column label="审领人" align="center" prop="auditor">
      </el-table-column>
      <el-table-column label="操作" align="center" prop="name">
        <template scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index, list)" type="text" size="small">
            查看
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
          allocationState: null, // 领取状态
          authStatus: null, // 认证状态
          mobile: null, // 手机号
          userId: null, // 用户号
          auditUser: null, // 审核人
          claimUser: null // 认领人
        },
        currentPage: 1,
        totalNumber: null,
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
