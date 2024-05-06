import { defineComponent } from 'vue'
import { NPopover } from 'naive-ui'
import { Icon } from '@iconify/vue'
import type { MenuItem as _MenuItem } from '@/types/dataLargeScreen'

export default defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object as PropType<_MenuItem>,
      required: true,
    },
  },
  emits: ['clickMenu'],
  methods: {
    handleClick(item: _MenuItem) {
      if (item.type === 'field')
        this.$emit('clickMenu', item)

      const popoverRef = this.$refs.popoverRef as typeof NPopover
      popoverRef?.setShow?.(false)
    },
  },
  render() {
    const props = this.$props
    const renderItem = (item: _MenuItem) => {
      return (
        <div class="flex items-center select-none cursor-pointer px-2 h-30px hover:(rounded-l bg-#f2f2f2)" onClick={() => this.handleClick(item)}>
          <Icon icon={item.icon} style="width: 18px; height: 18px" />
          <div class="ml-1">
            {item.name }
          </div>
          {item.type === 'group' && <Icon icon="material-symbols:expand-more-rounded" style="width: 15px; height: 15px" />}

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
