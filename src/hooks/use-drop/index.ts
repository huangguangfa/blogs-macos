import { onUnmounted } from 'vue'
import type { BasicTarget } from '@/types/dom/dom-target'
import { getTargetElement } from '@/utils/util'

export interface DropOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDom?: (content: unknown, event?: DragEvent) => void
  onDragEnter?: (event?: DragEvent) => void
  onDragOver?: (event?: DragEvent) => void
  onDragLeave?: (event?: DragEvent) => void
  onDrop?: (event?: DragEvent) => void
}
type Uneffect = () => void

export const useDrop = (target: BasicTarget, options: DropOptions = {}) => {
  let dragEnterTarget: EventTarget | null
  let _unEffect: Uneffect | undefined

  const _effect = () => {
    if (_unEffect) _unEffect()
    const targetElement = getTargetElement(target)
    if (!targetElement?.addEventListener) {
      return
    }

    const onData = (dataTransfer: DataTransfer, event: DragEvent | ClipboardEvent) => {
      const dom = dataTransfer.getData('custom')

      if (dom && options.onDom) {
        let data = dom
        try {
          data = JSON.parse(dom)
        } catch (e) {
          data = dom
        }
        options.onDom(data, event as DragEvent)
        return
      }
    }

    const onDragEnter = (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      dragEnterTarget = event.target
      options.onDragEnter?.(event)
    }

    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
      options.onDragOver?.(event)
    }

    const onDragLeave = (event: DragEvent) => {
      if (event.target === dragEnterTarget) {
        options.onDragLeave?.(event)
      }
    }

    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      onData(event.dataTransfer as DataTransfer, event)
      options.onDrop?.(event)
    }

    targetElement.addEventListener('dragenter', onDragEnter)
    targetElement.addEventListener('dragover', onDragOver)
    targetElement.addEventListener('dragleave', onDragLeave)
    targetElement.addEventListener('drop', onDrop)

    return () => {
      targetElement.removeEventListener('dragenter', onDragEnter)
      targetElement.removeEventListener('dragover', onDragOver)
      targetElement.removeEventListener('dragleave', onDragLeave)
      targetElement.removeEventListener('drop', onDrop)
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
