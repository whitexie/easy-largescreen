<script lang="ts" setup>
import { useTemplateRef } from 'vue';

interface OptionItem {
  value: string
  icon: string
}
interface Props {
  modelValue: string
  options: OptionItem[]
}
const props = defineProps<Props>();
const showPane = ref(false);
const panePosition = reactive({ top: 0, left: 0 });
const triggerRef = useTemplateRef<HTMLDivElement>('triggerRef');

const modelValue = defineModel('modelValue');

const currentValueIcon = computed(() => {
  const item = props.options.find(item => item.value === modelValue.value);
  // console.log('currentValueIcon item => ', item);
  return item ? item.icon : props.options[0].icon;
});

const panePositionStyle = computed(() => {
  const { left, top } = panePosition;
  return {
    left: `${left}px`,
    top: `${top}px`,
  };
});

function onShowPane() {
  if (!triggerRef.value) {
    return;
  }
  showPane.value = true;
  const { left, top, height } = triggerRef.value.getBoundingClientRect();
  panePosition.left = left;
  panePosition.top = top + height + 5;
}

function onHiddenPane() {
  showPane.value = false;
}

function handleClick(item: OptionItem) {
  modelValue.value = item.value;
  showPane.value = false;
}
</script>

<template>
  <div class="dropdown relative text-16px">
    <div
      ref="triggerRef" :class="{ 'bg-#e0e0e0': showPane }" class="cursor-pointer flex items-center p-1 px-2"
      @click="onShowPane"
    >
      <div :class="currentValueIcon" class="w-1em h-1em" />
      <div class="i-akar-icons:triangle-down-fill w-1em h-1em" />
    </div>
    <Teleport v-if="showPane" to="body">
      <div class="mask absolute left-0 top-0 w-full h-full z-1023" @click="onHiddenPane" />
      <div class="pane absolute z-1024 flex items-center gap-1 bg-white shadow p-1" :style="panePositionStyle">
        <!--  -->
        <div
          v-for="item in options" :key="item.value"
          class="wrap p-1 hover:(bg-#e0e0e0) flex justify-center items-center"
        >
          <div
            :class="item.icon" class="w-1em h-1em text-16px cursor-pointer color-black "
            @click="handleClick(item)"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
