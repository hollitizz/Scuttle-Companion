export default defineNuxtConfig({
    electron: {
        build: [
            {
                // Main-Process entry file of the Electron App.
                entry: 'electron/main.ts'
            },
            {
                entry: 'electron/preload.ts',
                // @ts-ignore
                onstart(options) {
                    // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                    // instead of restarting the entire Electron App.
                    options.reload();
                }
            }
        ],
        renderer: {}
    },

    css: [
        '@/assets/css/main.css',
        '@/assets/css/fonts.css',
        '@/assets/css/animations.css',
        '@/assets/css/toast.css',
        '@/assets/css/tooltip.css'
    ],

    modules: [
        'nuxt-electron',
        '@pinia/nuxt',
        'floating-vue/nuxt',
        '@nuxt/devtools'
    ],

    pinia: {
        //@ts-ignore
        autoImports: ['defineStore', ['defineStore', 'definePiniaStore']]
    },

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },

    build: {
        transpile: ['vue-toastification', 'vue-squircle']
    },
});
