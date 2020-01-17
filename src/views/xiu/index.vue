<template>
  <div>
      <h1 style="textAlign:center">没错，我就是修改页面</h1>
      <el-form ref="forms" :model="form" label-width="80px" :rules="Formadd" style="marginLeft:60px;marginTop:30px">
  <el-form-item label="活动名称" prop="title">
    <el-input v-model="form.title" ></el-input>
  </el-form-item>
  <!-- 活动内容 -->
<el-form-item label="活动内容" prop="content">
    <!-- <el-input
  type="textarea"
  :rows="2"
  placeholder="请输入内容"
  v-model="form.content">
</el-input> -->
<quill-editor v-model="form.content"></quill-editor>
</el-form-item>
<!-- 选择图片 -->
<el-form-item label="选择图片">
 <el-radio-group v-model="form.cover.type" >
    <el-radio :label="1">一图</el-radio>
    <el-radio :label="-1">自动</el-radio>
    <el-radio :label="3">三图</el-radio>
    <el-radio :label="0">无图</el-radio>
     <!-- 显示图片 -->

  </el-radio-group>
  <ul>
  <li class="uploadbox" v-for="item in lis" :key="item" @click="show(item)">
    <!-- 这里的lis是选择的type  3个图片是lis=3  所有item 是1 2 3  -->
    <span>点击图标选择图片</span>
    <img v-if="form.cover.images[item-1]" :src="form.cover.images[item-1]" alt="" />
    <div v-else class="el-icon-picture-outline"></div>
  </li>
</ul>
</el-form-item>

<!-- 选择频道 -->
<el-form-item label="选择频道" prop="channel_id">
<chanNe @slt="seletH" :chid="form.channel_id"></chanNe>
</el-form-item>
<!-- 创建按钮 -->
  <el-form-item label="创建按钮">
    <el-button type="primary" @click="jian(false)">确认修改</el-button>
  </el-form-item>
</el-form>

<!-- 选择图片按钮 -->
<el-dialog title="提示" :visible.sync="dialogVisible" width="60%" @close="clearImage">
      <!-- 标签切换效果 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <!-- 素材图片列表展示 -->
          <ul>
            <li class="image-box" v-for="item in imageList" :key="item.id">
              <img :src="item.url" alt="没有图片" @click="clkImage" />
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <el-button type="primary">上传图片</el-button>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor' // 引入深度选择器模块
import chanNe from '@/components/channel.vue'// 独立的频道
export default {

  created () {
    this.zhidin()
    this.getimage()
  },
  components: {
    quillEditor,
    chanNe
  },
  computed: {
    aid () {
      return this.$route.params.aid// 获取到对应文章的id
    },
    lis () {
      if (this.form.cover.type < 0) {
        return 0
      } else {
        return this.form.cover.type
      }
    }
  },
  data () {
    return {
      materialUrl: '',
      activeName: 'first', // 默认激活标签
      imageList: [],
      xu: 0,
      dialogVisible: false, // 显示素材图片
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      // 遍历的频道
      form: {
        cover: {
          type: 0,
          images: []
        },
        title: '',
        content: '',
        channel_id: ''

      },
      // 表单验证
      Formadd: {
        title: [{ required: true, message: '标题必填' }, { min: 2, message: '标题不能少于2个字' }],
        content: [{ required: true, message: '大哥，你不能不写呀' }],
        channel_id: [{ required: true, message: '频道也写点呗' }]

      }

    }
  },
  methods: {
    // 真实存入数据
    imageOK () {
      let ll = document.querySelectorAll('.image-box')
      for (var i = 0; i < ll.length; i++) {
        ll[i].style.border = '' // 排他思想
      }
      this.form.cover.images[this.xu] = this.materialUrl
      this.dialogVisible = false
    },
    // 获取图片列表
    getimage () {
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      }).then((rst) => {
        // this.$message.success('获取列表成功')
        this.imageList = rst.data.data.results
      }).catch(() => {
        this.$message.error('毛都没捞到')
      })
    },
    // 高亮显示
    clkImage (evt) {
      let ll = document.querySelectorAll('.image-box')
      for (var i = 0; i < ll.length; i++) {
        ll[i].style.border = '' // 排他思想
      }
      let lm = evt.target.parentNode // 选中点击的li标签
      lm.style.border = '2px solid #ab2424'// 给选中的图片设置边框
      this.materialUrl = evt.target.src// 获取点击图片的地址
    },
    // 展示图片列表

    // 显示图片框
    show (n) {
      this.xu = n - 1 // 因为数组的下标是从0开始的，而item是从1开始的，和数组形式对应，方便于后期存储
      this.dialogVisible = true
    },
    zhidin () { // 指定数据请求
      this.$http.get(
        `/mp/v1_0/articles/${this.aid}`

      ).then(rst => {
        if (rst.data.message === 'OK') {
          // this.$message.success('获取英雄成功')
          this.form = rst.data.data
        }
      }).catch(() => {
        return this.$message.error('没获取到英雄')
      })
    },
    // 获取频道
    seletH (val) {
      this.form.channel_id = val
    },
    // 修改文章
    jian (flag) {
      this.$refs.forms.validate(valid => {
        if (!valid) {
          return this.$message.error()('先填表')
        }
        if (this.form.cover.type === -1) {
          this.form.cover.images.splice(0, 3)
        } else {
          this.form.cover.images.splice(this.form.cover.type, 3)
        }
        this.$http({
          url: '/mp/v1_0/articles/' + this.aid, // 传入的地址加id
          method: 'put',
          data: this.form,
          params: {
            draft: flag
          }

        }).then((rst) => {
          this.$message.success('修改文章成功')
          this.$router.push('/article')
        }).catch(() => {
          this.$message.error()('走半道被劫了')
        })
      })
    }

  }

}

</script>

<style lang="less" scoped>
.quill-editor /deep/ .ql-container {//深度选择器
  height: 400px;
}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  margin-left:50px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
    font-size: 20px;
    background-color: #fff;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img{
    width: 200px;
    height: 150px;
  }
}
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor:pointer;
  box-sizing:border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
