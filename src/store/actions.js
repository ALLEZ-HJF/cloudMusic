import {
  RECEIVE_INDEXBANNER,
  SAVE_AUDIOINFO,
  SAVE_AUDIOURL
} from './mutation-type'
import {
  reqIndexBanner
} from '../api/index'
export default {
  // 异步获取主页轮播图信息
  async getIndexBanner ({ commit }) {
    const result = await reqIndexBanner()
    commit(RECEIVE_INDEXBANNER, { indexBanner: result })
  },
  saveAudioInfo ({ commit }, audioInfo) {
    commit(SAVE_AUDIOINFO, { audioInfo })
  },
  saveAudioUrl ({ commit }, audioUrl) {
    commit(SAVE_AUDIOURL, { audioUrl })
  }
}
