import { defineConfig, presetAttributify, presetIcons, presetUno, transformerVariantGroup } from 'unocss';
import unoIconList from './uno-icon-list';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify({}),
    presetIcons({
      // extraProperties: {
      //   'display': 'inline-block',
      //   'vertical-align': 'middle',
      // },
      // cdn: 'https://cdn.skypack.dev/',
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
  safelist: [
    ...unoIconList,
  ],
  rules: [
    [/^w-(calc\[.*\])/, ([, d]) => {
      return { width: d.replace('[', '(').replace(']', ')').replace('+', ' + ').replace('-', ' - ') };
    }],
    [/^h-(calc\[.*\])/, ([, d]) => {
      return { height: d.replace('[', '(').replace(']', ')').replace('+', ' + ').replace('-', ' - ') };
    }],
  ],
});
