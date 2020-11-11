import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { VuetifyPreset } from 'vuetify/types/services/presets';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/es5/util/colors';
import { Touch, ClickOutside, Scroll, Resize } from 'vuetify/lib/directives';
import ja from 'vuetify/src/locale/ja';

const preset: VuetifyPreset = {
  breakpoint: {
    scrollBarWidth: 14,
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1280,
      lg: 1920,
    },
    mobileBreakpoint: 100
  },
  lang: {
    current: 'en',
    locales: { ja },
    t: undefined as any,
  },
  rtl: false,
  theme: {
    dark: false,
    default: 'light',
    disable: false,
    options: {
      cspNonce: undefined,
      customProperties: undefined,
      minifyTheme: undefined,
      themeCache: undefined,
    },
    themes: {
      light: {
        primary: colors.lightBlue.darken4, // #00BCD4
        secondary: colors.pink.lighten3, // #F48FB1
        accent: colors.teal.base, // #009688
        error: colors.red.lighten1, // #EF5350
        info: colors.purple.base, // #9C27B0
        success: colors.green.base, // #4CAF50
        warning: colors.yellow.accent4 // #FFD600
      },
      dark: {
        primary: colors.lightBlue.darken4, // #00BCD4
        secondary: colors.pink.lighten3, // #F48FB1
        accent: colors.teal.base, // #009688
        error: colors.red.lighten1, // #EF5350
        info: colors.purple.base, // #9C27B0
        success: colors.green.base, // #4CAF50
        warning: colors.yellow.accent4 // #FFD600
      },
    },
  },
  icons: {
    iconfont: 'mdi',
    values: {}
  }
};

Vue.use(Vuetify, {
  directives: {
    Touch, ClickOutside, Scroll, Resize
  }
});

export default new Vuetify(preset);
