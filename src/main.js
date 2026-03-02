//1.punto de arranque de la app
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//Crea la aplicación usando App.vue como componente raíz
createApp(App)
  .use(router) //esta app usa Router Vue
  .mount('#app') //inserta la app dentro del div con id="app" del index.html
