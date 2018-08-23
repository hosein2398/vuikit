import Icon from '../assets/spinner'
import { mergeData } from 'vuikit/src/_core/utils/vue'

export default {
  functional: true,
  props: {
    ratio: {
      type: [String, Number]
    }
  },
  render (h, { props, data }) {
    return h('div', mergeData(data, {
      class: ['uk-icon', 'uk-spinner']
    }), [
      h(Icon, { props })
    ])
  }
}
