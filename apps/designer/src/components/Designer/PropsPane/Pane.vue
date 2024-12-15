<script lang="ts" setup>
import { NForm, NFormItem, NInputGroup, NInputGroupLabel } from 'naive-ui';
import PagePane from './PagePane.vue';
import { useWidgetPane } from './useWidgetPane';

const { widget, widgetPane } = useWidgetPane();
</script>

<template>
  <div class="bg-white flex w-330px h-full transition-width border-l-solid border-#f2f2f2">
    <div class="w-full h-full">
      <div class="title select-none flex h-36px justify-center items-center border-b-solid border-#f2f2f2 px-2">
        <span>{{ widget ? widget.menuConfig.name : '页面设置' }}</span>
      </div>
      <PagePane v-if="!widget" />
      <template v-else>
        <NForm v-if="widget" class="mt-2" label-placement="left" :label-width="80" size="small">
          <div>
            <NFormItem label="图层位置">
              <div>
                <NInputGroup>
                  <NInputGroupLabel size="small">
                    X
                  </NInputGroupLabel>
                  <n-input-number
                    v-model:value="widget.location.x"
                    :step="1"
                  />
                </NInputGroup>
                <NInputGroup class="mt-1">
                  <NInputGroupLabel size="small">
                    Y
                  </NInputGroupLabel>
                  <n-input-number
                    v-model:value="widget.location.y"
                    :step="1"
                  />
                </NInputGroup>
              </div>
            </NFormItem>

            <NFormItem label="图层尺寸">
              <div>
                <NInputGroup>
                  <NInputGroupLabel size="small">
                    W
                  </NInputGroupLabel>
                  <n-input-number
                    v-model:value="widget.size.width"
                    :step="1"
                  />
                </NInputGroup>
                <NInputGroup class="mt-1">
                  <NInputGroupLabel size="small">
                    H
                  </NInputGroupLabel>
                  <n-input-number
                    v-model:value="widget.size.height"
                    :step="1"
                  />
                </NInputGroup>
              </div>
            </NFormItem>
          </div>
        </NForm>
        <component :is="widgetPane" :widget="widget" />
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
