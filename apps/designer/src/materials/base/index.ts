import type { Component } from 'vue';

export const MATERIAL_MAPPING = new Map<string, MaterialItem>();

interface MaterialItem<T extends Record<string, any> = Record<string, any>> {
  id: string
  name: string
  icon: string
  size: { width: number, height: number }
  renderComponent: Component
  paneComponent: Component
  props: T
}

export function registerMaterial<T extends Record<string, any>>(option: MaterialItem<T>) {
  const { id } = option;

  if (MATERIAL_MAPPING.has(id)) {
    throw new Error(`${id} is already registered`);
  }

  MATERIAL_MAPPING.set(id, option);
}

export function getMaterial(id: string) {
  return MATERIAL_MAPPING.get(id);
}
