import {
  RECEIVE_INDEXBANNER
} from './mutation-type'
import {
  reqIndexBanner
} from '../api/index'
export default {
  // 异步获取主页轮播图信息
  async getIndexBanner ({ commit }) {
    const result = await reqIndexBanner()
    commit(RECEIVE_INDEXBANNER, { indexBanner: result })
  }
}
