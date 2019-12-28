import {
  RECEIVE_INDEXBANNER,
  SAVE_AUDIOINFO,
  SAVE_AUDIOURL
} from './mutation-type'
export default {
  [RECEIVE_INDEXBANNER] (state, { indexBanner }) {
    state.indexBanner = indexBanner
  },
  [SAVE_AUDIOINFO] (state, { audioInfo }) {
    state.audioInfo = audioInfo
  },
  [SAVE_AUDIOURL] (state, { audioUrl }) {
    state.audioUrl = audioUrl
  }
}
