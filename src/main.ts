import App from './App.vue';
import { createApp } from 'vue';
import './assets/css/main.css';
import './samples/node-api';
import Toast, { POSITION, useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createPinia } from 'pinia';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';
import './assets/css/theme.css';
import './assets/css/animation.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(Toast, {
    transition: 'Vue-Toastification__fade',
    maxToasts: 20,
    newestOnTop: true
});
app.use(VueTippy, {
    directive: 'tooltip',
    component: 'tippy',
    componentSingleton: 'tippy-singleton',
    defaultProps: {
        theme: 'dark',
        placement: 'auto-end',
        allowHTML: true
    }
});
const toast = useToast();
app.config.errorHandler = function (err) {
    if (err instanceof Error) {
        toast.error(err.message, {
            position: POSITION.TOP_RIGHT,
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            icon: true,
            rtl: false
        });
        console.error(err);
    } else {
        console.error(err);
    }
};
app.mount('#app');
