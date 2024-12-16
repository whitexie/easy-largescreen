import type { MenuItem as _MenuItem } from '@/types/dataLargeScreen'
import { NPopover } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object as PropType<_MenuItem>,
      required: true,
    },
  },
  emits: ['clickMenu', 'dragstart'],
  methods: {
    handleClick(item: _MenuItem) {
      if (item.type === 'field')
        this.$emit('clickMenu', item)

      const popoverRef = this.$refs.popoverRef as typeof NPopover
      popoverRef?.setShow?.(false)
    },

    handleDragStart(e: DragEvent) {
      this.$emit('dragstart', e, this.item)
    },
  },
  render() {
    const props = this.$props

    const renderItem = (item: _MenuItem) => {
      const isGroup = item.type === 'group'
      return (
        <div draggable={!isGroup ? 'true' : 'false'} class="flex items-center select-none cursor-pointer px-2 h-30px hover:(rounded-l bg-#f2f2f2)" onClick={() => this.handleClick(item)} onDragstart={this.handleDragStart}>
          <div class={`${item.icon} w-18px h-18px`} />
          <div class="ml-1">
            {item.name}
          </div>
          {isGroup && <div class="i-material-symbols:expand-more-rounded w-15px h-15px" />}
        </div>
      )
    }

    const slots = {
      trigger: () => renderItem(props.item),
    }

    return props.item.type === 'field'
      ? renderItem(props.item)
      : (
          <NPopover ref="popoverRef" trigger="click" v-slots={slots}>
            <div class="grid grid-cols-2 gap-2">
              {props.item.children?.map(item => renderItem(item))}
            </div>
          </NPopover>
        )
  },
})
