<script name="TextPane" lang="ts" setup>
import type { DataLargeScreenField } from '@/types/dataLargeScreen';
import type { TextProps } from './config';
import { useThemeVars } from 'naive-ui';
import DropDown from './components/DropDown.vue';
import { Horizontal_Alignment_Options, Vertical_Alignment_Options } from './constanst';

interface Props {
  widget: DataLargeScreenField<TextProps>
}

const props = defineProps<Props>();
const themeVars = useThemeVars();
const fontSizeOptions = [6, 8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48].map(num => ({ label: `${num}px`, value: num }));

const primaryColor = computed(() => themeVars.value.primaryColor);
const textStyle = computed(() => {
  return props.widget.props.style;
});

function setBold() {
  textStyle.value.fontWeight = textStyle.value.fontWeight ? '' : 'bold';
}
function setItalic() {
  textStyle.value.fontStyle = textStyle.value.fontStyle ? '' : 'italic';
}
function setStyle(type: 'underline' | 'line-through') {
  // console.log('before setStyle => ', textStyle.value);
  if (textStyle.value.textDecorationLine.includes(type)) {
    textStyle.value.textDecorationLine = textStyle.value.textDecorationLine.replace(type, '').trim();
  }
  else {
    textStyle.value.textDecorationLine = [textStyle.value.textDecorationLine, type].join(' ');
  }
}
</script>

<template>
  <div class="text-pane">
    <n-collapse :default-expanded-names="['1', '2']" class="mt-4">
      <n-collapse-item title="文本内容" name="1">
        <div class="px-2">
          <n-input v-model:value="widget.props.content" type="textarea" />
        </div>
      </n-collapse-item>
      <n-collapse-item title="文本样式" name="2">
        <div class="px-2">
          <div class="flex items-center gap-1">
            <n-color-picker v-model:value="textStyle.color" size="small" class="w-28px">
              <template #label>
                <span class="text-sm" />
              </template>
            </n-color-picker>
            <n-select v-model:value="textStyle.fontSize" size="small" class="w-80px" :options="fontSizeOptions" />
          </div>
          <div class="flex items-center justify-between gap-1 mt-2 border-solid py-1 px-1 pl-2 border-color-#e8e8f0">
            <div class="w-60px">
              样式
            </div>
            <div class="flex flex-1 items-center justify-around gap-2">
              <!--  -->
              <div :class="{ 'actived-style': textStyle.fontWeight }" class="w-1em h-1em cursor-pointer i-mingcute:bold-fill" @click="setBold" />
              <div :class="{ 'actived-style': textStyle.fontStyle }" class="w-1em h-1em cursor-pointer i-mingcute:italic-fill" @click="setItalic" />
              <div :class="{ 'actived-style': textStyle.textDecorationLine.includes('underline') }" class="w-1em h-1em cursor-pointer i-mingcute:underline-fill" @click="setStyle('underline')" />
              <div :class="{ 'actived-style': textStyle.textDecorationLine.includes('line-through') }" class="w-1em h-1em cursor-pointer i-mingcute:strikethrough-line" @click="setStyle('line-through')" />
            </div>
          </div>

          <div class="flex items-center justify-between gap-1 mt-2 border-solid py-1 px-1 pl-2 border-color-#e8e8f0">
            <div class="w-60px">
              对齐
            </div>
            <div class="flex flex-1 items-center justify-around gap-2">
              <DropDown v-model="widget.props.style.textAlign" :options="Horizontal_Alignment_Options" />
              <DropDown v-model="widget.props.style.verticalAlign" :options="Vertical_Alignment_Options" />
            </div>
          </div>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
.actived-style {
  color: v-bind(primaryColor);
}
</style>
