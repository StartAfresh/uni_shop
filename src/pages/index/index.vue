<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { http } from '@/utils/http'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'
import HotPanel from './components/HotPanel.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
// 定义组件的类型
import type { XtxGuessInstance } from '@/types/components'

let isLoding = ref(true)
// 获取轮播图数据
const bannerList = ref([])
// 获取分类数据
const categoryList = ref([])
// 获取轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
// 获取分类数据
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

// 获取热门推荐数据
const hotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

// 获取猜你喜欢组件实例
const guessRef = ref<XtxGuessInstance>()
onLoad(async () => {
  isLoding.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  isLoding.value = false
})

// 滚动到底部加载更多
const onScrolltolower = () => {
  guessRef.value?.getMore()
}

// 下拉刷新
let isTriggered = ref(false)
let onRefresherrefresh = async () => {
  // 开启动画
  isTriggered.value = true
  // 重置数据
  guessRef.value.resetData()
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  // 关闭动画
  isTriggered.value = false
}
</script>
<template>
  <CustomNavbar />
  <scroll-view
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
    scroll-y
    class="scroll-view"
    @scrolltolower="onScrolltolower"
  >
    <PageSkeleton v-if="isLoding"></PageSkeleton>
    <template v-else>
      <XtxSwiper :bannerList="bannerList"></XtxSwiper>
      <CategoryPanel :categoryList="categoryList"></CategoryPanel>
      <HotPanel :hotList="hotList"></HotPanel>
      <XtxGuess ref="guessRef"></XtxGuess>
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
