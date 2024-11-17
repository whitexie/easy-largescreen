export interface WidgetSize {
  width: number
  height: number
}

export interface MenuBaseConfig {
  id: string
  name: string
  icon: string
  size: WidgetSize
}

export interface WidgetModule {
  Props: Record<string, any>
  MenuConfig: MenuBaseConfig
}

export interface Widget {
  id: string
  name: string
  icon: string
  size?: {
    width: number
    height: number
  }
  menuConfig: MenuBaseConfig
  props: Record<string, any>
}

export interface DataLargeScreenField<T = Record<string, any>> {
  id: string
  name: string
  component: string
  size: {
    width: number
    height: number
  }
  location: {
    x: number
    y: number
  }
  isLock: boolean
  menuConfig: MenuBaseConfig
  props: T
  _el: null | HTMLElement
}

export interface MenuItem {
  id: string
  name: string
  type: 'field' | 'group'
  children?: MenuItem[]
  icon: string
}

export type AddWidgetOption = Partial<Pick<DataLargeScreenField, 'id' | 'name' | 'size' | 'location' | 'props'>>;

export interface MaterialProps<T extends Record<string, any> = Record<string, any>> {
  widget: DataLargeScreenField<T>
}
