<script lang="ts" setup>
interface Field {
  id: string
  name: string
  type: string
}

interface Props {
  title: string
  type: 'metric' | 'dimension'
  fields: Field[]
}

const props = defineProps<Props>();

const cssVars = computed(() => {
  const result = {
    '--field-color': '',
  };

  if (props.type === 'dimension') {
    result['--field-color'] = '#4a90e2';
  }
  else { result['--field-color'] = '#40c0a8'; }

  return result;
});

const icon = computed(() => {
  return props.type === 'dimension' ? 'i-material-symbols:abc-rounded' : 'i-material-symbols:123-rounded';
});
</script>

<template>
  <div class="field-pane text-xs" :style="cssVars">
    <div class="px-2 h-36px flex justify-between items-center select-none">
      <span>
        {{ title }}
      </span>
    </div>
    <div>
      <div
        v-for="field in fields"
        :key="field.id"
        class="field-item px-2 h-28px flex items-center gap-1 select-none"
      >
        <div :class="icon" class="field-icon size-2em hover:color-white" />
        <span>
          {{ field.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.field-pane {
  --field-color: #4a90e2;
  padding-bottom: 20px;

  .field-item:hover {
    background: var(--field-color);
    color: white;
    .field-icon {
      color: white;
    }
  }
  .field-icon {
    color: var(--field-color);
  }
}
</style>
