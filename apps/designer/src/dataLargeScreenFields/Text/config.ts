type TextAlign = 'left' | 'center' | 'right' | 'justify';

export const MenuConfig = {
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
    fontWeight: 'normal',
    verticalAlign: 'top',
  },
};

export type TextProps = typeof Props;
