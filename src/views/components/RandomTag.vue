<template>
  <div
    class="tags"
  >
    <span style="font-size:10px;padding-left:0px">"{{ sender }}"说:</span>
    <span
      :style="{fontSize:normalSize+'px',paddingLeft:normalPadding+'px'}"
      class="name"
    >

      {{ tname }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    tname: { type: String, default: '' },
    sender: { tyep: String, default: '' }
  },
  data() {
    return {
      setColor: '#fff',
      normalSize: 10,
      normalPadding: 0
    }
  },
  mounted() {
    this.setColor = this.$randomHslColor2()
    this.normalSize = this.$Normal(15, 10)
    this.normalPadding = this.$Normal(10, 10)
  },
  methods: {
    /* 随机颜色rgb*/
    $randomColor() {
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    /* 随机颜色hsl*/
    $randomHslColor2() {
      return (
        'hsl(' +
        Math.round(Math.random() * 360) +
        ',' +
        Math.round(Math.random() * 100) +
        '%,' +
        Math.round(Math.random() * 80) +
        '%)'
      )
    },
    $Normal(mean, sigma) {
      var u = 0.0
      var v = 0.0
      var w = 0.0
      var c = 0.0
      do {
        // 获得两个（-1,1）的独立随机变量
        u = Math.random() * 2 - 1.0
        v = Math.random() * 2 - 1.0
        w = u * u + v * v
      } while (w === 0.0 || w >= 1.0)
      c = Math.sqrt((-2 * Math.log(w)) / w)
      return mean + u * c * sigma
    }
  }
}
</script>

<style scoped>
div
{
    transition: fontSize 2s,  transform 2s;
    -webkit-transition: width 2s, height 2s, -webkit-transform 2s;
}
.name{
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-bottom : 20px;
}
</style>
