import FloatingVue, { placements } from 'floating-vue';
import 'floating-vue/dist/style.css';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(FloatingVue, {
        themes: {
            'tooltip-border-primary': {
                $extend: 'tooltip'
            },

            'dropdown-select': {
                $extend: 'dropdown',
                $resetCss: true
            },

            menu: {
                $extend: 'dropdown',
                $resetCss: true
            },
            'menu-transparent': {
                $extend: 'menu',
                $resetCss: true
            }
        }
    });
});
