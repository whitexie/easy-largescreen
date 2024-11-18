import { registerMaterial } from '@/materials/base';
import { MenuConfig, Props, type TextProps } from './config';

registerMaterial<TextProps>({
  ...MenuConfig,
  // renderComponent: Text,
  // paneComponent: Pane,
  props: Props,
});
