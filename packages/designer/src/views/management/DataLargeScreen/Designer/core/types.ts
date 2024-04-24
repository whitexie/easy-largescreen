type offsetX = number;
type offsetY = number;

export interface DataLargeScreenField {
  id: string
  name: string
  component: string
  location: [offsetX, offsetY]
  props: Record<string, any>
}
