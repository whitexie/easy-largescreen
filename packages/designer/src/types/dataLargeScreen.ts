type offsetX = number;
type offsetY = number;
type Width = number;
type Height = number;

export interface MenuBaseConfig {
  id: string
  name: string
  icon: string
  size?: [Width, Height]
}

export interface WidgetModule {
  Props: Record<string, any>
  MenuConfig: MenuBaseConfig
}

export interface Widget {
  id: string
  name: string
  icon: string
  size?: [Width, Height]
  menuConfig: MenuBaseConfig
  props: Record<string, any>
}

export interface DataLargeScreenField {
  id: string
  name: string
  component: string
  size: [Width, Height]
  location: [offsetX, offsetY]
  isLock: boolean
  menuConfig: MenuBaseConfig
  props: Record<string, any>
}

export interface MenuItem {
  id: string
  name: string
  type: 'field' | 'group'
  children?: MenuItem[]
  icon: string
}
