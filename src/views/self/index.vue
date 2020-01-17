<template>
  <div>

     <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
       <div class="text item">
         <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
             <el-radio v-model="searchForm.status" label>全部</el-radio>
          </el-form-item>
         </el-form>
       </div>
     </el-card> -->
     <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>卡片名称</span>
    <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
  </div>
  <div id='left'>
  <el-form ref='accjiao' label-width="80px" :rules="accRule" :model="accountForm"  style="marginLeft:60px;marginTop:30px">
        <!-- 活动名称 -->
  <el-form-item label="活动名称" prop='name'>
    <el-input  v-model="accountForm.name"  ></el-input>
  </el-form-item>
  <el-form-item label="手机号码"   >
    <el-input v-model="accountForm.mobile" disabled ></el-input>
  </el-form-item>
  <el-form-item label="邮箱"  prop='email' >
    <el-input v-model="accountForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="简介"  >
    <el-input v-model="accountForm.intro" type='textarea'  ></el-input>
  </el-form-item>
  <el-form-item>
            <el-button type="primary" @click="ti()">更新账户</el-button>
          </el-form-item>
  </el-form>
  </div>
  <!-- 头像展示列表 -->
  <div id="rt">
    <!-- action : 表示接受附件的服务器端地址 -->
    <!-- show-file-list='false' 表示上传好的图片要不要以列表形式展示 -->
    <!-- ：on-success=''图片上传成功 后的回调处理 -->
    <!-- : http-request='' 自定义上传行为，有了此属性，那么action和on-seccess都可以删除不用 -->
    <el-upload
  class="avatar-uploader"
  action=""
  :show-file-list="false"
  :http-request="httpRequest"

  >
  <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar">
  <!-- 判断获取的数据是否有图片信息，如果没有就填入默认图标 -->
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

  </div>
</el-card>
  </div>

</template>

<script>
import car from '@/utils/car.js'
export default {
  created () {
    this.getAccountInfo()
  },
  name: 'Account',
  data () {
    return {
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '', // 简介
        photo: ''
      },
      accRule: {
        name: [
          { required: true, message: '英雄怎么能没有名字' },
          { min: 1, max: 7, message: '名字不能太长也不能太短' }
        ],
        email: [
          { required: true, message: '得让我联系到你呀' },
          { type: 'email', message: '格式有点毛病' }
        ]
      }
    }
  },
  methods: {
    // 自定义请求上传图片
    httpRequest (rst) {
      console.log(rst)
      let pp = rst.file
      let fd = new FormData()
      fd.append('photo', pp)
      this.$http({
        url: '/mp/v1_0/user/photo',
        method: 'PATCH',
        data: fd

      }).then(rst => {
        this.$message.success('又有新头像了')
        // console.log(rst)
        this.accountForm.photo = rst.data.data.photo
        car.$emit('carphoto', this.accountForm.photo)// 兄弟传值
      }).catch(() => {
        this.$message.error('换脸失败')
      })
    },

    ti () { // 点击修改页面， 进行表单验证，成功后，把表单数据发往服务端
      this.$refs.accjiao.validate(valid => {
        if (!valid) { return false }// 如果表单有误，就返回
        let pro = this.$http({
          url: '/mp/v1_0/user/profile',
          method: 'patch',
          data: this.accountForm
        })
        pro
          .then(result => {
            // console.log(result)
            // 成功提示
            this.$message.success('更新成功！')
            car.$emit('carName', this.accountForm.name)
          })
          .catch(err => {
            return this.$message.error('更新账户信息失败：' + err)
          })
      })
    },
    getAccountInfo () { // 获取个人信息
      let pro = this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'get'
      })
      pro
        .then(result => {
          // console.log(result)
          // 把获得好的账户信息赋予给 accountForm
          this.accountForm = result.data.data// 获取到的信息赋值给表单，用来展示在页面
        })
        .catch(err => {
          return this.$message.error('获得账户信息失败：' + err)
        })
    }

  }
}
</script>

<style lang="less" scoped>
#left{
  width:50%;
  float:left;
  .el-form-item /deep/ .el-textarea__inner{
    height: 200px
  }
}
#rt{
  float: left;
  // background-color: pink;
  width: 200px;
  height: 200px;
  margin-left: 300px;
  margin-top: 50px;
  img{
    width: 400px
  }

}
</style>
