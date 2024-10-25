import { defineConfig, presetAttributify, presetIcons, presetUno, transformerVariantGroup } from 'unocss';

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
    'i-mingcute:align-left-line',
    'i-mingcute:align-center-line',
    'i-mingcute:align-right-line',
    'i-mingcute:align-justify-line',
    'i-line-md:arrow-close-up',
    'i-line-md:arrow-align-middle',
    'i-line-md:arrow-close-down',
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
