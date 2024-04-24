import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify({}),
    presetIcons({
      // extraProperties: {
      //   'display': 'inline-block',
      //   'vertical-align': 'middle',
      // },
      cdn: 'https://cdn.skypack.dev/',
    }),
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
