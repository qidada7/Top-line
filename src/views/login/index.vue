<template>
  <div class="login-container">
    <!-- <el-alert
    title="错误提示的文案"
    type="error">
    </el-alert>-->
    <div class="login-box" >
      <div>
        <img src="./image/logo.jpg" alt>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="logeinRule">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="输入你的id">
            <i slot="prefix" class="iconfont icon-yxlm" style="fontSize:20px;color:#fbe247"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="输入效验码">
            <i slot="prefix" class="iconfont icon-fenlei-yingxionglianmeng" style="fontSize:20px;color:#ab2424"></i>
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:left;" prop="xuan">
          <!-- prop的值必须和底下判断 true false的变量名一致 -->
          <el-checkbox v-model="loginForm.xuan" id='ck'>
            <span style='color:#ab2424'>我已经准备好进入峡谷</span>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button style="backgroundColor:#ab2424 " @click="ti()" :disabled="flag" :loading="flag">
            <span style="color:rgb(309, 222, 86);fontSize:18px">
            {{lige}}</span>
            </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import './gt.js'// 映入gt插件，为做极验做准备
import '@/assets/icon/iconfont.css'
export default {
  data () {
    var tiao = function (rule, value, callback) {
      // 定义好 自定义验证的函数，在下面调用
      //   if (value) {
      //     callback()
      //   } else {
      //     callback(new Error('请先做好心理准备'))
      //   }
      value ? callback() : callback(new Error('请先做好心理准备'))
    }
    return {
      lige: '进入 联盟',
      ctaObj: null,
      flag: false,
      loginForm: {
        mobile: '15686249878',
        code: '246810',
        xuan: true // 决定复选框的初始选中状态
      },
      logeinRule: {
        mobile: [
          { required: true, message: '召唤师，请留下你的联系方式' }, // 验证是否写入联系方式
          { pattern: /^1[35789]\d{9}$/, message: '联系不到你了' } // 验证填写的手机号是否通过正则，如果错误，则提示message的内容
        ],
        code: [{ required: true, message: '出示验证码' }], // 验证 是否写入验证码；

        xuan: [{ validator: tiao }] // 自定义验证表单，验证协议
      }
    }
  },
  methods: {

    ti () { // 点击事件，验证表单填写内容，这是建立在以上的各项验证之上
      this.$refs.loginFormRef.validate(valid => { // 表单必须设置ref才可以进行验证
        if (!valid) { // 判断valid是否为true，为true则验证通过
          return alert('召唤师，先填表')
        }// 如果表单不通过就返回，通过后进行以下操作

        // 极验请求

        if (this.ctaObj !== null) { //  判断极验的容器是否生成
          return this.ctaObj.verify()
        }
        this.flag = true // 设置按钮禁用
        this.lige = '单杀李哥，你就是首发'
        this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'GET'
        }).then(result => {
          // console.log(result) // 极验的秘钥信息

          // 从result里边解构下述的data对象出来(对象结构赋值)
          let { data } = result.data
          // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
          window.initGeetest({
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: true,
            product: 'bind' // 设置验证窗口样式的
          },
          captchaObj => {
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.onReady(() => {
              // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
              captchaObj.verify() // 显示验证码窗口

              this.ctaObj = captchaObj// 给这个对象赋值
              this.flag = false// 设置按钮恢复
              this.lige = '你还在犹豫什么'
            }).onSuccess(() => {
              // 行为校验正确的处理
              // B. 验证账号，登录系统,将验证登录封装成一个方法，在这里调用
              this.deng()
            }).onError(() => {
              // 行为校验错误的处理
            })
          })
        })
          .catch(err => {
            return this.$message.error('获取极验秘钥失败：' + err)
          })
      })
    },
    deng () { //
    // axiso进行请求验证账号安全
      this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'POST',
        data: {
          mobile: this.loginForm.mobile,
          code: this.loginForm.code
        }
      })
        .then(rst => {
          // console.log(rst)
          // 利用守卫来判断登录状态,因为里面只能存入JSON格式的字符串，所以得将对象转化为JSON格式的字符串。
          window.sessionStorage.setItem('shou', JSON.stringify(rst.data.data))
          this.$router.push('/home')
        })
        .catch(() => {
          this.$message.error('召喚師走丟了')
        })// 如果在catch中设置了形参就必须在函数内用 形参，不然会报错
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background: url("./image/skt.jpg") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    display: block;
    width: 410px;
    height: 345px;
    background-color: #fff;
    text-align: center;

    .el-button {
      width: 100%;
    }
    .el-form {
      //   text-align: center;
      width: 70%;
      margin: 0 auto;
    }
    img {
      height: 50px;
      margin: 15px 0;
    }
  }
}
</style>
<style >
/* 修改多选框背景颜色 */
#ck.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #ab2424;
  border-color:#ab2424;
}

</style>
