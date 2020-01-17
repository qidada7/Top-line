<template>
  <div>
      <el-card class='box-card'>
          <!-- 头部 -->
          <div slot="header" class="clearfix" style="height:49px;backgroundColor:#fdf9ed">
              <span id="cc">英雄都在下面</span>
              <el-upload
              style="float: right; padding: 3px 0"
  class="upload-demo"
  action=""
  :http-request="uppho"
  :show-file-list="false"

  >
    <el-button style="marginRight:200px;backgroundColor:#ab2424;color:#ffd04b;height:40px;width:90px" type="text">上传图片</el-button>

</el-upload>
          </div>
<!-- 主体 -->
<div class="text item" style="marginTop:80px">
<ul>
    <li class="image-box" v-for="item in poList" :key='item.id'>
        <img :src="item.url" >
        <div class="image-bot" >

            <el-button style="fontSize:40px" size='medium' type="success" icon="el-icon-star-off" circle></el-button>
            <el-button @click="del(item.id)"  type="danger" size='medium' icon="el-icon-delete"  style="marginLeft:50px;fontSize:40px;marginTop:10px" circle></el-button>

          </div>
    </li>
</ul>

</div>
      </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getpot()// 展示图片
  },
  data () {
    return {
      poList: []// 图片列表
    }
  },
  methods: {
    del (w) {
      console.log(w)

      this.$http({
        url: '/mp/v1_0/user/images/' + w,
        method: 'DELETE'
      }).then(rst => {
        this.$message.success('消灭了')
        this.getpot()
      }).catch(() => {
        this.$message.error('不好意思没干掉')
      })
    },
    uppho (rst) {
      let fd = new FormData()
      let ddd = rst.file
      fd.append('image', ddd)
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'post',
        data: fd
      }).then(rst => {
        // console.log(rst)
        this.poList.pop(rst.data.data)
        this.getpot()
      }).catch(() => {
        this.$message.error('上传好像失败了')
      })
    },
    getpot () { // 获取图片列表
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: {
          page: 1,
          per_page: 8
        }
      }).then(rst => {
        this.poList = rst.data.data.results// 真实图片赋值
      }).catch(() => {
        this.$message.error('图片走丢了')
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 素材图片列表样式
.image-box {
  list-style: none;
  width: 369px;
  height: 330px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;

  img {
    width: 369px;
    height: 174px;
  }
  .image-bot {
    width: 355px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    .image-bot /deep/ .el-icon-star-off{
        font-size: 51px
    }
  }
}
#cc{
    font-size: 30px;
    color:#ab2424
}
</style>
