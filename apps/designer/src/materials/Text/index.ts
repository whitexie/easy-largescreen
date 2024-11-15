import { registerMaterial } from '@/materials/base';
import { MenuConfig, Props, type TextProps } from './config';
import Pane from './Pane.vue';
import Text from './Text.vue';

registerMaterial<TextProps>({
  ...MenuConfig,
  renderComponent: Text,
  paneComponent: Pane,
  props: Props,
});
