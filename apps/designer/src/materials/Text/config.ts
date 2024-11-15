import type { MenuBaseConfig } from '@/types/dataLargeScreen';

type TextAlign = 'left' | 'center' | 'right' | 'justify';

export const MenuConfig: MenuBaseConfig = {
  id: 'text',
  name: '文本',
  icon: 'fluent:draw-text-24-regular',
  size: { width: 200, height: 40 },
};

export const Props = {
  content: '',
  style: {
    color: '#333333',
    fontSize: 14,
    fontStyle: '',
    textDecorationLine: '',
    textAlign: 'left' as TextAlign,
    fontWeight: '',
    verticalAlign: 'top',
  },
};

export type TextProps = typeof Props;
