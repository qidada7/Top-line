<template>
  <div>
      <!-- 频道闹独立 -->
<el-select v-model="nowm" placeholder="请选择">
    <el-option
      v-for="item in heroList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
</template>

<script>
export default {
  props: {
    chid: {
      default: '' // 接受文章修改传来的值，默认值为 ''
    }
  },
  watch: {
    nowm (newv) {
      this.$emit('slt', newv)
    },
    chid (newv) {
      this.nowm = newv
    }
  },
  created () {
    this.heros()
  },
  //   props:{

  //   },
  data () {
    return {
      heroList: [],
      nowm: ''
    }
  },
  methods: {
    heros () {
      this.$http({
        url: '/mp/v1_0/channels',
        method: 'GET'
      })
        .then(rst => {
          // console.log(rst)
          this.heroList = rst.data.data.channels // 通过查看rst的数据找到对应的数组
        })
        .catch(() => {
          return this.$message.error('英雄走丢了')
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
