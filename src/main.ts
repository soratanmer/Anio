import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import { VueQueryPlugin } from 'vue-query'
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import router from '@/router'

import '@/style/index.scss'

const store = createPinia()
store.use(piniaPluginPersist)

const app = createApp(App)

app.component('SvgIcon', SvgIcon).component('ButtonIcon', ButtonIcon)

app.use(store).use(router).use(VueQueryPlugin).mount('#app')
