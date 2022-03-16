import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import SvgIcon from '@/components/SvgIcon.vue'

import router from '@/router'

import '@/style/index.css'

const store = createPinia()
store.use(piniaPluginPersist)

const app = createApp(App)

app.component('SvgIcon', SvgIcon)

app.use(store)
app.use(router)
app.mount('#app')
