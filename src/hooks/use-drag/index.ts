import { watchEffect, onUnmounted } from 'vue'
import { getTargetElement } from '@/utils/util'
import type { BasicTarget } from '@/types/dom/dom-target'
export interface Options {
  onDragStart?: (event: DragEvent) => void
  onDragEnd?: (event: DragEvent) => void
}
type Uneffect = () => void

export const useDrag = <T>(data: T, target: BasicTarget, options: Options = {}) => {
  let _unEffect: Uneffect | undefined
  const _effect = () => {
    if (_unEffect) _unEffect()
    const targetElement = getTargetElement(target)
    if (!targetElement?.addEventListener) {
      return
    }
    const onDragStart = (event: DragEvent) => {
      options.onDragStart?.(event)
      event.dataTransfer?.setData('custom', JSON.stringify(data))
    }

    const onDragEnd = (event: DragEvent) => {
      options.onDragEnd?.(event)
    }

    targetElement.setAttribute('draggable', 'true')
    targetElement.addEventListener('dragstart', onDragStart)
    targetElement.addEventListener('dragend', onDragEnd)
    return () => {
      targetElement.removeEventListener('dragstart', onDragStart)
      targetElement.removeEventListener('dragend', onDragEnd)
    }
  }

  const stop = watchEffect(() => {
    _unEffect = _effect()
  })

  onUnmounted(() => {
    _unEffect && _unEffect()
    stop && stop()
  })
}
