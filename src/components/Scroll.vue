<template>
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot>
  </div>
</template>
 
<script >
  import BScroll from 'better-scroll'
  export default {
    props: {
      probeType: {
        /**
       * probeType属性如下: 
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
        type: Number,
        default: 1
      },
      click: {
        //点击列表是否派发click事件
        type: Boolean,
        default: false
      },
      // 是否开启横向滚动
      scrollX: {
        type: Boolean,
        default: false
      },
      // 是否派发滚动事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        //列表的数据
        type: Array,
        default: null
      },
      pullup: {
        // 是否派发滚动到底部的事件，用于上拉加载
        type: Boolean,
        default: false
      },
      pulldown: {
        // 是否派发顶部下拉的事件，用于下拉刷新
        type: Boolean,
        default: false
      },
      beforeScroll: {
        // 是否派发列表滚动开始的事件
        type: Boolean,
        default: false
      },
      refreshDelay: {
        // 当数据更新后，刷新scroll的延时
        type: Number,
        default: 20
      }
    },
    mounted() {
      //在 DOM 渲染完毕后初始化 better-scroll
      this.$nextTick(()=>{
        this.initScroll();
      })
    },
    methods: {
      // 初始化滚动组件，拿不到 this.$refs.wrapper 代码不往下走
      initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        // better-scroll 初始化, 传入配置项参数
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          mouseWheel: true,//开启鼠标滚轮
          disableMouse: false,//启用鼠标拖动
          disableTouch: false//启用手指触摸
        })
        // console.log(this.scroll);
        // 是否派发滚动事件
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        // 上拉事件
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // 滚动到底部
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              // 派发滚动到底部的事件
              this.$emit('scrollToEnd')
            }
          })
        }
        //下拉事件
        if (this.pulldown) {
          this.scroll.on('touchEnd', (pos) => {
            // 下拉动作
            if (pos.y > 50) {
              // 下拉刷新
              this.$emit('pulldown')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            // 列表滚动前触发
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        // 代理 better-scroll 的 disable 方法，禁用BScroll
        this.scroll && this.scroll.disable()
      },
      enable() {
        // 代理 better-scroll 的 enable 方法，启用BScroll
        this.scroll && this.scroll.enable()
      },
      refresh() {
        // 代理 better-scroll 的 refresh 方法
        // 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 代理 better-scroll 的 scrollTo 方法
        // 相对于当前位置偏移滚动 x,y 的距离。
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        // 代理 better-scroll 的 scrollToElement 方法
        // 滚动到指定的目标元素
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      //监听数据的变化，重新计算高度
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>
 
<style scoped lang="less" >
  .scroll-wrapper {
    width: 100%;
    // height: 100%;
    overflow: hidden;
  }
</style>