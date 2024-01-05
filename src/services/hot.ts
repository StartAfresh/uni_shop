import { http } from '@/utils/http'
// 主要优点是可以减少编译后的 JavaScript 文件的大小
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'
// & 表示 交叉类型
type HotParams = PageParams & {
  subType?: string
}

export const getHotRecommendAPI = (url: string, data: HotParams) => {
  return http<HotResult[]>({
    method: 'GET',
    url,
    data,
  })
}
