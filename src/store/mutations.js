import {
  RECEIVE_INDEXBANNER
} from './mutation-type'
export default {
  [RECEIVE_INDEXBANNER] (state, { indexBanner }) {
    state.indexBanner = indexBanner
  }
}
