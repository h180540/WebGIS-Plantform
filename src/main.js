import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import VueAMap from 'vue-amap'

import { library } from '@fortawesome/fontawesome-svg-core'


import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
library.add(faUserSecret)

const app = createApp(App)

app.use(VueAMap)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router);
app.use(ElementPlus)
app.mount('#app')

