<template>
  <el-container>
    <el-aside :width="zuo">
      <el-menu
        class="el-menu-vertical-demo"
        :collapse-transition="false"
        :router="true"
        :collapse="zhe"
        background-color="#ab2424"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index :style="{width:zuo}">
          <i class="el-icon-location"></i>
          <span slot="title">英雄首页</span>
        </el-menu-item>
        <el-submenu index="1" :style="{width:zuo}">
          <template slot="title">
            <i class="el-icon-menu"></i>

            <span>诺克萨斯</span>
          </template>

          <el-menu-item index="/toto">发布新英雄</el-menu-item>

          <el-menu-item index="/article">英雄列表</el-menu-item>

          <el-menu-item index="1-3">评论列表</el-menu-item>

          <el-menu-item index="/material">英雄素材</el-menu-item>
        </el-submenu>

        <el-menu-item index="/self" :style="{width:zuo}">
          <i class="el-icon-document"></i>
          <span slot="title">艾欧尼亚</span>
        </el-menu-item>
        <el-menu-item index="/fans" :style="{width:zuo}">
          <i class="el-icon-setting"></i>
          <span slot="title">德玛西亚</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="ll">
          <i :class="tit" @click="shou()"></i>
          <span @click="shou()">欢迎来到德莱联盟</span>
        </div>
        <div class="rr">
          <el-input type="text" placeholder="召唤师 说出你的本命英雄" style="width:300px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:10px 20px">英雄选择</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo" alt width="40" height="40" style="vertical-align: middle">
              <!-- 这里的数据是token自带的数据 -->
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>历史战绩</el-dropdown-item>
              <el-dropdown-item>MVP录制</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import car from '@/utils/car.js'
export default {
  created () {
    // 利用兄弟传值，来给home传值来 实现头像实时更新
    car.$on('carName', nm => { // nm就是传过来的值
      // console.log(nm)
      let ln = JSON.parse(window.sessionStorage.getItem('shou'))
      ln.name = nm
      this.lsname = nm// 赋值给临时接受的变量
      window.sessionStorage.setItem('shou', JSON.stringify(ln))
    })
    car.$on('carphoto', np => {
      let pp = JSON.parse(window.sessionStorage.getItem('shou'))
      pp.photo = np
      this.lsphoto = np
      window.sessionStorage.setItem('shou', JSON.stringify(pp))
    })
  },
  data () {
    return {
      tit: 'el-icon-s-fold',
      zhe: false, // 左侧列表是否折起
      zuo: '200px',
      lsname: '', // 因为token没有响应式，所以需要vue的变量来在中间作接受
      lsphoto: ''
    }
  },
  methods: {
    shou () {
      // 点击图标 左侧伸缩栏事件
      this.zhe = !this.zhe
      if (this.zhe) {
        this.zuo = '65px'
        this.tit = 'el-icon-s-unfold'
      } else {
        this.zuo = '200px'
        this.tit = 'el-icon-s-fold'
      }
    },

    logout () {
      this.$confirm('召唤师 要走了么', '提莫在看着你说', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push('/login')
          window.sessionStorage.removeItem('shou')
          this.$message({
            type: 'success',
            message: '我们有缘再见'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '还想再看一眼？'
          })
        })
    }
  },
  computed: {
    name () {
      return (
        this.lsname || JSON.parse(window.sessionStorage.getItem('shou')).name
      )
      // 要利用这个lsname临时变量在中间做接收修改后的名字，这样能够实现实时更新
    },
    photo () {
      return (
        this.lsphoto || JSON.parse(window.sessionStorage.getItem('shou')).photo
      )
      // 要利用这个lsphoto临时变量在中间做接收修改后的图片，这样能够实现实时更新
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  background-color: #ab2424;
  height: 100%;

  .el-header {
    position: relative;
    background-color: #bea181;
    .ll {
      position: absolute;
      left: 100px;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .rr {
      position: absolute;
      right: -150px;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        border-radius: 50%;
      }
    }
  }
  .el-main {
    background-color: #fefaee;
  }
}
</style>
