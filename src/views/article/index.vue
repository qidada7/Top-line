<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="text item">
        <!--el-form搜索表单区域-->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio disabled>已删除</el-radio>
          </el-form-item>
          <el-form-item label="频道列表：">
<!-- 频道独立了 -->
            <chanNe @slt='seletH'></chanNe>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 表格table列表 -->
    <el-card class="box-card" style="marginTop:20px">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="artList" style="width:100%;">
          <!-- 以下成员prop绑定的是  响应到数据所对应的值 ，table自带v-for功能-->
          <el-table-column label="图标" width="300">
            <!-- 这里用了自定义插槽，来获取图片地址 -->
            <img
              v-if="stData.row.cover.images[0]"
              :src="stData.row.cover.images[0]"
              alt
              slot-scope="stData"
              style="width:150px;height:100px; borderRadius: 50%"
            >
            <img
              v-else
              src="./image/da.jpg"
              alt
              style="width:150px;height:100px; borderRadius: 50%"
            >
            <!-- 这里的默认地址是解析后的，  自己投机取巧，只可观赏，想要实现还得 用v- if 和v-else 来实现 -->
          </el-table-column>
          <el-table-column label="标题" prop="title" width="300"></el-table-column>
          <el-table-column label="状态" prop="status" width="200">
            <template slot-scope="st">
              <el-tag type="success" v-if="st.row.status===0">草稿</el-tag>
              <el-tag type="info" v-else-if="st.row.status===1">待审核</el-tag>
              <el-tag type="warning" v-else-if="st.row.status===2">审核通过</el-tag>
              <el-tag type="danger" v-else-if="st.row.status===3">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="std">
              <!-- 点击修改按钮跳转，后面带上id -->
            <el-button
            @click="$router.push(`/xiu/${std.row.id}`)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="small"
              style="marginRight:10px;backgroundColor:#ffd04b;borderColor:#fff"
            ></el-button>
            <el-button
            @click="del(std.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              style="marginRight:10px;backgroundColor:#ab2424;borderColor:#fff"
            ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页效果 -->
      <el-pagination
      style="marginLeft:304px;marginTop:25px;color:#ab2424"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.per_page"
        layout="total,sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
      <!-- @size-change="handleSizeChange"  // 每页显示条数变化的处理事件，需要methods方法配合 -->
      <!-- @current-change="handleCurrentChange" // 当前页码变化的回调处理事件，需要methods方法配合 -->
      <!-- :current-page="currentPage4" // 默认当前页码 1 -->
      <!-- :page-sizes="[100, 200, 300, 400]" // 下拉列表，设计每页显示条数的 -->
      <!-- :page-size="100" // 默认每页显示条数 -->
      <!-- layout="total, sizes, prev, pager, next, jumper" // 分页元素构成设计 -->
      <!-- :total="400" // 记录总条数 -->

    </el-card>
  </div>
</template>

<script>
import chanNe from '@/components/channel.vue'
export default {
  components: {// 频道独立了
    chanNe
  },
  created () {
    this.tableList()
  },
  data () {
    return {
      im: './image/da.jpg',
      tot: 1, // 记录table记录总数
      artList: [], // 获取表格展示数据
      // heroList: [], // 真实频道数据
      timetotime: [], // 获取到时间的 起始时间和最终时间
      searchForm: {// 方便与watch监听 统一管理事件
        status: '',
        channel_id: '', // 绑定频道数据
        begin_pubdate: '', // 开始时间
        end_pubdate: '', // 结束时间
        page: 1,
        per_page: 10
      }
    }
  },
  methods: {
    del (id) { // 删除文章
      this.$http({
        url: '/mp/v1_0/articles/' + id,
        method: 'DELETE'
      }).then(rst => {
        this.tableList()
        return this.$message.success('删除成功')
      }).catch(() => {
        return this.$message.error('删除失败了')
      })
    },
    handleSizeChange (val) { // 每页显示条数变换事件
      // console.log(val)
      this.searchForm.per_page = val
      // 利用watch监听所以就不用 再重新获取列表了
      // this.tableList()
    },
    handleCurrentChange (val) { // 当前页码变化的事件
      this.searchForm.page = val
      // this.tableList()
      // console.log(val)
    },
    // 请求表格table数据
    tableList () {
      // 把searchForm内部为空的成员都"过滤掉"
      var hl = {}
      for (var key in this.searchForm) {
        if (this.searchForm[key] !== '' || this.searchForm[key] === 0) {
          hl[key] = this.searchForm[key]
        }
      }
      // let searchData = {}
      // for (var i in this.searchForm) {
      //   // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
      //   if (this.searchForm[i] || this.searchForm[i] === 0) { //= ==0 是为了照顾状态栏有0对应的 数据
      //     // 成员值非空
      //     searchData[i] = this.searchForm[i]
      //   }
      // }
      // 发送请求
      this.$http({
        url: '/mp/v1_0/articles',
        method: 'get',
        params: hl// 传入过滤后的值
      })
        .then(rst => {
          // console.log(rst)

          this.artList = rst.data.data.results // 获取到的数据赋值给data成员
          this.tot = rst.data.data.total_count // 这个是总条数
          // this.searchForm.page = rst.data.data.page// 页码
          // this.searchForm.per_page = rst.data.data.per_page// 每页数量
        })
        .catch(() => {
          return this.$message.error('召唤师，你好像少了什么东西') // 错误401 没有token 或者token过期了，前往axs设置拦截器
        })
    },
    // 请求频道真实数据
    seletH (val) { // 频道独立了
      this.searchForm.channel_id = val
    }
  },
  // watch监听器
  watch: {
    searchForm: {// 监听searchForm  的事件  相当于给每个表单都加上了onchange事件
      handler: function (newV, oldV) {
        this.tableList()
      },
      deep: true
    },
    timetotime: function (newv, oldv) { // 获取起始时间和终止时间
      if (newv) {
        this.searchForm.begin_pubdate = newv[0]
        this.searchForm.end_pubdate = newv[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  }

}
</script>

<style lang="less" scoped>
</style>
