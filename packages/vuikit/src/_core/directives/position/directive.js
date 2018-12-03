import { css } from 'vuikit/src/_core/utils/style'
import { warn } from 'vuikit/src/_core/utils/debug'
import { assign } from 'vuikit/src/_core/utils/object'
import { trigger } from 'vuikit/src/_core/utils/event'
import { toggleClass } from 'vuikit/src/_core/utils/class'
import { positionAt, flipPosition } from 'vuikit/src/_core/utils/dimensions'
import { isObject, isUndefined } from 'vuikit/src/_core/utils/lang'
import { BEFORE_POSITION, AFTER_POSITION } from './constants'

export default {
  inserted (el, binding, vnode) {
    const ctx = getContext(el, binding, vnode)

    if (ctx) {
      position(ctx)
    }
  },
  componentUpdated (el, binding, vnode) {
    const ctx = getContext(el, binding, vnode)

    if (ctx) {
      position(ctx)
    }
  }
}

function position (ctx) {
  const { el, props, vnode } = ctx
  const { target, position, offset, boundary, flip, mainClass } = props

  if (process.env.NODE_ENV !== 'production' && !position.match(/^((top|bottom)-(left|center|right))|((left|right)-(top|center|bottom))$/)) {
    warn(`[Vuikit v-position]: Invalid position: '${position}'.`, vnode)
  }

  if (process.env.NODE_ENV !== 'production' && (!target || !target.tagName)) {
    warn(`[Vuikit v-position]: Invalid target.`, vnode)
  }

  let [dir, align] = position.split('-')

  trigger(el, BEFORE_POSITION)

  // remove any position class
  const classesRx = new RegExp(`${mainClass}-(top|bottom|left|right)(-[a-z]+)?`)
  el.className = el.className.replace(classesRx, '')

  // reset pos
  css(el, { top: '', left: '' })

  const axis = getPositionAxis(position)

  const elAttach = axis === 'x'
    ? `${flipPosition(dir)} ${align}`
    : `${align} ${flipPosition(dir)}`

  const targetAttach = axis === 'x'
    ? `${dir} ${align}`
    : `${align} ${dir}`

  const elOffset = axis === 'x'
    ? `${dir === 'left' ? -1 * offset : offset}`
    : ` ${dir === 'top' ? -1 * offset : offset}`

  const targetOffset = null
  const { x, y } = positionAt(
    el,
    target,
    elAttach,
    targetAttach,
    elOffset,
    targetOffset,
    flip,
    boundary
  ).target

  dir = axis === 'x' ? x : y
  align = axis === 'x' ? y : x

  // add position class
  toggleClass(el, `${mainClass}-${dir}-${align}`, offset === false)

  trigger(el, AFTER_POSITION)
}

/**
 * Get the directive props
**/
function getOptions (ctx) {
  const { vnode } = ctx
  const { value } = ctx.binding

  if (process.env.NODE_ENV !== 'production' && (isUndefined(value) || !isObject(value))) {
    warn('[Vuikit v-position]: Configuration is missing or is not an Object.', vnode.context)
  }

  const options = assign({
    target: null,
    position: 'top-center',
    boundary: window,
    flip: true,
    offset: false,
    mainClass: ''
  }, value)

  return options
}

/**
 * Get the context used across
**/
function getContext (el, binding, vnode) {
  const ctx = { el, binding, vnode }
  ctx.props = getOptions(ctx)

  if (!ctx.props) {
    binding.def.unbind(el, binding)
    return
  }

  return ctx
}

function getPositionAxis (position) {
  const [dir] = position.split('-')
  return dir === 'top' || dir === 'bottom'
    ? 'y'
    : 'x'
}