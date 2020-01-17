<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发布新文章</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
<!-- 总表单 -->
      <el-form ref="forms" :model="form" label-width="80px" :rules="Formadd" style="marginLeft:60px;marginTop:30px">
        <!-- 活动名称 -->
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

 <el-radio-group  v-model="form.cover.type" style="fontSize:20px">
    <el-radio :label="0">无图</el-radio>
    <el-radio :label="1">一图</el-radio>
    <el-radio :label="3">三图</el-radio>
    <el-radio :label="-1">自动</el-radio>
    <!-- 显示图片 -->
   <ul>
  <li class="uploadbox" v-for="item in lis" :key="item" @click="show(item)">
    <!-- 这里的lis是选择的type  3个图片是lis=3  所有item 是1 2 3  -->
    <span>点击图标选择图片</span>
    <img v-if="form.cover.images[item-1]" :src="form.cover.images[item-1]" alt="" />
    <div v-else class="el-icon-picture-outline"></div>

  </li>
</ul>

  </el-radio-group>

</el-form-item>
<!-- 选择频道 -->
<el-form-item label="选择频道" prop="channel_id">

  <chanNe @slt='seletH'></chanNe>

</el-form-item>
<!-- 创建按钮 -->
  <el-form-item label="创建按钮">
    <el-button type="primary" @click="jian(false)">立即发布</el-button>
    <el-button  @click="jian(true)">存入草稿</el-button>
  </el-form-item>

</el-form>
 <!-- @close是对话框的关闭事件，任何条件关闭对话框，都会执行该事件 -->
   <!-- 显示对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
    >
    <!-- 显示切换tabs -->
    <el-tabs type="border-card">
  <el-tab-pane label="素材库" >
    <ul>
      <li class="image-box" v-for="item in imageList " :key="item">
        <img :src="item.url" alt="" @click="clkImage">
      </li>
    </ul>
    </el-tab-pane>
  <el-tab-pane label="上传图片"  >
    <el-button style="backgroundColor:#891d1d;color:#fac334;marginLeft:900px"> 点击上传</el-button>
  </el-tab-pane>

</el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imageOK()">确 定</el-button>
      </span>
    </el-dialog>
<!-- 以下是注释 -->
     <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"  // 设定对话框是否显示
      width="30%" // 对话框宽度限制
      :before-close="handleClose" // 关闭前的回调处理
      >
      <span>这是一段信息</span> // 对话框主体内容(匿名插槽体现)
      <span slot="footer" class="dialog-footer"> // (命名插槽)
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->

 </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor' // 引入深度选择器模块
import chanNe from '@/components/channel.vue'// 独立的频道
export default {
  created () {
    this.getImageList()
  },
  computed: {
    lis () {
      if (this.form.cover.type > 0) {
        return this.form.cover.type
      } else {
        return 0
      }
    }
  },
  components: {
    quillEditor,
    chanNe
  },
  watch: {
    'form.cover.type': {// 监听type的变换，type改变以后就将存储图片列表清空
      deep: true,
      handler: function (newV, oldV) {
        this.form.cover.images = []// 清空图片存储
      }

    }
  },
  data () {
    return {
      xu: 0,
      materialUrl: '', // 选中的素材图片的路径名地址信息
      imgl: '', // 临时接受图片地址
      activeName: 'first', // 默认激活标签
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      dialogVisible: false, // 默认对话框不弹出
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

    // 在页面中显示
    imageOK () {
      // console.log('123')

      if (this.materialUrl) {
        // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.form.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('咋地，一个都没有相中！')
      }
      console.log(this.form.cover.images)

      // 取消高亮显示
      let ll = document.querySelectorAll('.image-box')
      for (var i = 0; i < ll.length; i++) {
        ll[i].style.border = ''// 排他思想
      }
    },
    // 设置点击图片，实现高亮显示
    clkImage (evt) {
      let ll = document.querySelectorAll('.image-box')
      for (var i = 0; i < ll.length; i++) {
        ll[i].style.border = ''// 排他思想
      }
      let lm = evt.target.parentNode // 选中点击的li标签
      lm.style.border = '2px solid #ab2424'// 给选中的图片设置边框
      // console.log(evt.target.currentSrc)

      this.materialUrl = evt.target.src// 获取点击图片的地址
    },
    // 获取图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
      pro
        .then(result => {
          // console.log(result)
          // imageList接收素材图片
          this.imageList = result.data.data.results
          // console.log(this.imageList)
        })
        .catch(err => {
          return this.$message.error('获得图片列表失败：' + err)
        })
    },
    // 显示对话框
    show (n) {
      this.xu = n - 1

      this.dialogVisible = true// 显示对话框
    },
    seletH (val) {
      this.form.channel_id = val
    },
    jian (flag) {
      this.$refs.forms.validate(valid => {
        if (!valid) {
          return this.$message.error()('先填表')
        }
        this.$http.post(
          '/mp/v1_0/articles', this.form, { params: { draft: flag }
          }).then((rst) => {
          this.$message.success('文章发布成功')
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

.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}

// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
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
  img {
    width: 200px;
    height: 150px;
  }
}
.quill-editor /deep/ .ql-container {//深度选择器
  height: 270px;
}
</style>
